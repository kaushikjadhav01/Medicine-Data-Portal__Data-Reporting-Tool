from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework.views import APIView
from api.helpers.custom_permissions import IsAdmin
from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags
from api.models import (
    SalesReport,Partner,Product,
    Country,CountrySerializer,
    FilingPlan,FilingPlanSerializer,
    ActiveProduct,ActiveProductSerializer,
    Quarter,QuarterSerializer, 
    TemplateMessage, TemplateMessageSerializer,
    User, ProductVerification, ProductQuarter, Stage, ProductQuarterDate
)
import json
import os
from MPP_API.settings import FROM_EMAIL_ID
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.db.models import F
from decimal import Decimal

class SalesReportAdminView(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'quarter', openapi.IN_QUERY, 
            type=openapi.TYPE_STRING, 
            required=False,
        )],
    )

    def get(self,request,pk,sales_report_type):

        quarter_name_query = None
        if request.query_params.get('quarter') != None:
            quarter_name_query = request.query_params.get('quarter')

        quarter_dropdown = list(Quarter.objects.filter().order_by('-quarter_year', '-quarter_index').values_list('quarter_name',flat=True))
        quarter_dropdown.pop(0)

        sales_report_type = sales_report_type.upper()
        
        partner_id = pk

        if quarter_name_query == None:
            q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
        else:
            q_1_quarter = Quarter.objects.filter(quarter_name=quarter_name_query).first()
        
        rows = SalesReport.objects.filter(partner_id=pk,sales_report_type=sales_report_type,quarter_id=q_1_quarter).annotate(country_name=F('country_id__country_name')).order_by('sales_report_id').values(
        'sales_report_id',
        'year',
        'month',
        'country_id',
        'country_name',
        'product_id',
        'purchaser',
        'strength',
        'formulation_md',
        'pack_size',
        'quantity',
        'currency',
        'gross_sale_price_currency',
        'usd_exchange_rate',
        'gross_sale_price_usd',
        'total_gross_value',
        'deductable_expenses',
        'total_value',
        'royalty_percent',
        'royalty_due',
        'procurement_end_country',
        'comments',
        'product_name'
        )
        
        
        country_ids=[]
        product_order=[]
        
        products = Product.objects.filter(is_active=True,category=sales_report_type).values('product_id','product_name').order_by('product_name')

        products = [entry for entry in products]
        
        for product in products:
            product_id=product['product_id']
            product_name = product['product_name']
            product_obj={}
            product_obj['product_id']=product_id
            product_obj['product_name']=product_name
            product_order.append(product_obj)
                
        countries = Country.objects.values('country_id','country_name').order_by('country_name')
        country_order = [entry for entry in countries]
        
        approval_time = None
        submission_time = None

        last_msg = TemplateMessage.objects.filter(
            partner_id=partner_id,
            quarter_id=q_1_quarter,
            template_type="sales").last()
        
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

        sales_meta = {
            "partner_name":Partner.objects.get(pk=partner_id).company_name,
            "quarter_name":q_1_quarter.quarter_name,
            "report_status":report_status,
            "approval_time":approval_time,
            "submission_time":submission_time
        }

        unread_message_count = TemplateMessage.objects.filter(partner_id=partner_id,template_type='sales',is_read=False,is_partner_message=True).count()
        
        # Get messages to send to partner. Convert Queryset to List
        messages = TemplateMessage.objects.filter(partner_id=partner_id,template_type='sales').exclude(quarter_name='Historical Quarter').values().order_by('-template_message_id')
        messages =[message for message in messages]

        pending_product_count=ProductVerification.objects.filter(is_approved=None,partner_id=pk).count()

        if not rows.exists():
            rows=[]
            return Response(data={"sales_meta":sales_meta,"quarter_dropdown":quarter_dropdown,"no_content":"No content found. Please add Sales data via POST request.","rows":rows,"product_order":product_order,"country_order":country_order,'messages':messages,'unread_message_count':unread_message_count,'pending_product_count':pending_product_count},status=status.HTTP_200_OK)
        
        rows = [entry if quarter_name_query == None else dict(entry, **{'editable':False}) for entry in rows]

        return Response(data={"sales_meta":sales_meta,"rows":rows,"quarter_dropdown":quarter_dropdown,"product_order":product_order,"country_order":country_order,'messages':messages,'unread_message_count':unread_message_count,'pending_product_count':pending_product_count},status=status.HTTP_200_OK)

    def post(self,request,pk,sales_report_type):

        quarter_name_query = None
        if request.query_params.get('quarter') != None:
            quarter_name_query = request.query_params.get('quarter')

        sales_report_type = sales_report_type.upper()

        partner_id = pk
        if quarter_name_query == None:
            q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
        else:
            q_1_quarter = Quarter.objects.filter(quarter_name=quarter_name_query).first()
        
        data = request.data

        countries=Country.objects.all()
        if not countries.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        # Remove product verification entries if they are already corrected by user and not in current request
        product_verification = ProductVerification.objects.filter(partner_id_id=pk,quarter_id=q_1_quarter,sales_report_type=sales_report_type)
        for product_verification_obj in product_verification:
            if not any(d.get('product_name',None) == product_verification_obj.product_name for d in data):
                product_verification_obj.delete()

        existing_rows = SalesReport.objects.filter(partner_id=pk,sales_report_type=sales_report_type,quarter_id=q_1_quarter).annotate(country_name=F('country_id__country_name')).order_by('sales_report_id').values(
        'sales_report_id',
        'year',
        'month',
        'country_id',
        'country_name',
        'purchaser',
        'strength',
        'formulation_md',
        'pack_size',
        'quantity',
        'currency',
        'gross_sale_price_currency',
        'usd_exchange_rate',
        'gross_sale_price_usd',
        'total_gross_value',
        'deductable_expenses',
        'total_value',
        'royalty_percent',
        'royalty_due',
        'procurement_end_country',
        'comments',
        'product_name'
        )
        modified_rows = []

        # twenty_decimal_places = Decimal(10) ** -20
        if sales_report_type == 'FDF':
            numeric_fields = ['pack_size','quantity','gross_sale_price_currency','usd_exchange_rate','gross_sale_price_usd','total_gross_value','deductable_expenses','total_value','royalty_percent','royalty_due']
        elif sales_report_type == 'API':
            numeric_fields = ['quantity','total_value']
        
        # Format POST request so that it can be matched with QuerySet
        for row in data:
            # Check if row is deleted, that is, if row contains only one element => sales_report_id
            if len(row) == 1 and 'sales_report_id' in row.keys():
                modified_rows.append(row)
            else:
                if 'product_id' in row.keys():
                    row.pop('product_id')
                for field in numeric_fields:
                    if field in row.keys() and row[field] != None:
                        row[field]=Decimal(str(round(row[field], 20)))
        
        # Match POST request with Queryset and check if any modifications
        for row in data:
            if row not in existing_rows:
                modified_rows.append(row)
        
        for row in modified_rows:
            sales_report_type = sales_report_type
            # row_fields = ['sales_report_id','year','month','country_id','country_name','purchaser','strength','formulation_md','pack_size','quantity','currency','gross_sale_price_currency','usd_exchange_rate','gross_sale_price_usd','total_gross_value','deductable_expenses','total_value','royalty_percent','royalty_due','procurement_end_country','comments','product_name']

            # for field in row_fields:
            #     if field in row.keys() and row[field] != '':
            #         globals()[field]=row[field]
            #     else:
            #         globals()[field]=None
            sales_report_id=row.get('sales_report_id',None)
            month = row.get('month',None)
            year = row.get('year',None)
            country_id = row.get('country_id',None)
            country_name = row.get('country_name',None)
            product_name = row.get('product_name',None)
            purchaser = row.get('purchaser',None)
            strength = row.get('strength',None)
            formulation_md = row.get('formulation_md',None)
            pack_size = row.get('pack_size',None)
            quantity = row.get('quantity',None)
            currency = row.get('currency',None)
            gross_sale_price_currency = row.get('gross_sale_price_currency',None)
            usd_exchange_rate = row.get('usd_exchange_rate',None)
            gross_sale_price_usd = row.get('gross_sale_price_usd',None)
            total_gross_value = row.get('total_gross_value',None)
            deductable_expenses = row.get('deductable_expenses',None)
            total_value= row.get('total_value',None)
            royalty_percent= row.get('royalty_percent',None)
            royalty_due= row.get('royalty_due',None)
            procurement_end_country= row.get('procurement_end_country',None)
            comments= row.get('comments',None)
            if year == '':
                year=None
            if month == '':
                month=None
            if country_name == None:
                country_id=None
            if pack_size == '':
                pack_size=None
            if quantity == '':
                quantity=None
            if currency == '':
                currency=None
            if gross_sale_price_currency == '':
                gross_sale_price_currency=None
            if usd_exchange_rate == '':
                usd_exchange_rate=None
            if gross_sale_price_usd == '':
                gross_sale_price_usd=None
            if total_gross_value == '':
                total_gross_value=None
            if deductable_expenses == '':
                deductable_expenses=None
            if total_value == '':
                total_value=None
            if royalty_percent == '':
                royalty_percent=None
            if royalty_due == '':
                royalty_due=None
            
            try:
                row_empty = False
                if sales_report_type == 'API' and month == None and year == None and country_id == None and product_name == None and purchaser == None and quantity == None and total_value == None:
                    row_empty=True
                elif sales_report_type == 'FDF' and month == None and year == None and country_id == None and product_name == None and purchaser == None and quantity == None and total_value == None and strength == None and formulation_md == None and  pack_size ==None and currency ==None and gross_sale_price_currency == None and usd_exchange_rate ==None and gross_sale_price_usd == None and total_gross_value == None and deductable_expenses == None and royalty_due == None and royalty_percent == None and procurement_end_country == None and comments == None:
                    row_empty=True

                if not row_empty:
                    obj = SalesReport.objects.get(sales_report_id=sales_report_id)
                    obj.year=year
                    obj.month=month
                    country_id=Country.objects.filter(country_id=country_id)
                    if country_id.exists():
                        country_id=country_id[0]
                    else:
                        country_id=None
                    obj.country_id=country_id
                    product_id=Product.objects.filter(product_name=product_name)
                    active_product_id=ActiveProduct.objects.filter(product_id__product_name=product_name,partner_id_id=pk)
                    if not active_product_id.exists():
                        product_id = None
                        # q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
                        product_verification = ProductVerification.objects.filter(partner_id_id=pk,product_name=product_name,quarter_id=q_1_quarter)
                        if product_verification.exists() and product_verification[0].is_approved == False:
                            for product_verification_obj in product_verification:
                                product_verification_obj.is_approved = None
                                product_verification_obj.save()
                        if not product_verification.exists() and product_name:
                            product_verification_obj = ProductVerification.objects.create(partner_id_id=pk,product_name=product_name,quarter_id=q_1_quarter,created_by=request.user.id,updated_by=request.user.id,sales_report_type=sales_report_type)
                            product_verification_obj.save()
                    else:
                        product_id=product_id[0]
                    obj.product_id=product_id
                    obj.product_name=product_name
                    obj.purchaser=purchaser
                    obj.strength=strength
                    obj.formulation_md=formulation_md
                    obj.pack_size=pack_size
                    obj.quantity=quantity
                    obj.currency=currency
                    obj.gross_sale_price_currency=gross_sale_price_currency
                    obj.usd_exchange_rate=usd_exchange_rate
                    obj.gross_sale_price_usd=gross_sale_price_usd
                    obj.total_gross_value=total_gross_value
                    obj.deductable_expenses=deductable_expenses
                    obj.total_value=total_value
                    obj.royalty_percent=royalty_percent
                    obj.royalty_due=royalty_due
                    obj.procurement_end_country=procurement_end_country
                    obj.comments=comments
                    obj.updated_by = request.user.id
                    obj.save()
                else:
                    product_name=SalesReport.objects.filter(sales_report_id=sales_report_id)
                    if product_name.exists():
                        product_name = product_name.values('product_name')[0]['product_name']
                        ProductVerification.objects.filter(product_name=product_name,partner_id=partner_id,is_approved=None,sales_report_type=sales_report_type).delete()
                    SalesReport.objects.filter(sales_report_id=sales_report_id).delete()

            except SalesReport.DoesNotExist:
                row_empty = False
                if sales_report_type == 'API' and month == None and year == None and country_id == None and product_name == None and purchaser == None and quantity == None and total_value == None:
                    row_empty=True
                elif sales_report_type == 'FDF' and month == None and year == None and country_id == None and product_name == None and purchaser == None and quantity == None and total_value == None and strength == None and formulation_md == None and  pack_size ==None and currency ==None and gross_sale_price_currency == None and usd_exchange_rate ==None and gross_sale_price_usd == None and total_gross_value == None and deductable_expenses == None and royalty_due == None and royalty_percent == None and procurement_end_country == None and comments == None:
                    row_empty=True
                
                if row_empty:
                    product_name=SalesReport.objects.filter(sales_report_id=sales_report_id)
                    if product_name.exists():
                        product_name=product_name.values('product_name')[0]['product_name']
                        ProductVerification.objects.filter(product_name=product_name,partner_id=partner_id,is_approved=None,sales_report_type=sales_report_type).delete()
                    SalesReport.objects.filter(sales_report_id=sales_report_id).delete()
                    
                else:
                    partner_id = Partner.objects.filter(partner_id=partner_id)[0]
                    country_id = Country.objects.filter(country_id=country_id)
                    if country_id.exists():
                        country_id=country_id[0]
                    else:
                        country_id=None
                    product_id = Product.objects.filter(product_name=product_name)
                    active_product_id=ActiveProduct.objects.filter(product_id__product_name=product_name,partner_id_id=pk)
                    if not active_product_id.exists():
                        product_id=None
                        # q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
                        product_verification = ProductVerification.objects.filter(partner_id_id=pk,product_name=product_name,quarter_id=q_1_quarter)
                        if product_verification.exists() and product_verification[0].is_approved == False:
                            for product_verification_obj in product_verification:
                                product_verification_obj.is_approved = None
                                product_verification_obj.save()
                        if not product_verification.exists() and product_name:
                            product_verification_obj = ProductVerification.objects.create(partner_id_id=pk,product_name=product_name,quarter_id=q_1_quarter,created_by=request.user.id,updated_by=request.user.id,sales_report_type=sales_report_type)
                            product_verification_obj.save()
                    else:
                        product_id=product_id[0]
                    SalesReport.objects.create(
                partner_id=partner_id,
                quarter_id=q_1_quarter,
                sales_report_type=sales_report_type,
                month = month,
                year = year,
                country_id = country_id,
                product_id = product_id,
                product_name=product_name,
                purchaser = purchaser,
                strength = strength,
                formulation_md = formulation_md,
                pack_size = pack_size,
                quantity = quantity,
                currency = currency,
                gross_sale_price_currency = gross_sale_price_currency,
                usd_exchange_rate = usd_exchange_rate,
                gross_sale_price_usd = gross_sale_price_usd,
                total_gross_value = total_gross_value,
                deductable_expenses = deductable_expenses,
                total_value= total_value,
                royalty_percent= royalty_percent,
                royalty_due= royalty_due,
                procurement_end_country= procurement_end_country,
                comments= comments,
                created_by=request.user.id,
                updated_by=request.user.id
                )
                
        
        return Response(data={'Sales Report Saved Successfully!!!'},status=status.HTTP_200_OK)


class SalesReportDecisionViewset(viewsets.ModelViewSet):
    
    permission_classes = [IsAdmin]
    serializer_class = TemplateMessageSerializer
    queryset = TemplateMessage.objects.filter(template_type='sales')
        
    def create(self, serializer):
        partner_id=self.request.data['partner_id']
        q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
        
        sales_report = SalesReport.objects.filter(partner_id=partner_id, quarter_id=q_1_quarter).values()
        disable_decision_api=False
        disable_decision_fdf=False
        is_approved=self.request.data['is_approved']
        for row in sales_report:
            if row:
                if row['sales_report_type'] == 'API' and is_approved == True:
                    try:
                        if row['country_id_id'] == None:
                            disable_decision_api=True
                    except:
                        disable_decision_api=True
                    if row['year'] == None or row['month'] == None or row['product_name'] == None or row['total_value']==None or row['quantity'] == None or row['purchaser'] == None:
                        disable_decision_api=True
                    
                elif row['sales_report_type'] == 'FDF' and is_approved == True:
                    try:
                        if row['country_id_id'] == None:
                            disable_decision_fdf=True
                    except:
                        disable_decision_fdf=True
                    if row['year'] == None or row['month'] == None or row['product_name'] == None or row['total_value']==None or row['quantity'] == None or row['purchaser'] == None or row['strength'] == None or row['formulation_md'] == None or row ['pack_size'] == None or row['gross_sale_price_usd'] == None:
                        disable_decision_fdf=True
             
        if disable_decision_api and disable_decision_fdf:
            return Response(data={'Missing fields. Please fill all the fields of API and FDF sections before submitting'}, status=status.HTTP_400_BAD_REQUEST) 
        elif disable_decision_api:
            return Response(data={'Missing fields. Please fill all the fields of API section before submitting'}, status=status.HTTP_400_BAD_REQUEST)
        elif disable_decision_fdf:
            return Response(data={'Missing fields. Please fill all the fields of FDF section before submitting'}, status=status.HTTP_400_BAD_REQUEST)
        else:    
            is_approved=self.request.data['is_approved']
            message=self.request.data['message']
            pending_products = ProductVerification.objects.filter(partner_id=partner_id,is_approved=None)
            if is_approved != None and pending_products:
                return Response(data={'Please verify all pending products before approving or rejecting report'},status=status.HTTP_400_BAD_REQUEST)
        
        
            if is_approved == True:
                response='Report Approved'
                report_status = 'Approved'
            elif is_approved == False:
                response='Report Rejected'
                report_status='Rejected'
            template_type = 'Sales'
            api_link=os.getenv('API_LINK')
            link = str(api_link+'partner/sales-report')
        
            partner_name = Partner.objects.filter(partner_id=partner_id).values_list('company_name',flat=True)[0] 
            to_email_id = User.objects.filter(id=partner_id).values_list('email',flat=True)[0]
            from_email_id = FROM_EMAIL_ID
            email_subject = str(template_type + ' Report has been ' + report_status)
        
            html_message = render_to_string('admin_approval.html', {'partner_name': partner_name.capitalize(),'message':message,'status':report_status,'template_type':template_type,'link':link,'api_link':api_link})
            plain_message = strip_tags(html_message)
    
            # send_mail(email_subject, plain_message, from_email_id, [to_email_id], html_message=html_message)
        
            quarter_name = q_1_quarter.__dict__['quarter_name']
            template_message = TemplateMessage.objects.create(partner_id_id=partner_id,is_approved=is_approved,message=message,is_read=False,is_partner_message=False,
            updated_by=partner_id,created_by=partner_id,quarter_id=q_1_quarter,quarter_name=quarter_name,template_type='sales')
            template_message.save()
        
            # Update admin partner list template data when approved
            template_data = TemplateMessage.objects.filter(partner_id=partner_id,template_type='sales',is_partner_message=True).last()
            template_data.is_approved=self.request.data['is_approved']
            template_data.save()
        return Response(data={response}, status=status.HTTP_200_OK)
class SalesReportInboxAdmin(APIView):

    permission_classes = [IsAdmin]

    def post(self,request):
        unread_messages = TemplateMessage.objects.filter(template_type='sales',is_partner_message=True,is_read=False)
        unread_messages.update(is_read=True)
        return Response(data={'Read all unread messages'},status=status.HTTP_200_OK)

import json, os
stages_json = open("static/stages.json").read()
stages_json = json.loads(stages_json)

class ProductVerificationAdminView(APIView):

    permission_classes = [IsAdmin]

    def get(self,request,pk):
        pending_products = ProductVerification.objects.filter(partner_id=pk,is_approved=None).values()
        does_product_exist=False
        for product in pending_products:
            product_already_exists = Product.objects.filter(product_name=product['product_name'])
            if product_already_exists.exists():
                does_product_exist=True
                category=product_already_exists[0].category
                therapy_area=product_already_exists[0].therapy_area
                product['category']=category
                product['therapy_area']=therapy_area
            else:
                does_product_exist=False
            product['does_product_exist']=does_product_exist
            
        existing_products = Product.objects.filter(is_active=True).values().order_by('product_name')
        return Response(data={'pending_products':pending_products,'existing_products':existing_products},status=status.HTTP_200_OK)
    
    def post(self,request,pk):
        partner_id=pk
        data=request.data
        message = 'Products Verified'
        duplicate_checker={}
        for row in data:
            if row['is_approved'] == True:
                if row['product_name'] in duplicate_checker.keys() and duplicate_checker[row['product_name']] != [row['product_status'],row['category'],row['therapy_area']]:
                    return Response(data={'Cannot Assign different values for same product'},status=status.HTTP_400_BAD_REQUEST)
                duplicate_checker[row['product_name']]=[row['product_status'],row['category'],row['therapy_area']]
        for row in data:    
            product_already_exists = Product.objects.filter(product_name=row['product_name'])
            if product_already_exists:
                # Product Rename
                old_product_name = ProductVerification.objects.filter(product_verification_id=row['product_verification_id'])[0].product_name
                sales_reports = SalesReport.objects.filter(partner_id=partner_id,product_name=old_product_name)
                for sales_report in sales_reports:
                    if row['is_approved'] == True:
                        sales_report.product_id = product_already_exists[0]
                        sales_report.product_name = product_already_exists[0].product_name
                        sales_report.save()
                    else:
                        sales_report.delete()
                active_product = ActiveProduct.objects.filter(product_id=product_already_exists[0],partner_id=partner_id)
                if not active_product.exists() and row['is_approved'] == True:
                    active_product_obj = ActiveProduct.objects.create(
                        partner_id_id=partner_id,
                        product_id=product_already_exists[0],
                        status=row['product_status'],
                        is_active=True,
                        created_by=request.user.id,
                        updated_by=request.user.id
                        )
                    if row['product_status'] == 'APPROVED' or row['product_status'] == 'FILED' or row['product_status'] == 'DROPPED':
                        active_product_obj.has_last_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1].quarter_id
                    active_product_obj.save()
                    
                    quarter_objects = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')
                    product_quarter_obj = ProductQuarter.objects.create(active_product_id=active_product_obj,quarter_id=quarter_objects[0], created_by=request.user.id,updated_by=request.user.id)
                    product_quarter_obj.save()
                    product_quarter_obj = ProductQuarter.objects.create(active_product_id=active_product_obj,quarter_id=quarter_objects[1], created_by=request.user.id,updated_by=request.user.id)
                    product_quarter_obj.save()
                    stages = Stage.objects.filter(product_id=product_already_exists[0])
                    
                    for stage in stages:
                        ProductQuarterDate.objects.create(stage_id=stage,
                                product_quarter_id=product_quarter_obj,
                                start_date=None,
                                end_date=None,
                                created_by=request.user.id,
                                updated_by=request.user.id
                            )
                product_verification = ProductVerification.objects.filter(product_verification_id=row['product_verification_id'])
                for product_verification_obj in  product_verification:
                    product_verification_obj.is_approved = row['is_approved']
                    product_verification_obj.product_name=row['product_name']
                    product_verification_obj.save()
            if not product_already_exists.exists():
                if row['is_approved'] == True:
                    product_obj = Product.objects.create(
                        product_name=row['product_name'],
                        category=row['category'],
                        therapy_area=row['therapy_area'],
                        is_active=True,
                        created_by=partner_id,
                        updated_by=request.user.id
                    )
                    product_obj.save()
                
                    stages = Stage.objects.bulk_create([Stage(product_id=product_obj,description=description,created_by=request.user.id,updated_by=request.user.id) for description in stages_json[row['category']]])
                    partners_of_pending_product = ProductVerification.objects.filter(product_verification_id=row['product_verification_id'])
                    old_product_name = partners_of_pending_product[0].product_name
                
                    for partner in partners_of_pending_product:
                        partner.product_name = row['product_name']
                        partner.is_approved = True
                        partner.save()
                        product_id = Product.objects.filter(product_name=partner.product_name)[0]
                        active_product_obj = ActiveProduct.objects.create(
                            partner_id=partner.partner_id,
                            product_id=product_id,
                            status=row['product_status'],
                            is_active=True,
                            created_by=request.user.id,
                            updated_by=request.user.id
                            )
                        if row['product_status'] == 'APPROVED' or row['product_status'] == 'FILED' or row['product_status'] == 'DROPPED':
                            active_product_obj.has_last_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1].quarter_id
                        active_product_obj.save()
                        quarter_objects = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')
                        product_quarter_obj = ProductQuarter.objects.create(active_product_id=active_product_obj,quarter_id=quarter_objects[0], created_by=request.user.id,updated_by=request.user.id)
                        product_quarter_obj.save()
                        product_quarter_obj = ProductQuarter.objects.create(active_product_id=active_product_obj,quarter_id=quarter_objects[1], created_by=request.user.id,updated_by=request.user.id)
                        product_quarter_obj.save()
                        for stage in stages:
                            ProductQuarterDate.objects.create(stage_id=stage,
                                product_quarter_id=product_quarter_obj,
                                start_date=None,
                                end_date=None,
                                created_by=request.user.id,
                                updated_by=request.user.id
                            )
                        sales_reports = SalesReport.objects.filter(partner_id=partner.partner_id,product_name=old_product_name)
                        for sales_report in sales_reports:
                            sales_report.product_id = product_id
                            sales_report.product_name = row['product_name']
                            sales_report.save()
                    message='Product Approved'

                elif row['is_approved'] == False:
                    partners = ProductVerification.objects.filter(product_name=row['product_name'])
                    for partner in partners:
                        partner.is_approved=False
                        partner.save()
                        sales_reports = SalesReport.objects.filter(partner_id=partner.partner_id,product_name=row['product_name'])
                        for sales_report in sales_reports:
                            sales_report.delete()
                    message='Product Rejected'
                product_verification_obj = ProductVerification.objects.filter(product_verification_id=row['product_verification_id'])
                product_verification_obj[0].product_name=row['product_name']
                product_verification_obj[0].save()
                
        return Response(data={message},status=status.HTTP_200_OK)

request_body_product_detail = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'product_name':openapi.Schema(type=openapi.TYPE_STRING),
        'partner_id':openapi.Schema(type=openapi.TYPE_INTEGER)
    }
)

class ProductDetailView(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(request_body=request_body_product_detail)
    def post(self,request):
        product_name=request.data['product_name']
        partner_id=request.data['partner_id']
        existing_product = Product.objects.filter(product_name=product_name,is_active=True).values()
        if existing_product:
            existing_product = existing_product.values()
            existing_product = [entry for entry in existing_product]
        else:
            return Response(data={'Product not found, does not exist in database'},status=status.HTTP_400_BAD_REQUEST)
        active_product_obj = ActiveProduct.objects.filter(partner_id=partner_id,product_id=existing_product[0]['product_id'])
        if active_product_obj:
            existing_product[0]['product_status'] = active_product_obj[0].status
        return Response(data=existing_product[0],status=status.HTTP_200_OK)