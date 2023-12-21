from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.helpers.custom_permissions import IsAdmin
from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags
from api.models import (
    Country,CountrySerializer,
    FilingPlan,FilingPlanSerializer,
    ActiveProduct,ActiveProductSerializer,
    Quarter,QuarterSerializer,
    OngoingQuarter,
    TemplateMessage, TemplateMessageSerializer,
    User,Partner
)
import os
from MPP_API.settings import quarter_list,quarter_mapping
from MPP_API.settings import FROM_EMAIL_ID
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.db.models import Count

class FillingAdminView(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'quarter', openapi.IN_QUERY, 
            type=openapi.TYPE_STRING, 
            required=False,
        )],
    )

    def get(self,request,pk):
        
        partner_id = pk
        
        rows = []
        product_order = {}
        product_type = {}
        FDF_status_dropdown = ["0","Filed","Registered","Filing-Planned"]
        API_status_dropdown = ["0","Filed","Registered"]

        ordered_quarter_list = list(Quarter.objects.order_by('-quarter_year', '-quarter_index'))
        previous_quarter = None
        if request.query_params.get('quarter') != None:
            quarter_name = request.query_params.get('quarter')
            quarter_obj = Quarter.objects.filter(quarter_name=quarter_name)[0]
            if len(ordered_quarter_list) > 1:
                q_1_quarter_index = ordered_quarter_list.index(quarter_obj)
                ongoing_quarter = ordered_quarter_list[q_1_quarter_index-1]
            else:
                ongoing_quarter=ordered_quarter_list[0] 
        else:
            ongoing_quarter = ordered_quarter_list[0]
            quarter_obj = ordered_quarter_list[1]
            if len(ordered_quarter_list) >= 3:
                previous_quarter = ordered_quarter_list[2]

        
        if ongoing_quarter != None:
            curr_index = ongoing_quarter.quarter_index
            curr_year = ongoing_quarter.quarter_year

            temp = quarter_mapping[quarter_list[curr_index]] + "-" + str(curr_year)[-2:]
            FDF_status_dropdown.append(temp)
            API_status_dropdown.append(temp)

            for i in range(3): # 3 Future quarters
                if (curr_index+1)%4 == 0:
                    curr_index = 0
                    curr_year += 1
                else:
                    curr_index += 1

                temp = quarter_mapping[quarter_list[curr_index]] + "-" + str(curr_year)[-2:]
                FDF_status_dropdown.append(temp)
                API_status_dropdown.append(temp)

        countries = Country.objects.filter(is_active=True).order_by('country_name')
        if not countries.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)

        active_products = ActiveProduct.objects.filter(partner_id=partner_id,is_active=True,product_id__category='FDF',productquarter__quarter_id=quarter_obj).order_by('active_product_id')
        # if not active_products.exists():
        #     return Response(status=status.HTTP_204_NO_CONTENT)

        q_1 = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]

        for country in countries:
            data = {}
            country_name = country.country_name
            data['country'] = country_name
            data['country_id'] = country.country_id

            for active_product in active_products:
                
                product = active_product.product_id

                if active_product.status == 'PLANNED' or active_product.status == 'ON_HOLD' or active_product.status == 'DROPPED':
                    continue
                
                product_order[product.product_name] = product.product_id
                product_type[product.product_name] = product.category
    
                filing_plan = FilingPlan.objects.filter(
                    active_product_id=active_product,
                    country_id=country,
                    quarter_id=quarter_obj
                ).first()

                if filing_plan == None and previous_quarter != None:
                    filing_plan = FilingPlan.objects.filter(
                        active_product_id=active_product,
                        country_id=country,
                        quarter_id=previous_quarter
                    ).first()

                if filing_plan != None:
                    data[product.product_name] = filing_plan.status

            rows.append(data)

        # # Now as admin is on Filing Plan screen, he has read messages if any. Hence set is_read to True in Database
        # message_obj = TemplateMessage.objects.filter(partner_id=partner_id,template_type='filing plan',is_partner_message=True)
        # # Check if messages exists because initially database is empty
        # if message_obj.exists():
        #     message_obj.update(is_read=True)

        # filing_status = False
        # template_status = TemplateMessage.objects.filter(
        #     partner_id=partner_id,
        #     quarter_id=q_1,
        #     is_partner_message=False,
        #     template_type="filing plan").last()
        # if template_status != None:
        #     filing_status = template_status.is_approved
        #     approval_time=template_status.updated_at
        # else:
        #     approval_time=None
        
        # partner_submission =  TemplateMessage.objects.filter(
        #     partner_id=partner_id,
        #     quarter_id=q_1,
        #     is_partner_message=True,
        #     template_type="filing plan").last()
        # # print('is_approved fs',filing_status)
        # if partner_submission:
        #     report_status='Submitted'
        #     submission_time = partner_submission.updated_at
        # else:
        #     report_status = 'Not Submitted'
        #     submission_time = None
        
        # if report_status =='Submitted' and filing_status == False:
        #     report_status='Submitted'
        #     filing_status=None
        # elif filing_status == True:
        #     report_status='Approved'
        # elif filing_status == False:
        #     report_status= 'Rejected'

        approval_time = None
        submission_time = None
        
        last_msg = TemplateMessage.objects.filter(
            partner_id=partner_id,
            quarter_id=quarter_obj,
            template_type="filing plan").last()
        
        if last_msg:
            if last_msg.is_partner_message == True:
                report_status = 'Submitted'
                submission_time = last_msg.updated_at
            elif last_msg.is_partner_message == False and last_msg.is_approved == True:
                report_status = 'Approved'
                approval_time = last_msg.updated_at
            elif last_msg.is_partner_message == False and last_msg.is_approved == False:
                report_status = 'Rejected'
                approval_time = last_msg.updated_at
        else:
            report_status = 'Not Submitted'        

        filing_meta = {
            "partner_name":Partner.objects.get(pk=partner_id).company_name,
            "quarter_name":quarter_obj.quarter_name,
            "report_status":report_status,
            "approval_time":approval_time,
            "submission_time":submission_time
        }

        product_details = []
        for product_name,product_id in product_order.items():
            product_details.append({
                "product_id":product_id,
                "product_name":product_name,
                "product_type":product_type[product_name]
            })

        # Check if new messages from partner
        unread_message_count = TemplateMessage.objects.filter(partner_id=partner_id,template_type='filing plan',is_read=False,is_partner_message=True).count()
        
        # Get messages to send. Convert Queryset to List
        messages = TemplateMessage.objects.filter(partner_id=partner_id,template_type='filing plan').values().order_by('-template_message_id')
        messages =[message for message in messages]
        
        quarter_dropdown = list(Quarter.objects.filter().order_by('-quarter_year', '-quarter_index').values_list('quarter_name',flat=True))
        quarter_dropdown.pop(0)
        
        if not active_products.exists():
            return Response(data={"filing_meta":filing_meta},status=status.HTTP_200_OK)

        return Response(data={"filing_meta":filing_meta,"rows":rows,"product_details":product_details,"status_dropdown":{"FDF":FDF_status_dropdown,"API":API_status_dropdown},'messages':messages,'unread_message_count':unread_message_count,'quarter_dropdown':quarter_dropdown},status=status.HTTP_200_OK)


    def post(self,request,pk):
        partner_id = pk
        data = request.data
        if request.query_params.get('quarter') != None:
            quarter_name = request.query_params.get('quarter')
            quarter_obj = Quarter.objects.filter(quarter_name=quarter_name)[0]
        else:
            quarter_obj = Quarter.objects.order_by('-quarter_year', '-quarter_index')[1]

        countries = Country.objects.all()
        if not countries.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)

        active_products = ActiveProduct.objects.filter(partner_id=partner_id,is_active=True)
        if not active_products.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)

        for country in countries:
            
            country_id = str(country.country_id)
            if data.get(country_id,None) == None:
                continue

            for active_product in active_products:
                product = active_product.product_id
                product_id = str(product.product_id)

                if data[country_id].get(product_id,None) == None:
                    continue

                try:
                    obj = FilingPlan.objects.get(active_product_id=active_product,country_id=country,quarter_id=quarter_obj)
                    obj.status = data[country_id][product_id]
                    obj.updated_by = request.user.id
                    obj.save()

                except FilingPlan.DoesNotExist:
                    FilingPlan.objects.create(
                        active_product_id = active_product,
                        country_id = country,
                        status = data[country_id][product_id],
                        quarter_id=quarter_obj,
                        created_by=request.user.id,
                        updated_by=request.user.id
                    )

        return Response(status=status.HTTP_200_OK)

class FilingPlanDecisionViewset(viewsets.ModelViewSet):
    
    permission_classes = [IsAdmin]
    serializer_class = TemplateMessageSerializer
    queryset = TemplateMessage.objects.filter(template_type='filing plan')

    def perform_create(self, serializer):
        partner_id=self.request.data['partner_id']
        message=self.request.data['message']
        if self.request.data['is_approved'] == True:
            status = 'Approved'
        else:
            status = 'Rejected'
        template_type = 'Filing Plan'
        api_link=os.getenv('API_LINK')
        link = str(api_link+'partner/filing-plans')
        
        partner_name = Partner.objects.filter(partner_id=partner_id).values_list('company_name',flat=True)[0] 
        to_email_id = User.objects.filter(id=partner_id).values_list('email',flat=True)[0]
        from_email_id = FROM_EMAIL_ID
        email_subject = str(template_type + ' Report has been ' + status)
        
        html_message = render_to_string('admin_approval.html', {'partner_name': partner_name.capitalize(),'message':message,'status':status,'template_type':template_type,'link':link,'api_link':api_link})
        plain_message = strip_tags(html_message)
    
        # send_mail(email_subject, plain_message, from_email_id, [to_email_id], html_message=html_message)

        # Update admin partner list template data when approved
        template_data = TemplateMessage.objects.filter(partner_id=partner_id,template_type='filing plan',is_partner_message=True).last()
        template_data.is_approved=self.request.data['is_approved']
        template_data.save()
         
        quarter_order=[]
        q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
        quarter_name = q_1_quarter.__dict__['quarter_name']
        serializer.save(quarter_id=q_1_quarter,quarter_name=quarter_name,template_type='filing plan')

class FilingPlanInboxAdmin(APIView):

    permission_classes = [IsAdmin]

    def post(self,request):
        unread_messages = TemplateMessage.objects.filter(template_type='filing plan',is_partner_message=True,is_read=False)
        unread_messages.update(is_read=True)
        return Response(data={'Read all unread messages'},status=status.HTTP_200_OK)