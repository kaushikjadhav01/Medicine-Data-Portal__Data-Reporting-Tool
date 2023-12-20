from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.helpers.custom_permissions import IsPartner
from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags
from api.models import (
    SalesReport,Partner,Product,
    Country,CountrySerializer,
    ActiveProduct,ActiveProductSerializer,
    Quarter,QuarterSerializer,
    TemplateMessage, User, TemplateSubmissionSerializer,
    ProductVerification
)
import json, os, datetime
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from MPP_API.settings import FROM_EMAIL_ID
from django.db.models import F
from decimal import Decimal

class SalesReportView(APIView):

    permission_classes = [IsAuthenticated,IsPartner]

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'quarter', openapi.IN_QUERY, 
            type=openapi.TYPE_STRING, 
            required=False,
        )],
    )

    def get(self,request,sales_report_type):

        quarter_name_query = None
        if request.query_params.get('quarter') != None:
            quarter_name_query = request.query_params.get('quarter')

        quarter_dropdown = list(Quarter.objects.filter().order_by('-quarter_year', '-quarter_index').values_list('quarter_name',flat=True))
        quarter_dropdown.pop(0)

        sales_report_type = sales_report_type.upper()
        
        partner_id = request.user.id
        sales_report_quarters = list(SalesReport.objects.filter(partner_id=partner_id).values_list('quarter_id__quarter_name',flat=True).distinct())
        current_quarter = quarter_dropdown[0]
        for quarter in quarter_dropdown[:]:
            if quarter not in sales_report_quarters and quarter != current_quarter:
                quarter_dropdown.remove(quarter)

        if quarter_name_query == None:
            q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
        else:
            q_1_quarter = Quarter.objects.filter(quarter_name=quarter_name_query).first()

        rows = SalesReport.objects.filter(partner_id=request.user.id,sales_report_type=sales_report_type,quarter_id=q_1_quarter).annotate(country_name=F('country_id__country_name')).order_by('sales_report_id').values(
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
        
        
        q_1 = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
        
        approval_time = None
        submission_time = None

        last_msg = TemplateMessage.objects.filter(
            partner_id=partner_id,
            quarter_id=q_1,
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
            "quarter_name":q_1.quarter_name,
            "report_status":report_status,
            "approval_time":approval_time,
            "submission_time":submission_time
        }

        if not rows.exists():
            rows=[]
            return Response(data={"sales_meta":sales_meta,"quarter_dropdown":quarter_dropdown,"no_content":"No content found. Please add Sales data via POST request.","rows":rows,"product_order":product_order,"country_order":country_order},status=status.HTTP_200_OK)
        
        # rows = [entry if quarter_name_query == None else dict(entry, **{'editable':False}) for entry in rows]
        
        # Check if new messages from admin
        unread_message_count = TemplateMessage.objects.filter(partner_id=partner_id,template_type='sales',is_read=False,is_partner_message=False).count()
        
        # Get messages to send to partner. Convert Queryset to List
        messages = TemplateMessage.objects.filter(partner_id=partner_id,template_type='sales',quarter_id__isnull=False).exclude(quarter_name='Historical Quarter').values().order_by('-template_message_id')
        messages =[message for message in messages]

        return Response(data={"sales_meta":sales_meta,"rows":rows,"quarter_dropdown":quarter_dropdown,"product_order":product_order,"country_order":country_order,'messages':messages,'unread_message_count':unread_message_count},status=status.HTTP_200_OK)

    def post(self,request,sales_report_type):

        sales_report_type = sales_report_type.upper()

        # global sales_report_id,year,month,country_id,country_name,purchaser,strength,formulation_md,pack_size,quantity,currency,gross_sale_price_currency,usd_exchange_rate,gross_sale_price_usd,total_gross_value,deductable_expenses,total_value,royalty_percent,royalty_due,procurement_end_country,comments,product_name

        partner_id = request.user.id
        q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]        
        
        data = request.data

        countries=Country.objects.all()
        if not countries.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)

        product_verification = ProductVerification.objects.filter(partner_id_id=request.user.id,quarter_id=q_1_quarter,sales_report_type=sales_report_type)
        for product_verification_obj in product_verification:
            if not any(d.get('product_name',None) == product_verification_obj.product_name for d in data):
                product_verification_obj.delete()

        existing_rows = SalesReport.objects.filter(partner_id=partner_id,sales_report_type=sales_report_type,quarter_id=q_1_quarter).annotate(country_name=F('country_id__country_name')).order_by('sales_report_id').values(
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
                    product_id=Product.objects.filter(product_name=product_name)
                    active_product_id=ActiveProduct.objects.filter(product_id__product_name=product_name,partner_id_id=partner_id)
                    if not active_product_id.exists():
                        product_id = None
                        q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
                        product_verification = ProductVerification.objects.filter(partner_id_id=partner_id,product_name=product_name,quarter_id=q_1_quarter)
                        if not product_verification.exists() and product_name:
                            product_verification_obj = ProductVerification.objects.create(product_name=product_name,quarter_id=q_1_quarter,created_by=request.user.id,updated_by=request.user.id,partner_id_id=request.user.id,sales_report_type=sales_report_type)
                            product_verification_obj.save()
                    else:
                        product_id=product_id[0]
                    obj.country_id=country_id
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
                        product_name = product_name.values('product_name')[0]['product_name']
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
                    active_product_id=ActiveProduct.objects.filter(product_id__product_name=product_name,partner_id_id=partner_id)
                    if not active_product_id.exists():
                        product_id=None
                        q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
                        # partner_id=Partner(partner_id=request.user.id)
                        product_verification = ProductVerification.objects.filter(partner_id_id=partner_id,product_name=product_name,quarter_id=q_1_quarter)
                        if not product_verification.exists() and product_name:
                            product_verification_obj = ProductVerification.objects.create(product_name=product_name,quarter_id=q_1_quarter,created_by=request.user.id,updated_by=request.user.id,partner_id_id=request.user.id,sales_report_type=sales_report_type)
                            product_verification_obj.save()
                    else:
                        product_id=product_id[0]
                    q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
                    SalesReport.objects.create(
                partner_id=partner_id,
                quarter_id=q_1_quarter,
                sales_report_type=sales_report_type,
                month = month,
                year = year,
                country_id = country_id,
                product_id = product_id,
                product_name = product_name,
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

class SalesReportSubmissionViewset(viewsets.ModelViewSet):
    
    permission_classes = [IsAuthenticated,IsPartner]
    serializer_class = TemplateSubmissionSerializer
    queryset = TemplateMessage.objects.filter(template_type='sales',is_partner_message=True)


    def create(self, serializer):
        partner_id=self.request.user.id
        q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
            
        sales_report = SalesReport.objects.filter(partner_id=partner_id, quarter_id=q_1_quarter).values()
        disable_submit_api=False
        disable_submit_fdf=False
        for row in sales_report:
            if row:
                if row['sales_report_type'] == 'API':
                    try:
                        if row['country_id_id'] == None:
                            disable_submit_api=True
                    except:
                        disable_submit_api=True
                    if row['year'] == None or row['month'] == None or row['product_name'] == None or row['total_value']==None or row['quantity'] == None or row['purchaser'] == None:
                        disable_submit_api=True
                    
                elif row['sales_report_type'] == 'FDF':
                    try:
                        if row['country_id_id'] == None:
                            disable_submit_fdf=True
                    except:
                        disable_submit_fdf=True
                    if row['year'] == None or row['month'] == None or row['product_name'] == None or row['total_value']==None or row['quantity'] == None or row['purchaser'] == None or row['strength'] == None or row['formulation_md'] == None or row ['pack_size'] == None or row['gross_sale_price_usd'] == None:
                        disable_submit_fdf=True
        if disable_submit_api and disable_submit_fdf:
            return Response(data={'Missing fields. Please fill all the fields of API and FDF sections before submitting'}, status=status.HTTP_400_BAD_REQUEST) 
        elif disable_submit_api:
            return Response(data={'Missing fields. Please fill all the fields of API section before submitting'}, status=status.HTTP_400_BAD_REQUEST)
        elif disable_submit_fdf:
            return Response(data={'Missing fields. Please fill all the fields of FDF section before submitting'}, status=status.HTTP_400_BAD_REQUEST)

        else:    
            try:
                message=self.request.data['message']
            except:
                message=None
            template_type = 'Sales'
            api_link=os.getenv('API_LINK')
            link = str(api_link+'admin/sales-report/'+str(partner_id)+'/')
            #from_email_id = User.objects.filter(id=self.request.user.id).values_list('email',flat=True)[0]
            from_email_id = FROM_EMAIL_ID
            partner_name = Partner.objects.filter(partner_id=self.request.user.id).values_list('company_name',flat=True)[0]
            to_email_ids = []
            admin_email_ids = User.objects.filter(role='ADMIN').values('email')
            admin_email_ids = [entry for entry in admin_email_ids]
            for email in admin_email_ids:
                to_email_ids.append(email['email'])

            email_subject = str(partner_name.capitalize() + " has submitted " + template_type + " report")
            now = datetime.datetime.now()

            import re
            from_email_address = re.search('<(.*)>', from_email_id).group(1)
            disguised_email = partner_name.capitalize() + " <" + from_email_address + ">"

            html_message = render_to_string('partner_submission.html', {'message':message,'partner_name': partner_name.capitalize(),'template_type':template_type,'link':link, 'now':now,'api_link':api_link})
            plain_message = strip_tags(html_message)
            # send_mail(email_subject, plain_message, disguised_email, to_email_ids, html_message=html_message)
            
            quarter_name = q_1_quarter.__dict__['quarter_name']
            template_message = TemplateMessage.objects.create(partner_id_id=partner_id,is_approved=None,message=message,is_partner_message=True,
            updated_by=partner_id,created_by=partner_id,quarter_id=q_1_quarter,quarter_name=quarter_name,template_type='sales')
            template_message.save()
        
        return Response(data={'Report Submitted'}, status=status.HTTP_200_OK)

class SalesReportInboxPartner(APIView):

    permission_classes = [IsAuthenticated]

    def post(self,request):
        unread_messages = TemplateMessage.objects.filter(template_type='sales',is_partner_message=False,is_read=False)
        unread_messages.update(is_read=True)
        return Response(data={'Read all unread messages'},status=status.HTTP_200_OK)
