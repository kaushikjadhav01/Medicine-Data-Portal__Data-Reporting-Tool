from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.helpers.custom_permissions import IsAdmin
from django.utils.html import strip_tags
from api.models import (
    Partner,PartnerSerializer,
    Product,ActiveProduct,Stage,
    Quarter,ProductQuarter,ProductQuarterDate,ProductNotes,
    FilingPlan,Country, SalesReport, TemplateMessage
)
from api.helpers.generate_csv import generate_csv
import datetime, json
from django.template.defaultfilters import date
from django.core.paginator import Paginator

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

request_body_pdt = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'partner_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'product_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'status':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_STRING)),
        'stages':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_STRING))
    }
)

request_body_filing = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'partner_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'country_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'product_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'status':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_STRING))
    }
)

request_body_sales = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'partner_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'country_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'active_product_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'year':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'month':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_STRING)),
    }
)


class PDTDownloadReportView(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(request_body=request_body_pdt)
    def post(self,request):

        quarter_order = []
        quarter_objects = []

        #Get Active Quarter List
        active_quarters = Quarter.objects.filter(is_active=True).order_by('-quarter_id')
        if not active_quarters.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
        for quarter in active_quarters:
            quarter_order.append(quarter.quarter_name)
            quarter_objects.append(quarter)
            
        quarter_order.pop(0)
        latest_quarter = quarter_objects.pop(0)
        
        rows = []
        show_all_products = False
        

        if request.data.get('partner_id',None) == None:
            partners = Partner.objects.filter(is_active=True).order_by('company_name')
        else:
            partners = request.data['partner_id']
        
        # if products not given, consider all, else lookup for requested products
        if request.data.get('product_id',None) == None:
            show_all_products = True
            products = Product.objects.distinct()
        else:
            products=Product.objects.filter(product_id__in=request.data['product_id'])
        
        if request.data.get('status',None) == None:
            statuses = ActiveProduct.objects.filter(product_id__in=products,is_active=True).distinct().values_list('status',flat=True).distinct()
        else:
            statuses = request.data['status']
        
        if request.data.get('stages',None) == None:
            stage_ids = Stage.objects.filter(product_id__in=products).values_list('stage_id',flat=True).distinct().order_by('stage_id')
        else:
            stage_ids = request.data['stages']
        

        
        for partner in partners:

            partner_id = partner
            q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]
            approved_partner_messages = TemplateMessage.objects.filter(partner_id=partner_id,quarter_id=q_1_quarter,template_type='pdt',is_approved=True,is_partner_message=False).values('partner_id')
            if not approved_partner_messages.exists():
                continue
            try:
                company_name = Partner.objects.get(partner_id=partner_id).company_name
                active_products = ActiveProduct.objects.filter(partner_id=partner_id,is_active=True,product_id__in=products,status__in=statuses).distinct()
                if not active_products.exists():
                    continue
            except:
                continue
            
            pdt_obj = ProductQuarterDate.objects.filter(stage_id__in=stage_ids,
            product_quarter_id__active_product_id__in=active_products,product_quarter_id__quarter_id=q_1_quarter).values(
                'product_quarter_id__active_product_id__product_id__product_name',
                'product_quarter_id__active_product_id__status',
                'stage_id__description',
                'start_date','end_date','product_quarter_id__quarter_id__quarter_name',
                'product_quarter_id__active_product_id__productnotes__description').distinct().order_by('stage_id')
            
            for item in pdt_obj:
                if item not in rows:
                    rows.append({
                        'Company':company_name,
                        'Product':item['product_quarter_id__active_product_id__product_id__product_name'],
                        'Status':item['product_quarter_id__active_product_id__status'],
                        'Stage':item['stage_id__description'],
                        str('Start date '+item['product_quarter_id__quarter_id__quarter_name']):item['start_date'],
                        str('End date '+item['product_quarter_id__quarter_id__quarter_name']):item['end_date']
                    })
        rows=list(map(dict, set(tuple(sorted(d.items())) for d in rows)))
        rows = sorted(rows, key=lambda k: (k['Company'].lower(), k['Product'],k['Status'],k['Stage']))
        
        column_names = ["Company","Product","Status","Stage"]
        for each in quarter_order:
            column_names.append("Start date " + each)
            column_names.append("End date " + each)

        response = generate_csv(column_names=column_names,rows=rows,filename="PDTReport")
        return response


class FilingDownloadReportView(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(request_body=request_body_filing)
    def post(self,request):
        rows = []
        product_order = []
        show_all_status = False
        show_all_products=False
        if request.data.get('partner_id',None) == None:
            partners = Partner.objects.filter(is_active=True).order_by('company_name')
        else:
            partners = request.data['partner_id']
        
        if request.data.get('status',None) == None:
            show_all_status = True
        # if countries not given, show all else lookup for requested countries
        if request.data.get('country_id',None) == None:
            countries = Country.objects.order_by('country_name')
        else:
            countries = Country.objects.filter(country_id__in=request.data['country_id'])
        if not countries.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        # if products not given, consider all, else lookup for requested products
        if request.data.get('product_id',None) == None:
            show_all_products=True
            products = Product.objects.order_by('product_id')
        else:
            products=Product.objects.filter(product_id__in=request.data['product_id'])
        for product in products:
            product_order.append(product.product_name)    
        if product_order == None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        for partner in partners:
            partner_id = partner
            q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]
            approved_partner_messages = TemplateMessage.objects.filter(partner_id=partner_id,quarter_id=q_1_quarter,template_type='filing plan',is_approved=True,is_partner_message=False).values('partner_id')
            if not approved_partner_messages.exists():
                continue
            
            try:
                company_name = Partner.objects.get(partner_id=partner_id).company_name
                active_products = ActiveProduct.objects.filter(partner_id=partner_id,is_active=True).order_by('product_id')
                if not active_products.exists():
                    continue
            except:
                continue
            temp1 = {}
            for country in countries:
                filing_plan=FilingPlan.objects.filter(active_product_id__in=active_products,country_id=country.country_id).values('active_product_id__product_id__product_name','country_id__country_name','status').order_by('country_id__country_name')
                for item in filing_plan:
                    if temp1.get(item['country_id__country_name'],False) == False:
                        temp1[item['country_id__country_name']] = {}
                    
                    temp1[item['country_id__country_name']][item['active_product_id__product_id__product_name']] = item['status']
                
            for country,product_dict in temp1.items():
                temp2 = {}
                temp2["Country"] = country
                temp2["Company"] = company_name
                for product_name,statuses in product_dict.items():
                    temp2[product_name] = statuses
                rows.append(temp2)

        column_names = ["Company","Country"]
        for each in product_order:
            column_names.append(each)
        
        response = generate_csv(column_names=column_names,rows=rows,filename="FilingReport")
        return response


class SalesDownloadReportView(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(request_body=request_body_sales)
    def post(self,request, sales_report_type):
        
        sales_report_type = sales_report_type.upper()

        stages_json = open("static/stages.json").read()
        stages_json = json.loads(stages_json)
        if sales_report_type not in stages_json.keys():
            return Response(data={'Invalid Stage Type'},status=status.HTTP_400_BAD_REQUEST)
        
        if request.data.get('partner_id',None) == None:
            partner_ids = SalesReport.objects.filter(sales_report_type=sales_report_type,partner_id__is_active=True).values('partner_id')
            partner_ids = [obj['partner_id'] for obj in partner_ids]
            partner_ids = list(set(partner_ids))
        else:
            partner_ids = request.data['partner_id']
        
        if request.data.get('country_id',None) == None:
            country_ids = SalesReport.objects.filter(sales_report_type=sales_report_type).values('country_id')
            country_ids = [obj['country_id'] for obj in country_ids]
            country_ids = list(set(country_ids))
        else:
            country_ids = request.data['country_id']
        
        if request.data.get('product_id',None) == None:
            product_ids = Product.objects.all().values('product_id')
        else:
            product_ids=request.data['product_id']

        active_product_ids = SalesReport.objects.filter(sales_report_type=sales_report_type,active_product_id__product_id__in=product_ids).values('active_product_id').distinct()
        active_product_ids = [obj['active_product_id'] for obj in active_product_ids]
        active_product_ids = list(set(active_product_ids))
        
        if request.data.get('year',None) == None:
            years = SalesReport.objects.filter(sales_report_type=sales_report_type).values('year')
            years = [obj['year'] for obj in years]
            years = list(set(years))
        else:
            years = request.data['year']
        
        if request.data.get('month',None) == None:
            months = SalesReport.objects.filter(sales_report_type=sales_report_type).values('month')
            months = [obj['month'] for obj in months]
            months = list(set(months))
        else:
            months = request.data['month']
        
        non_approved_partners=[]
        q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]
        for partner_id in partner_ids:
            approved_partners = TemplateMessage.objects.filter(partner_id=partner_id,quarter_id=q_1_quarter,template_type='sales',is_approved=True,is_partner_message=False).values('partner_id')
            if not approved_partners.exists():
                non_approved_partners.append(partner_id)
        
        partner_ids = list(set(partner_ids)-set(non_approved_partners))
        
        rows = SalesReport.objects.filter(sales_report_type=sales_report_type,
        partner_id__in=partner_ids
        ).order_by('sales_report_id').values(
        'partner_id',
        'year',
        'month',
        'country_id',
        'active_product_id',
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
        ).distinct()
        
        product_order = Product.objects.values('product_id','product_name')
        countries = Country.objects.values('country_id','country_name')
        country_order = [entry for entry in countries]
        
        if not rows.exists():
            rows=[]
            return Response(data={"no_content":"No content found. Please add Sales data via POST request.","rows":rows,"product_order":product_order,"country_order":country_order},status=status.HTTP_200_OK)
        
        # Send country name and product name alongwith ids for front end
        rows = [entry for entry in rows]
        for row in rows:
            row['Company Name'] =  Partner.objects.filter(partner_id=row['partner_id']).values('company_name')[0]['company_name']
            if row['country_id']:
                row['Country Name'] =  Country.objects.filter(country_id=row['country_id']).values('country_name')[0]['country_name']
            # try:
            #     product_id = ActiveProduct.objects.filter(partner_id__in=partner_ids,is_active=True,active_product_id = row['active_product_id']).values('product_id')[0]['product_id']
            # except:
            #     pass
            row['Product Name'] = row['product_name']
        
        rows = sorted(rows, key=lambda k: (k['Company Name'].lower()))

        # Rename Columns and Delete Blank Columns and ids
        for row in rows:
            row.pop('country_id',None)
            row.pop('active_product_id',None)
            row.pop('partner_id',None)
            for key in list(row):
                if row[key]:
                    value = row.pop(key)
                    key=key.replace('_',' ')
                    key=key.title()
                    row[key]=value
                
                if row[key]==None and sales_report_type == 'API':
                    row.pop(key,None)
                
                    
        column_names = list(rows[0].keys())
        column_names.insert(0, column_names.pop(len(column_names)-3))
        column_names.insert(3, column_names.pop(len(column_names)-2))
        # print(column_names)
        if sales_report_type == 'API':
            column_names.insert(5, column_names.pop(len(column_names)-1))
        else:
            column_names.insert(4, column_names.pop(len(column_names)-1))
        
        response = generate_csv(column_names=column_names,rows=rows,filename="SalesReport")
        return response
