from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework.views import APIView
from django.db.models import F
from api.helpers.custom_permissions import IsAdmin
from collections import defaultdict
from api.models import (
    User,UserNestedSerializer,
    Partner,PartnerNestedSerializer,
    TemplateMessage, Quarter, SalesReport,
    ActiveProduct, Product, Country
)
from operator import itemgetter
import json
import os
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.db import connection

class AdminDashboardSales(APIView):

    permission_classes = [IsAdmin]
    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'map_with', openapi.IN_QUERY, 
            type=openapi.TYPE_STRING, 
            required=True,
            enum=['product', 'company','country','period','year','month','quarter','price_per_pack','price_per_treatment']
        ),
        openapi.Parameter(
            'for', openapi.IN_QUERY, 
            type=openapi.TYPE_STRING, 
            required=True,
            enum=['product', 'company','country','period','year','month','quarter']
        )],
    )

    def get(self,request):

        if request.query_params['map_with'] == 'product' and request.query_params['for'] == 'company':
        
            active_products = ActiveProduct.objects.filter(is_active=True).order_by('active_product_id')
            rows=[]
            approved_quarters = TemplateMessage.objects.filter(template_type='sales',is_approved=True,is_partner_message=False).values('quarter_id')

            for active_product in active_products:
                product_id = active_product.product_id.product_id
                partner_id = active_product.partner_id
                approved_partner = TemplateMessage.objects.filter(template_type='sales',partner_id_id=partner_id,quarter_id__in=approved_quarters,is_partner_message=False).last()
                active_partner=Partner.objects.filter(is_active=True,partner_id=partner_id)
                
                if approved_partner != None and approved_partner.is_approved == True and active_partner.exists():
                    product_name = Product.objects.filter(product_id=product_id).values('product_name')[0]['product_name']
                    sales = SalesReport.objects.filter(sales_report_type='FDF',product_id=product_id,partner_id=partner_id).annotate(company_name=F('partner_id__company_name')).values('company_name','pack_size','quantity')
                    if sales:
                        sales_dict = defaultdict(int)
                        for d in sales:
                            if d['pack_size'] and d['quantity']:
                                sales = d['pack_size']*d['quantity']
                                sales_dict[d['company_name']] += sales
                        if sales_dict:
                            for key,value in sales_dict.items():
                                rows.append({
                                    'product_id':product_id,
                                    'product_name':product_name,
                                    'company_id':Partner.objects.filter(company_name=list(sales_dict.keys())[0]).values('partner_id')[0]['partner_id'],
                                    'company_name':key,
                                    'total_value':value
                                })
            rows = sorted(rows, key=lambda k: (k['product_name'].lower(), k['company_name'].lower()))

        if request.query_params['map_with'] == 'product' and request.query_params['for'] == 'country':
            active_products = ActiveProduct.objects.filter(is_active=True).order_by('active_product_id')
            rows=[]
            approved_quarters = TemplateMessage.objects.filter(template_type='sales',is_approved=True,is_partner_message=False).values('quarter_id')

            for active_product in active_products:
                product_id = active_product.product_id.product_id
                partner_id = active_product.partner_id
                
                approved_partner = TemplateMessage.objects.filter(template_type='sales',partner_id_id=partner_id,is_partner_message=False).last()
                active_partner=Partner.objects.filter(is_active=True,partner_id=partner_id)
                
                if approved_partner != None and approved_partner.is_approved == True and active_partner.exists():
                    product_name = Product.objects.filter(product_id=product_id).values('product_name')[0]['product_name']
                    sales = SalesReport.objects.filter(sales_report_type='FDF',product_id=product_id,partner_id=partner_id,quarter_id__in=approved_quarters).annotate(country_name=F('country_id__country_name')).values('country_name','quantity','pack_size')

                    if sales:
                        sales_dict = defaultdict(int)
                        for d in sales:
                            if d['pack_size'] and d['quantity']:
                                sales = d['pack_size']*d['quantity']
                                sales_dict[d['country_name']] += sales

                        if sales_dict:
                            for key,value in sales_dict.items():
                                rows.append({
                                    'product_id':product_id,
                                    'product_name':product_name,
                                    'country_id':Country.objects.filter(country_name=list(sales_dict.keys())[0]).values('country_id')[0]['country_id'],
                                    'country_name':key,
                                    'total_value':value
                                })
            rows = sorted(rows, key=lambda k: (k['product_name'].lower(), k['country_name'].lower()))

        if request.query_params['map_with'] == 'product' and request.query_params['for'] == 'period':

            q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[0]

            query = "WITH TEMP AS\
                    \
                    (SELECT PARTNER_ID\
                    FROM\
                    \
                    (SELECT PARTNER_ID\
                    FROM\
                    \
                    (SELECT DISTINCT ON (PARTNER_ID) PARTNER_ID, TEMPLATE_MESSAGE_ID, TEMPLATE_TYPE,IS_APPROVED\
                    FROM TEMPLATE_MESSAGE\
                    WHERE TEMPLATE_TYPE = 'sales' AND IS_PARTNER_MESSAGE = 'FALSE'\
                    ORDER BY PARTNER_ID,TEMPLATE_MESSAGE_ID DESC) AS R\
                    \
                    WHERE IS_APPROVED = 'TRUE') AS T\
                    \
                    JOIN PARTNER USING (PARTNER_ID)\
                    WHERE IS_ACTIVE = TRUE\
                    )\
                    \
                    SELECT PRODUCT_NAME,YEAR,MONTH,QUARTER_ID, QUARTER_NAME, ROUND(SUM(X),2)\
                    FROM\
                    \
                    (SELECT PRODUCT_NAME, (PACK_SIZE*QUANTITY) AS X, YEAR, MONTH, QUARTER_ID, QUARTER_NAME\
                    FROM\
                    \
                    (SELECT PRODUCT_ID, PACK_SIZE, QUANTITY, YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    FROM\
                    \
                    (SELECT PARTNER_ID,P.PRODUCT_ID, PACK_SIZE, QUANTITY, YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    FROM ((SALES_REPORT JOIN PRODUCT AS P USING (PRODUCT_ID)) JOIN QUARTER USING (QUARTER_ID))\
                    WHERE SALES_REPORT.SALES_REPORT_TYPE = 'FDF') AS S\
                    \
                    JOIN TEMP USING (PARTNER_ID)) AS A\
                    \
                    JOIN PRODUCT USING (PRODUCT_ID)) AS B\
                    \
                    GROUP BY PRODUCT_NAME,YEAR,MONTH,QUARTER_NAME,QUARTER_ID\
                    ORDER BY PRODUCT_NAME,YEAR\
                    "

            with connection.cursor() as cursor:
                cursor.execute(
                    query
                )
                row = cursor.fetchall()

            rows = []
            for each in row:

                if each[3] != q_1_quarter.quarter_id:
                    rows.append({
                        'product_name':each[0],
                        'year':each[1],
                        'month':each[2],
                        'quarter_name':each[4],
                        'total_value':each[5]
                    })


            '''
            active_products = ActiveProduct.objects.filter(is_active=True).order_by('active_product_id')
            rows=[]
            for active_product in active_products:
                product_id = active_product.product_id.product_id
                product_name = Product.objects.filter(product_id=product_id).values('product_name')[0]['product_name']
                value_list = [] 
            
                sales = SalesReport.objects.filter(sales_report_type='FDF',active_product_id__product_id=product_id).values('year','month','active_product_id__productquarter__quarter_id__quarter_name','quantity','pack_size')
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        key = 'year:' + str(d['year']) + 'month:' + d['month'] + 'quarter_name:' + d['active_product_id__productquarter__quarter_id__quarter_name']
                        sales_dict[key] += sales
                    
                    key = list(sales_dict.keys())[0]
                    year = (key.split('year:')[1]).split('month:')[0]
                    month = (key.split('month:')[1]).split('quarter_name:')[0]
                    quarter_name = (key.split('quarter_name:')[1])

                    dictionary = {
                        'product_id':product_id,
                        'product_name':product_name,
                        'year':year,
                        'month':month,
                        'quarter_name':quarter_name,
                        'total_value':list(sales_dict.values())[0]
                    }
                    if dictionary not in rows:
                        rows.append(dictionary)
            rows = sorted(rows, key=itemgetter('product_id')) 
            '''

        if request.query_params['map_with'] == 'company' and request.query_params['for'] == 'product': 
            companies = Partner.objects.order_by('partner_id')
            rows=[]
            for company in companies:
                company_id = company.partner_id
                company_name = company.company_name
                approved_partner = TemplateMessage.objects.filter(template_type='sales',partner_id=company,is_partner_message=False).last()
                approved_quarters = TemplateMessage.objects.filter(template_type='sales',is_approved=True,is_partner_message=False).values('quarter_id')
                active_partner=Partner.objects.filter(is_active=True,partner_id=company)
                
                if approved_partner != None and approved_partner.is_approved == True and active_partner.exists():

                    sales = SalesReport.objects.filter(sales_report_type='FDF',partner_id=company,quarter_id__in=approved_quarters,product_id__isnull=False).values('product_name','quantity','pack_size')
                    if sales:
                        sales_dict = defaultdict(int)
                        for d in sales:
                            if d['pack_size'] and d['quantity']:
                                sales = d['pack_size']*d['quantity']
                                sales_dict[d['product_name']] +=sales
                        if sales_dict:
                            for key,value in sales_dict.items():
                                rows.append({
                                    'company_id':company_id.id,
                                    'company_name':company_name,
                                    'product_id':Product.objects.filter(product_name=key).values('product_id')[0]['product_id'],
                                    'product_name':key,
                                    'total_value':value
                                })
            rows = sorted(rows, key=lambda k: (k['company_name'].lower(), k['product_name'].lower()))
            # rows = sorted(rows, key=itemgetter('company_name')) 
        
        if request.query_params['map_with'] == 'company' and request.query_params['for'] == 'country':
            companies = Partner.objects.order_by('partner_id')
            rows=[]
            for company in companies:
                company_id = company.partner_id
                company_name = company.company_name

                approved_partner = TemplateMessage.objects.filter(template_type='sales',partner_id=company,is_partner_message=False).last()
                active_partner=Partner.objects.filter(is_active=True,partner_id=company)
                approved_quarters = TemplateMessage.objects.filter(template_type='sales',is_approved=True,is_partner_message=False).values('quarter_id')
                
                if approved_partner != None and approved_partner.is_approved == True and active_partner.exists():
                    sales = SalesReport.objects.filter(sales_report_type='FDF',partner_id=company,quarter_id__in=approved_quarters).annotate(country_name=F('country_id__country_name')).values('country_name','quantity','pack_size')
                    if sales:
                        sales_dict = defaultdict(int)
                        for d in sales:
                            if d['pack_size'] and d['quantity']:
                                sales = d['pack_size']*d['quantity']
                                sales_dict[d['country_name']] +=sales
                        if sales_dict:
                            
                            for key,value in sales_dict.items():
                                rows.append({
                                    'company_id':company_id.id,
                                    'company_name':company_name,
                                    'country_id':Country.objects.filter(country_name=key).values('country_id')[0]['country_id'],
                                    'country_name':key,
                                    'total_value':value
                                })
            # rows = sorted(rows, key=itemgetter('company_id'))
            rows = sorted(rows, key=lambda k: (k['company_name'].lower(), k['country_name']))
        if request.query_params['map_with'] == 'company' and request.query_params['for'] == 'period':
            
            q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[0]

            query = "WITH TEMP AS\
                    \
                    (SELECT PARTNER_ID\
                    FROM\
                    \
                    (SELECT PARTNER_ID\
                    FROM\
                    \
                    (SELECT DISTINCT ON (PARTNER_ID) PARTNER_ID, TEMPLATE_MESSAGE_ID, TEMPLATE_TYPE,IS_APPROVED\
                    FROM TEMPLATE_MESSAGE\
                    WHERE TEMPLATE_TYPE = 'sales' AND IS_PARTNER_MESSAGE = 'FALSE'\
                    ORDER BY PARTNER_ID,TEMPLATE_MESSAGE_ID DESC) AS R\
                    \
                    WHERE IS_APPROVED = 'TRUE') AS T\
                    \
                    JOIN PARTNER USING (PARTNER_ID)\
                    WHERE IS_ACTIVE = TRUE\
                    )\
                    \
                    SELECT COMPANY_NAME,YEAR,MONTH,QUARTER_ID, QUARTER_NAME, ROUND(SUM(X),2)\
                    FROM\
                    \
                    (SELECT *\
                    FROM\
                    \
                    (SELECT PARTNER_ID, COMPANY_NAME, (PACK_SIZE*QUANTITY) AS X, YEAR, MONTH, QUARTER_ID, QUARTER_NAME\
                    FROM\
                    \
                    (SELECT P.PARTNER_ID, PACK_SIZE, QUANTITY, YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    FROM ((SALES_REPORT JOIN PARTNER AS P USING (PARTNER_ID)) JOIN QUARTER USING (QUARTER_ID))\
                    WHERE SALES_REPORT.SALES_REPORT_TYPE = 'FDF') AS A\
                    \
                    JOIN PARTNER USING (PARTNER_ID)) AS B\
                    \
                    JOIN TEMP USING (PARTNER_ID)) AS S\
                    \
                    GROUP BY PARTNER_ID,COMPANY_NAME,YEAR,MONTH,QUARTER_NAME,QUARTER_ID\
                    ORDER BY COMPANY_NAME,YEAR\
                    "

            with connection.cursor() as cursor:
                cursor.execute(
                    query
                )
                row = cursor.fetchall()

            rows = []
            for each in row:

                if each[3] != q_1_quarter.quarter_id:
                    rows.append({
                        'company_name':each[0],
                        'year':each[1],
                        'month':each[2],
                        'quarter_name':each[4],
                        'total_value':each[5]
                    })

            '''
            companies = Partner.objects.order_by('partner_id')
            rows=[]

            for company in companies:
                partner_id = company
                company_id = company.partner_id
                company_name = company.company_name 

                sales = SalesReport.objects.filter(sales_report_type='FDF',partner_id=partner_id).values('year','month','active_product_id__productquarter__quarter_id__quarter_name','quantity','pack_size')
            
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        key = 'year:' + str(d['year']) + 'month:' + d['month'] + 'quarter_name:' + d['active_product_id__productquarter__quarter_id__quarter_name']
                        sales_dict[key] +=sales

                    key = list(sales_dict.keys())[0]
                    year = (key.split('year:')[1]).split('month:')[0]
                    month = (key.split('month:')[1]).split('quarter_name:')[0]
                    quarter_name = (key.split('quarter_name:')[1])

                    dictionary = {
                        'company_id':company_id.id,
                        'company_name':company_name,
                        'year':year,
                        'month':month,
                        'quarter_name':quarter_name,
                        'total_value':list(sales_dict.values())[0]
                    }
                    if dictionary not in rows:
                        rows.append(dictionary)
            rows = sorted(rows, key=itemgetter('company_id'))
            '''

        if request.query_params['map_with'] == 'country' and request.query_params['for'] == 'product':
            countries = Country.objects.order_by('country_id')
            rows=[]
            approved_partners = TemplateMessage.objects.filter(template_type='sales',is_approved=True,is_partner_message=False).values('partner_id')
            approved_quarters = TemplateMessage.objects.filter(template_type='sales',is_approved=True,is_partner_message=False).values('quarter_id')

            for country in countries:
                country_id = country
                country_name = country.country_name
                sales = SalesReport.objects.filter(sales_report_type='FDF',country_id=country,product_id__isnull=False,quarter_id__in=approved_quarters,partner_id__in=approved_partners,partner_id__is_active=True).values('product_name','quantity','pack_size','partner_id')
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        if d['pack_size'] and d['quantity']:
                            sales = d['pack_size']*d['quantity']
                            sales_dict[d['product_name']] +=sales
                    if sales_dict:
                        for key, value in sales_dict.items():
                            rows.append({
                                'country_id':country_id.country_id,
                                'country_name':country_name,
                                'product_id':Product.objects.filter(product_name=key).values('product_id')[0]['product_id'],
                                'product_name':key,
                                'total_value':value
                            })
            # rows = sorted(rows, key=itemgetter('country_id'))
            rows = sorted(rows, key=lambda k: (k['country_name'].lower(), k['product_name'].lower()))

        if request.query_params['map_with'] == 'country' and request.query_params['for'] == 'company':
            countries = Country.objects.order_by('country_id')
            rows=[]
            approved_partners = TemplateMessage.objects.filter(template_type='sales',is_approved=True,is_partner_message=False).values('partner_id')
            approved_quarters = TemplateMessage.objects.filter(template_type='sales',is_approved=True,is_partner_message=False).values('quarter_id')
            
            for country in countries:
                country_id = country
                country_name = country.country_name

                sales = SalesReport.objects.filter(sales_report_type='FDF',quarter_id__in=approved_quarters,country_id=country_id,partner_id__in=approved_partners,partner_id__is_active=True).annotate(company_name=F('partner_id__company_name')).values('company_name','quantity','pack_size','partner_id')
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:                
                        if d['pack_size'] and d['quantity']:
                            sales = d['pack_size']*d['quantity']
                            sales_dict[d['company_name']] +=sales
                    if sales_dict:
                        for key, value in sales_dict.items():
                            rows.append({
                                'country_id':country_id.country_id,
                                'country_name':country_name,
                                'company_id':Partner.objects.filter(company_name=key).values('partner_id')[0]['partner_id'],
                                'company_name':key,
                                'total_value':value
                            })
            rows = sorted(rows, key=lambda k: (k['country_name'].lower(), k['company_name'].lower()))
            # rows = sorted(rows, key=itemgetter('country_id'))

        if request.query_params['map_with'] == 'country' and request.query_params['for'] == 'period': 
            
            q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[0]

            query = "WITH TEMP AS\
                    \
                    (SELECT PARTNER_ID\
                    FROM\
                    \
                    (SELECT PARTNER_ID\
                    FROM\
                    \
                    (SELECT DISTINCT ON (PARTNER_ID) PARTNER_ID, TEMPLATE_MESSAGE_ID, TEMPLATE_TYPE,IS_APPROVED\
                    FROM TEMPLATE_MESSAGE\
                    WHERE TEMPLATE_TYPE = 'sales' AND IS_PARTNER_MESSAGE = 'FALSE'\
                    ORDER BY PARTNER_ID,TEMPLATE_MESSAGE_ID DESC) AS R\
                    \
                    WHERE IS_APPROVED = 'TRUE') AS T\
                    \
                    JOIN PARTNER USING (PARTNER_ID)\
                    WHERE IS_ACTIVE = TRUE\
                    )\
                    \
                    SELECT COUNTRY_NAME, YEAR, MONTH, QUARTER_ID,QUARTER_NAME, ROUND(SUM(X),2)\
                    FROM\
                    \
                    (SELECT *\
                    FROM\
                    \
                    (SELECT PARTNER_ID, COUNTRY_ID, COUNTRY_NAME, (PACK_SIZE*QUANTITY) AS X, YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    FROM ((SALES_REPORT JOIN QUARTER USING (QUARTER_ID)) JOIN COUNTRY USING (COUNTRY_ID))\
                    WHERE SALES_REPORT.SALES_REPORT_TYPE = 'FDF') AS A\
                    \
                    JOIN TEMP USING (PARTNER_ID)) AS S\
                    \
                    GROUP BY COUNTRY_NAME, YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    ORDER BY COUNTRY_NAME,YEAR\
                    "

            with connection.cursor() as cursor:
                cursor.execute(
                    query
                )
                row = cursor.fetchall()

            rows = []
            for each in row:

                if each[3] != q_1_quarter.quarter_id:
                    rows.append({
                        'country_name':each[0],
                        'year':each[1],
                        'month':each[2],
                        'quarter_name':each[4],
                        'total_value':each[5]
                    })
            
            '''
            countries = Country.objects.order_by('country_id')
            rows=[]
            for country in countries:
                country_id = country
                country_name = country.country_name

                sales = SalesReport.objects.filter(sales_report_type='FDF',country_id=country_id).values('year','month','active_product_id__productquarter__quarter_id__quarter_name','quantity','pack_size')
            
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        key = 'year:' + str(d['year']) + 'month:' + d['month'] + 'quarter_name:' + d['active_product_id__productquarter__quarter_id__quarter_name']
                        sales_dict[key] +=sales

                    key = list(sales_dict.keys())[0]
                    year = (key.split('year:')[1]).split('month:')[0]
                    month = (key.split('month:')[1]).split('quarter_name:')[0]
                    quarter_name = (key.split('quarter_name:')[1])

                    dictionary = {
                        'country_id':country_id.country_id,
                        'country_name':country_name,
                        'year':year,
                        'month':month,
                        'quarter_name':quarter_name,
                        'total_value':list(sales_dict.values())[0]
                    }
                    if dictionary not in rows:
                        rows.append(dictionary)
            rows = sorted(rows, key=itemgetter('country_id'))
            '''

        
        if request.query_params['map_with'] == 'year' and request.query_params['for'] == 'product':
            years = SalesReport.objects.all().values('year').distinct().order_by('year')
            rows=[]
            for year in years:
                sales = SalesReport.objects.filter(sales_report_type='FDF',year=year['year'],product_id__isnull=False).values('product_name','quantity','pack_size')
            
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        sales_dict[d['product_name']] +=sales
                    for key,value in sales_dict.items():
                        product_id = Product.objects.filter(product_name=key).values('product_id')[0]['product_id'],
                        rows.append({
                            'year_id':year['year'],
                            'year':year['year'],
                            'product_id':product_id[0],
                            'product_name':key,
                            'total_value':value
                        })
            rows = sorted(rows, key=itemgetter('year')) 
        
        if request.query_params['map_with'] == 'month' and request.query_params['for'] == 'product':
            months = SalesReport.objects.all().values('month').distinct().order_by('month')
            rows=[]
            for month in months:
                sales = SalesReport.objects.filter(sales_report_type='FDF',month=month['month'],product_id__isnull=False).values('product_name','quantity','pack_size')
            
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        sales_dict[d['product_name']] +=sales
                    for key,value in sales_dict.items():
                        product_id = Product.objects.filter(product_name=key).values('product_id')[0]['product_id'],
                        years = ['dummy','January','February','March','April','May','June','July','August','September','October','November','December']
                        month_id = years.index(month['month'])
                        rows.append({
                            'month_id':month_id,
                            'month':month['month'],
                            'product_id':product_id[0],
                            'product_name':key,
                            'total_value':value
                        })
            rows = sorted(rows, key=itemgetter('month_id')) 
        
        if request.query_params['map_with'] == 'quarter' and request.query_params['for'] == 'product':
            quarters = Quarter.objects.all()
            rows=[]
            for quarter in quarters:
                quarter_id = quarter.quarter_id
                quarter_name = quarter.quarter_name
                sales = SalesReport.objects.filter(sales_report_type='FDF',quarter_id=quarter_id,product_id__isnull=False).values('product_name','quantity','pack_size')
            
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        sales_dict[d['product_name']] +=sales
                    for key,value in sales_dict.items():
                        product_id = Product.objects.filter(product_name=key).values('product_id')[0]['product_id'],
                        rows.append({
                            'quarter_id':quarter_id,
                            'quarter_name':quarter_name,
                            'product_id':product_id[0],
                            'product_name':key,
                            'total_value':value
                        })
            rows = sorted(rows, key=itemgetter('quarter_id'))

        if request.query_params['map_with'] == 'year' and request.query_params['for'] == 'company':
            years = SalesReport.objects.all().values('year').distinct().order_by('year')
            rows=[]
            for year in years:
                sales = SalesReport.objects.filter(sales_report_type='FDF',year=year['year']).annotate(company_name=F('partner_id__company_name')).values('company_name','quantity','pack_size')
            
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        sales_dict[d['company_name']] +=sales
                    for key,value in sales_dict.items():
                        partner_id = Partner.objects.filter(company_name=key).values('partner_id')[0]['partner_id'],
                        rows.append({
                            'year_id':year['year'],
                            'year':year['year'],
                            'company_id':partner_id[0],
                            'company_name':key,
                            'total_value':value
                        })
            rows = sorted(rows, key=itemgetter('year'))

        if request.query_params['map_with'] == 'month' and request.query_params['for'] == 'company':
            months = SalesReport.objects.all().values('month').distinct().order_by('month')
            rows=[]
            for month in months:
                sales = SalesReport.objects.filter(sales_report_type='FDF',month=month['month']).annotate(company_name=F('partner_id__company_name')).values('company_name','quantity','pack_size')
            
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        sales_dict[d['company_name']] +=sales
                    for key,value in sales_dict.items():
                        partner_id = Partner.objects.filter(company_name=key).values('partner_id')[0]['partner_id'],
                        years = ['dummy','January','February','March','April','May','June','July','August','September','October','November','December']
                        month_id = years.index(month['month'])
                        rows.append({
                            'month_id':month_id,
                            'month':month['month'],
                            'company_id':partner_id[0],
                            'company_name':key,
                            'total_value':value
                        })
            rows = sorted(rows, key=itemgetter('month_id')) 

        if request.query_params['map_with'] == 'quarter' and request.query_params['for'] == 'company':
            quarters = Quarter.objects.all()
            rows=[]
            for quarter in quarters:
                quarter_id = quarter.quarter_id
                quarter_name = quarter.quarter_name
                sales = SalesReport.objects.filter(sales_report_type='FDF',quarter_id=quarter_id).annotate(company_name=F('partner_id__company_name')).values('company_name','quantity','pack_size')
            
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        sales_dict[d['company_name']] +=sales
                    for key,value in sales_dict.items():
                        partner_id = Partner.objects.filter(company_name=key).values('partner_id')[0]['partner_id'],
                        rows.append({
                            'quarter_id':quarter_id,
                            'quarter_name':quarter_name,
                            'partner_id':partner_id[0],
                            'company_name':key,
                            'total_value':value
                        })
            rows = sorted(rows, key=itemgetter('quarter_id')) 

        if request.query_params['map_with'] == 'year' and request.query_params['for'] == 'country':
            years = SalesReport.objects.all().values('year').distinct().order_by('year')
            rows=[]
            for year in years:
                sales = SalesReport.objects.filter(sales_report_type='FDF',year=year['year']).annotate(country_name=F('country_id__country_name')).values('country_name','quantity','pack_size')
            
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        sales_dict[d['country_name']] += sales
                    for key,value in sales_dict.items():
                        country_id = Country.objects.filter(country_name=key).values('country_id')[0]['country_id'],
                        rows.append({
                            'year_id':year['year'],
                            'year':year['year'],
                            'country_id':country_id[0],
                            'country_name':key,
                            'total_value':value
                        })
            rows = sorted(rows, key=itemgetter('year')) 

        if request.query_params['map_with'] == 'month' and request.query_params['for'] == 'country':
            months = SalesReport.objects.all().values('month').distinct().order_by('month')
            rows=[]
            for month in months:
                sales = SalesReport.objects.filter(sales_report_type='FDF',month=month['month']).annotate(country_name=F('country_id__country_name')).values('country_name','quantity','pack_size')
            
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        sales_dict[d['country_name']] += sales
                    for key,value in sales_dict.items():
                        country_id = Country.objects.filter(country_name=key).values('country_id')[0]['country_id'],
                        years = ['dummy','January','February','March','April','May','June','July','August','September','October','November','December']
                        month_id = years.index(month['month'])
                        rows.append({
                            'month_id':month_id,
                            'month':month['month'],
                            'country_id':country_id[0],
                            'country_name':key,
                            'total_value':value
                        })
            rows = sorted(rows, key=itemgetter('month_id')) 

        if request.query_params['map_with'] == 'quarter' and request.query_params['for'] == 'country':
            quarters = Quarter.objects.all()
            rows=[]
            for quarter in quarters:
                quarter_id = quarter.quarter_id
                quarter_name = quarter.quarter_name
                sales = SalesReport.objects.filter(sales_report_type='FDF',quarter_id=quarter_id).annotate(country_name=F('country_id__country_name')).values('country_name','quantity','pack_size')
            
                if sales:
                    sales_dict = defaultdict(int)
                    for d in sales:
                        sales = d['pack_size']*d['quantity']
                        sales_dict[d['country_name']] += sales
                    for key,value in sales_dict.items():
                        country_id = Country.objects.filter(country_name=key).values('country_id')[0]['country_id'],
                        rows.append({
                            'quarter_id':quarter_id,
                            'quarter_name':quarter_name,
                            'country_id':country_id[0],
                            'country_name':key,
                            'total_value':value
                        })
            rows = sorted(rows, key=itemgetter('quarter_id'))

        if request.query_params['map_with'] == 'price_per_pack' and request.query_params['for'] == 'period':
            
            q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[0]

            query = "WITH TEMP AS\
                    \
                    (SELECT PARTNER_ID\
                    FROM\
                    \
                    (SELECT PARTNER_ID\
                    FROM\
                    \
                    (SELECT DISTINCT ON (PARTNER_ID) PARTNER_ID, TEMPLATE_MESSAGE_ID, TEMPLATE_TYPE,IS_APPROVED\
                    FROM TEMPLATE_MESSAGE\
                    WHERE TEMPLATE_TYPE = 'sales' AND IS_PARTNER_MESSAGE = 'FALSE'\
                    ORDER BY PARTNER_ID,TEMPLATE_MESSAGE_ID DESC) AS R\
                    \
                    WHERE IS_APPROVED = 'TRUE') AS T\
                    \
                    JOIN PARTNER USING (PARTNER_ID)\
                    WHERE IS_ACTIVE = TRUE\
                    )\
                    \
                    SELECT ROUND(SUM(PRICE_PER_PACK),5),YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    FROM\
                    \
                    (SELECT *\
                    FROM\
                    \
                    (SELECT PARTNER_ID, (TOTAL_VALUE/QUANTITY) AS PRICE_PER_PACK, YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    FROM (SALES_REPORT JOIN QUARTER USING (QUARTER_ID))\
                    WHERE QUANTITY != 0) AS A\
                    \
                    JOIN TEMP USING (PARTNER_ID)) AS S\
                    \
                    GROUP BY YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    ORDER BY YEAR\
                    "

            with connection.cursor() as cursor:
                cursor.execute(
                    query
                )
                row = cursor.fetchall()

            rows = []
            for each in row:

                if each[3] != q_1_quarter.quarter_id:
                    rows.append({
                        'price_per_pack':each[0],
                        'year':each[1],
                        'month':each[2],
                        'quarter_name':each[4]
                    })
            

            '''
            quarter_objects = []
            #Get Active Quarter List
            active_quarters = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')
            if not active_quarters.exists():
                return Response(status=status.HTTP_204_NO_CONTENT)
            for quarter in active_quarters:
                quarter_objects.append(quarter)

            latest_quarter = quarter_objects.pop(0)
        
        # quarters = Quarter.objects.all()
        # quarters.exclude(quarter_id=latest_quarter)
            rows=[]
            for quarter in quarter_objects:
                quarter_id = quarter.quarter_id
                quarter_name = quarter.quarter_name
                sales = SalesReport.objects.filter(active_product_id__productquarter__quarter_id=quarter_id).annotate(country_name=F('country_id__country_name')).values('country_name','total_value','quantity')
            
                if sales:
                    # sales_dict = defaultdict(int)
                    price_per_pack = 0
                    for d in sales:
                        if d['quantity'] != 0:
                            price_per_pack += (d['total_value']/d['quantity'])
                    
                    rows.append({
                        'quarter_id':quarter_id,
                        'quarter_name':quarter_name,
                        'price_per_pack':price_per_pack
                    })
            rows = sorted(rows, key=itemgetter('quarter_id'))
            '''

        '''
        if request.query_params['map_with'] == 'price_per_pack' and request.query_params['for'] == 'year':
            years = SalesReport.objects.all().values('year').distinct().order_by('year')
            rows=[]
            for year in years:
                sales = SalesReport.objects.filter(year=year['year']).annotate(country_name=F('country_id__country_name')).values('country_name','total_value','quantity')
                price_per_pack = 0
                if sales:
                    # sales_dict = defaultdict(int)
                    for d in sales:
                        if d['quantity'] != 0:
                            price_per_pack += d['total_value']/d['quantity']
                        # sales_dict[d['country_name']] += d['total_value']
                    # for key,value in sales_dict.items():
                        # country_id = Country.objects.filter(country_name=key).values('country_id')[0]['country_id'],
                    rows.append({
                        'year_id':year['year'],
                        'year':year['year'],
                        'price_per_pack':price_per_pack
                        })
            rows = sorted(rows, key=itemgetter('year')) 
        
        if request.query_params['map_with'] == 'price_per_pack' and request.query_params['for'] == 'month':
            months = SalesReport.objects.all().values('month').distinct().order_by('month')
            rows=[]
            for month in months:
                sales = SalesReport.objects.filter(month=month['month']).annotate(country_name=F('country_id__country_name')).values('country_name','total_value','quantity')
                price_per_pack = 0
                if sales:
                    # sales_dict = defaultdict(int)
                    for d in sales:
                        if d['quantity'] != 0:
                            price_per_pack += d['total_value']/d['quantity']
                        # sales_dict[d['country_name']] += d['total_value']
                    # for key,value in sales_dict.items():
                        # country_id = Country.objects.filter(country_name=key).values('country_id')[0]['country_id'],
                    years = ['dummy','January','February','March','April','May','June','July','August','September','October','November','December']
                    month_id = years.index(month['month'])
                    rows.append({
                        'month_id':month_id,
                        'month':month['month'],
                        'price_per_pack':price_per_pack
                        })
            rows = sorted(rows, key=itemgetter('month_id'))
        
        '''

        if request.query_params['map_with'] == 'price_per_treatment' and request.query_params['for'] == 'period':

            q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[0]

            query = "WITH TEMP AS\
                    \
                    (SELECT PARTNER_ID\
                    FROM\
                    \
                    (SELECT PARTNER_ID\
                    FROM\
                    \
                    (SELECT DISTINCT ON (PARTNER_ID) PARTNER_ID, TEMPLATE_MESSAGE_ID, TEMPLATE_TYPE,IS_APPROVED\
                    FROM TEMPLATE_MESSAGE\
                    WHERE TEMPLATE_TYPE = 'sales' AND IS_PARTNER_MESSAGE = 'FALSE'\
                    ORDER BY PARTNER_ID,TEMPLATE_MESSAGE_ID DESC) AS R\
                    \
                    WHERE IS_APPROVED = 'TRUE') AS T\
                    \
                    JOIN PARTNER USING (PARTNER_ID)\
                    WHERE IS_ACTIVE = TRUE\
                    )\
                    \
                    SELECT *\
                    FROM\
                    \
                    (SELECT ROUND(SUM(PRICE_PER_TREATMENT),5) AS PRICE_PER_TREATMENT,YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    FROM\
                    \
                    (SELECT PRICE_PER_TREATMENT, YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    FROM\
                    \
                    (SELECT PARTNER_ID, (TOTAL_VALUE/(QUANTITY*PACK_SIZE)*365) AS PRICE_PER_TREATMENT, YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    FROM (SALES_REPORT JOIN QUARTER USING (QUARTER_ID))\
                    WHERE QUANTITY != 0 AND PACK_SIZE != 0) AS A\
                    \
                    JOIN TEMP USING (PARTNER_ID)) AS S\
                    \
                    GROUP BY YEAR, MONTH, QUARTER_ID,QUARTER_NAME\
                    ORDER BY YEAR) AS B\
                    \
                    WHERE PRICE_PER_TREATMENT != 0\
                    "

            with connection.cursor() as cursor:
                cursor.execute(
                    query
                )
                row = cursor.fetchall()

            rows = []
            for each in row:

                if each[3] != q_1_quarter.quarter_id:
                    rows.append({
                        'price_per_treatment':each[0],
                        'year':each[1],
                        'month':each[2],
                        'quarter_name':each[4]
                    })

            '''
            years = SalesReport.objects.all().values('year').distinct().order_by('year')
            rows=[]
            for year in years:
                sales = SalesReport.objects.filter(year=year['year'],sales_report_type='FDF').annotate(country_name=F('country_id__country_name')).values('country_name','total_value','quantity','pack_size')
                price_per_treatment = 0
                if sales:
                    # sales_dict = defaultdict(int)
                    for d in sales:
                        if d['quantity'] != 0 and d['pack_size'] != 0:
                            price_per_treatment += d['total_value']/(d['quantity']*d['pack_size'])*365
                        # sales_dict[d['country_name']] += d['total_value']
                    # for key,value in sales_dict.items():
                        # country_id = Country.objects.filter(country_name=key).values('country_id')[0]['country_id'],
                    rows.append({
                        'year_id':year['year'],
                        'year':year['year'],
                        'price_per_treatment':price_per_treatment
                        })
            rows = sorted(rows, key=itemgetter('year')) 
            '''

        '''
        if request.query_params['map_with'] == 'price_per_treatment' and request.query_params['for'] == 'month':
            months = SalesReport.objects.all().values('month').distinct().order_by('month')
            rows=[]
            for month in months:
                sales = SalesReport.objects.filter(sales_report_type='FDF',month=month['month']).annotate(country_name=F('country_id__country_name')).values('country_name','total_value','quantity','pack_size')
                price_per_treatment = 0
                if sales:
                    # sales_dict = defaultdict(int)
                    for d in sales:
                        if d['quantity'] != 0 and d['pack_size'] != 0:
                            price_per_treatment += d['total_value']/(d['quantity']*d['pack_size'])*365
                    # sales_dict[d['country_name']] += d['total_value']
                    # for key,value in sales_dict.items():
                        # country_id = Country.objects.filter(country_name=key).values('country_id')[0]['country_id'],
                    years = ['dummy','January','February','March','April','May','June','July','August','September','October','November','December']
                    month_id = years.index(month['month'])
                    rows.append({
                        'month_id':month_id,
                        'month':month['month'],
                        'price_per_treatment':price_per_treatment
                        })
            rows = sorted(rows, key=itemgetter('month_id'))

        if request.query_params['map_with'] == 'price_per_treatment' and request.query_params['for'] == 'quarter':
            quarter_objects = []
            #Get Active Quarter List
            active_quarters = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')
            if not active_quarters.exists():
                return Response(status=status.HTTP_204_NO_CONTENT)
            for quarter in active_quarters:
                quarter_objects.append(quarter)

            latest_quarter = quarter_objects.pop(0)
        
        # quarters = Quarter.objects.all()
        # quarters.exclude(quarter_id=latest_quarter)
            rows=[]
            for quarter in quarter_objects:
                quarter_id = quarter.quarter_id
                quarter_name = quarter.quarter_name
                sales = SalesReport.objects.filter(sales_report_type='FDF',active_product_id__productquarter__quarter_id=quarter_id).annotate(country_name=F('country_id__country_name')).values('country_name','total_value','quantity','pack_size')
            
                if sales:
                    # sales_dict = defaultdict(int)
                    price_per_treatment = 0
                    for d in sales:
                        if d['quantity'] != 0 and d['pack_size'] != 0:
                            price_per_treatment += d['total_value']/(d['quantity']*d['pack_size'])*365
                    
                    rows.append({
                        'quarter_id':quarter_id,
                        'quarter_name':quarter_name,
                        'price_per_treatment':price_per_treatment
                    })
            rows = sorted(rows, key=itemgetter('quarter_id'))

        '''

        return Response(data={"rows":rows},status=status.HTTP_200_OK)
