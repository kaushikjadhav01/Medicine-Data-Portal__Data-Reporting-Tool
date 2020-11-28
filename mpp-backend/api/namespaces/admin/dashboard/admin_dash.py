from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from api.helpers.custom_permissions import IsAdmin
from django.db.models import F
from django.db import connection
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from MPP_API.settings import quarter_list,quarter_mapping
from api.models import (
    ActiveProduct,Product,OngoingQuarter,
    Country,FilingPlan, Partner, User,
    UserNestedSerializer, TemplateMessage,
    Quarter, ProductQuarterDate, SalesReport
)
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

class AdminDashboard(APIView):

    permission_classes = [IsAdmin]
    serializer_class = UserNestedSerializer
    
    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'type', openapi.IN_QUERY, 
            type=openapi.TYPE_STRING, 
            required=True,
            enum=['all_three_submitted','not_submitted','saved_but_not_submitted','submitted_not_approved']
        )],
    )
    
    def get(self,request):
        
        if request.query_params['type'] == 'all_three_submitted':
            partners = User.objects.filter(role='PARTNER').order_by('partner__company_name')
            if not partners:
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                serializer = UserNestedSerializer(data=partners,many=True)
                serializer.is_valid()
            
                template_data_list=[]
                template_types=[{'template_type':'pdt'},{'template_type':'filing plan'},{'template_type':'sales'}]
            
                for index in range(len(serializer.data)):
                    template_data_list=[]
                    if serializer.data[index].get('partner',None) != None:
                        partner_id = serializer.data[index]['partner']['partner_id']
                        partner_not_deleted = Partner.objects.filter(partner_id=partner_id,is_active=True)
                        if not partner_not_deleted.exists():
                            serializer.data[index].pop('partner')
                            serializer.data[index].pop('email')
                        else:
                            for template_type in template_types:
                                template_data = TemplateMessage.objects.filter(partner_id=partner_id,template_type=template_type['template_type'],is_partner_message=True).values('template_type','is_read','is_approved','quarter_id','quarter_name','created_at','updated_at').last()
                    
                                q_1 = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]
                                approval_time = None
                                submission_time = None

                                last_msg = TemplateMessage.objects.filter(
                                    partner_id=partner_id,
                                    quarter_id=q_1,
                                    template_type=template_type['template_type']).last()
        
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

                                if template_data:
                                    template_data['report_status']=report_status
                                    template_data['approval_time']=approval_time
                                    template_data['submission_time']=submission_time
                                    template_data_list.append(template_data)
                                    serializer.data[index]['partner']['template_data'] = template_data_list
                                else:
                                    serializer.data[index].pop('partner')
                                    serializer.data[index].pop('email')
                                    break
                
                reponse=list(filter(None, serializer.data))

        if request.query_params['type'] == 'not_submitted':    
            partners = User.objects.filter(role='PARTNER').order_by('partner__company_name')
            if not partners:
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                serializer = UserNestedSerializer(data=partners,many=True)
                serializer.is_valid()
            
                template_data_list=[]
                template_types=[{'template_type':'pdt'},{'template_type':'filing plan'},{'template_type':'sales'}]
            
                for index in range(len(serializer.data)):
                    template_data_list=[]
                    if serializer.data[index].get('partner',None) != None:
                        partner_id = serializer.data[index]['partner']['partner_id']
                        partner_not_deleted = Partner.objects.filter(partner_id=partner_id,is_active=True)
                        if not partner_not_deleted.exists():
                            serializer.data[index].pop('partner')
                            serializer.data[index].pop('email')
                        else:
                            null_count=0
                            for template_type in template_types:
                                template_data = TemplateMessage.objects.filter(partner_id=partner_id,template_type=template_type['template_type'],is_partner_message=True).values('template_type','is_read','is_approved','quarter_id','quarter_name','created_at','updated_at').last()
                    
                                q_1 = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]
                                approval_time = None
                                submission_time = None

                                last_msg = TemplateMessage.objects.filter(
                                    partner_id=partner_id,
                                    quarter_id=q_1,
                                    template_type=template_type['template_type']).last()
        
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
                            
                                if template_data != None:
                            
                                    template_data['report_status']=report_status
                                    template_data['approval_time']=approval_time
                                    template_data['submission_time']=submission_time
                                    template_data_list.append(template_data)

                                else:
                                    null_count+=1
                                    template_data={}
                                    template_data['template_type']=template_type['template_type']
                                    template_data['report_status']=report_status
                                    template_data_list.append(template_data)
                            serializer.data[index]['partner']['template_data'] = template_data_list
                        
                            if null_count == 0:
                                serializer.data[index].pop('partner')
                                serializer.data[index].pop('email')
                
                reponse=list(filter(None, serializer.data))    

        if request.query_params['type'] == 'submitted_not_approved':
            partners = User.objects.filter(role='PARTNER').order_by('partner__company_name')
            if not partners:
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                serializer = UserNestedSerializer(data=partners,many=True)
                serializer.is_valid()
            
                template_data_list=[]
                template_types=[{'template_type':'pdt'},{'template_type':'filing plan'},{'template_type':'sales'}]
            
                for index in range(len(serializer.data)):
                    template_data_list=[]
                    approval_count = 0
                    not_submitted_count = 0 
                    if serializer.data[index].get('partner',None) != None:
                        partner_id = serializer.data[index]['partner']['partner_id']
                        partner_not_deleted = Partner.objects.filter(partner_id=partner_id,is_active=True)
                        if not partner_not_deleted.exists():
                            serializer.data[index].pop('partner')
                            serializer.data[index].pop('email')
                        else:
                            for template_type in template_types:
                                template_data = TemplateMessage.objects.filter(partner_id=partner_id,template_type=template_type['template_type'],is_partner_message=True).values('template_type','is_read','is_approved','quarter_id','quarter_name','created_at','updated_at').last()
                        
                                q_1 = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]
                                approval_time = None
                                submission_time = None

                                last_msg = TemplateMessage.objects.filter(
                                    partner_id=partner_id,
                                    quarter_id=q_1,
                                    template_type=template_type['template_type']).last()
            
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
                            
                                if template_data:
                                    template_data['report_status']=report_status
                                    template_data['approval_time']=approval_time
                                    template_data['submission_time']=submission_time
                            
                                if report_status == 'Approved':
                                    approval_count+=1
                                # if report_status == 'Not Submitted':
                                #     pending_count+=1
                                template_data_list.append(template_data)
                            for template_data in template_data_list:
                                if template_data == None:
                                    not_submitted_count +=1
                            serializer.data[index]['partner']['template_data'] = template_data_list

                            total_count = approval_count + not_submitted_count
                            if approval_count == 3 or not_submitted_count == 3 or total_count == 3:
                                serializer.data[index].pop('partner')
                                serializer.data[index].pop('email')
                
                reponse=list(filter(None, serializer.data))    
        if request.query_params['type'] == 'saved_but_not_submitted':
            partners = User.objects.filter(role='PARTNER').order_by('partner__company_name')
            if not partners:
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                serializer = UserNestedSerializer(data=partners,many=True)
                serializer.is_valid()
            
                template_data_list=[]
                template_types=[{'template_type':'pdt'},{'template_type':'filing plan'},{'template_type':'sales'}]
            
                for index in range(len(serializer.data)):
                    template_data_list=[] 
                    if serializer.data[index].get('partner',None) != None:
                        partner_id = serializer.data[index]['partner']['partner_id']
                        partner_not_deleted = Partner.objects.filter(partner_id=partner_id,is_active=True)
                        if not partner_not_deleted.exists():
                            serializer.data[index].pop('partner')
                            serializer.data[index].pop('email')
                        else:
                            pdt_saved_and_submitted=False
                            fp_saved_and_submitted=False
                            sales_saved_and_submitted=False
                            for template_type in template_types:
                                template_data = TemplateMessage.objects.filter(partner_id=partner_id,template_type=template_type['template_type'],is_partner_message=True).values('template_type','is_read','is_approved','quarter_id','quarter_name','created_at','updated_at').last()

                                q_1 = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]
                                approval_time = None
                                submission_time = None
                        
                                if template_type['template_type'] == 'pdt':
                                    pdt = ProductQuarterDate.objects.filter(product_quarter_id__active_product_id__partner_id=partner_id).values('start_date','end_date')
                                    if partner_id == 76:
                                        print(pdt)
        
                                    if pdt.exists() and template_data != None:
                                        pdt_saved_and_submitted = True
                                    elif not pdt.exists():
                                        pdt_saved_and_submitted = True
                                if template_type['template_type'] == 'filing plan':
                                    fp=FilingPlan.objects.filter(active_product_id__partner_id=partner_id)
                                    if fp.exists() and template_data != None:
                                        fp_saved_and_submitted = True
                                    elif not fp.exists():
                                        fp_saved_and_submitted = True
                                if template_type['template_type'] == 'sales':
                                    sales=SalesReport.objects.filter(partner_id=partner_id)
                                    if sales.exists() and template_data != None:
                                        sales_saved_and_submitted = True
                                    elif not sales.exists():
                                        sales_saved_and_submitted = True
                                if pdt_saved_and_submitted and fp_saved_and_submitted and sales_saved_and_submitted:
                                    serializer.data[index].pop('partner')
                                    serializer.data[index].pop('email')

                
                reponse=list(filter(None, serializer.data))    

        return Response(reponse,status=status.HTTP_200_OK)