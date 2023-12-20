from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from operator import itemgetter
from itertools import chain
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
import datetime, json
from django.template.defaultfilters import date
from django.core.paginator import Paginator
from django.db.models import F
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
import pandas as pd
        
request_body_pdt = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'partner_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'product_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'status':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_STRING)),
        'stages':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_STRING)),
        'page_number':openapi.Schema(type=openapi.TYPE_INTEGER),
        'page_size':openapi.Schema(type=openapi.TYPE_INTEGER)
    }
)

request_body_filing = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'partner_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'country_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'product_id':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_INTEGER)),
        'status':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_STRING)),
        'page_number':openapi.Schema(type=openapi.TYPE_INTEGER),
        'page_size':openapi.Schema(type=openapi.TYPE_INTEGER)
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
        'page_number':openapi.Schema(type=openapi.TYPE_INTEGER),
        'page_size':openapi.Schema(type=openapi.TYPE_INTEGER)
    }
)

class PDTReportView(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(request_body=request_body_pdt)
    def post(self,request):

        quarter_order = []
        quarter_objects = []

        quarter_dropdown = list(Quarter.objects.filter().order_by('-quarter_year', '-quarter_index').values_list('quarter_name',flat=True))
        quarter_dropdown.pop(0)
        current_quarter = quarter_dropdown[0]

        #Get Active Quarter List
        quarter_name_query = request.data.get('quarter')
        if quarter_name_query == None or quarter_name_query == 'Loading...':
            active_quarters = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[0:3]
        else:
            active_quarters = Quarter.objects.order_by('-quarter_year', '-quarter_index')
            quarter_name_query = Quarter.objects.get(quarter_name=quarter_name_query)
            quarter_index_in_list = list(active_quarters).index(quarter_name_query)
            active_quarters = active_quarters[quarter_index_in_list-1:quarter_index_in_list+2]
        

        if active_quarters == []:
            return Response(status=status.HTTP_204_NO_CONTENT)
        for quarter in active_quarters:
            quarter_order.append(quarter.quarter_name)
            quarter_objects.append(quarter)
            
        quarter_order.pop(0)
        latest_quarter = quarter_objects.pop(0)
        
        rows = []
        

        if request.data.get('partner_id',None) == None:
            partners = Partner.objects.filter(is_active=True).order_by('company_name')
        else:
            partners = Partner.objects.filter(partner_id__in=request.data['partner_id'])
        
        # if products not given, consider all, else lookup for requested products
        if request.data.get('product_id',None) == None:
            products = Product.objects.filter(is_active=True).order_by('product_name')
        else:
            products = Product.objects.filter(product_id__in=request.data['product_id'])
        
        if request.data.get('status',None) == None:
            statuses = ActiveProduct.objects.filter(product_id__in=products,is_active=True).distinct().values_list('status',flat=True).distinct()
        else:
            statuses = request.data['status']
        
        if request.data.get('stages',None) == None:
            stages = Stage.objects.filter(product_id__in=products).values_list('description',flat=True).distinct().order_by('stage_id')
        else:
            stages = request.data['stages']
        
        filter_options = {}
        filter_options['partner_filter'] = list(ProductQuarterDate.objects.filter(product_quarter_id__quarter_id=active_quarters[1]).annotate(partner_id=F('product_quarter_id__active_product_id__partner_id'),company_name=F('product_quarter_id__active_product_id__partner_id__company_name')).values('partner_id','company_name').distinct().order_by('company_name'))
        filter_options['product_filter'] = list(ProductQuarterDate.objects.filter(product_quarter_id__quarter_id=active_quarters[1]).annotate(product_id=F('product_quarter_id__active_product_id__product_id'),product_name=F('product_quarter_id__active_product_id__product_id__product_name')).values('product_id','product_name').distinct().order_by('product_name'))
        filter_options['stage_filter']=Stage.objects.values_list('description',flat=True).distinct().order_by('description')
        filter_options['status_filter']=ActiveProduct.objects.filter(product_id__in=products,is_active=True).distinct().values_list('status',flat=True).distinct()

        for partner in partners:

            partner_id = partner
            q_1_quarter = active_quarters[1]
            approved_partner_messages = TemplateMessage.objects.filter(partner_id=partner_id,quarter_id=q_1_quarter,template_type='pdt',is_approved=True,is_partner_message=False).values('partner_id')
            if not approved_partner_messages.exists():
                continue
            try:
                company_name = Partner.objects.get(partner_id=partner_id).company_name
                # active_products = ActiveProduct.objects.filter(partner_id=partner_id,product_id__in=products,status__in=statuses,is_active=True).distinct()
                active_products = ProductQuarterDate.objects.filter(
                    product_quarter_id__active_product_id__partner_id=partner_id,
                    product_quarter_id__active_product_id__product_id__in=products,
                    product_quarter_id__active_product_id__status__in=statuses,
                    product_quarter_id__active_product_id__is_active=True,
                    product_quarter_id__quarter_id=active_quarters[1]
                ).distinct().values_list('product_quarter_id__active_product_id',flat=True)
                
                if not active_products.exists():
                    continue
            except:
                continue
            
            pdt_obj = ProductQuarterDate.objects.filter(stage_id__description__in=stages,
            product_quarter_id__active_product_id__in=active_products,product_quarter_id__quarter_id__in=active_quarters[1:3]).values(
                'product_quarter_id__active_product_id__product_id__product_name',
                'product_quarter_id__active_product_id__status',
                'stage_id__description',
                'start_date','end_date','product_quarter_id__quarter_id__quarter_name',
                'product_quarter_id__active_product_id__productnotes__description').distinct().order_by('stage_id')
            
            pdt_obj = (pd.DataFrame(pdt_obj)
                .fillna('')
                .groupby(['product_quarter_id__active_product_id__product_id__product_name','product_quarter_id__active_product_id__status','stage_id__description','product_quarter_id__active_product_id__productnotes__description'])
                .agg(dict)
                .reset_index()
                .to_dict('records'))
            
            for item in pdt_obj:
                pdt_dict = {
                'company':company_name,
                'product':item['product_quarter_id__active_product_id__product_id__product_name'],
                'product_status':item['product_quarter_id__active_product_id__status'],
                'stage':item['stage_id__description']
                }
                for index, quarter in item['product_quarter_id__quarter_id__quarter_name'].items():
                    pdt_dict['start_date_'+quarter]=item['start_date'][index]
                    pdt_dict['end_date_'+quarter]=item['end_date'][index]
                
                if pdt_dict not in rows:
                    rows.append(pdt_dict)
        rows=list(map(dict, set(tuple(sorted(d.items())) for d in rows)))
        rows = sorted(rows, key=lambda k: (k['company'].lower(), k['product'],k['product_status'],k['stage']))
        
        try:
            p = Paginator(rows, request.data['page_size'])
            pages = p.page(request.data['page_number'])
            rows = pages.object_list
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(data={'total_rows':p.count,'total_pages':p.num_pages,'current_quarter':current_quarter,'quarter_dropdown':quarter_dropdown,'quarter_order':quarter_order,'rows':rows,'filter_options':filter_options},status=status.HTTP_200_OK)

class FilingReportView(APIView):
    permission_classes = [IsAdmin]
    @swagger_auto_schema(request_body=request_body_filing)
    def post(self,request):
        
        rows = []
        product_order = []
        
        #Get Active Quarter List
        quarter_dropdown = list(Quarter.objects.filter().order_by('-quarter_year', '-quarter_index').values_list('quarter_name',flat=True))
        quarter_dropdown.pop(0)
        current_quarter = quarter_dropdown[0]

        quarter_name_query = request.data.get('quarter')
        if quarter_name_query == None or quarter_name_query == 'Loading...':
            q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
        else:
            q_1_quarter = Quarter.objects.filter(quarter_name=quarter_name_query).first()
            

        if request.data.get('partner_id',None) == None:
            partners = Partner.objects.filter(is_active=True).order_by('company_name')
        else:
            partners = Partner.objects.filter(partner_id__in=request.data['partner_id'])
        
        if request.data.get('status',None) == None:
            statuses = FilingPlan.objects.values_list('status',flat=True).distinct()
        else:
            statuses = request.data['status']
        # if countries not given, show all else lookup for requested countries
        if request.data.get('country_id',None) == None:
            countries = Country.objects.order_by('country_name')
        else:
            countries = Country.objects.filter(country_id__in=request.data['country_id'])
        if not countries.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        # if products not given, consider all, else lookup for requested products
        products = Product.objects.order_by('product_id')
        if request.data.get('product_status_dict',None) == None or all(v is None for v in request.data['product_status_dict'].values()):
            filter_products = False
        else:
            filter_products = True
            product_status_dict=request.data['product_status_dict']

        for product in products:
            product_order.append(product.product_name)
        # if product_order == None:
        #     return Response(status=status.HTTP_400_BAD_REQUEST)
        
        filter_options = {}
        filter_options['partner_filter'] = list(FilingPlan.objects.filter(quarter_id=q_1_quarter).annotate(partner_id=F('active_product_id__partner_id'),company_name=F('active_product_id__partner_id__company_name')).values('partner_id','company_name').distinct().order_by('company_name'))
        filter_options['country_filter'] = list(FilingPlan.objects.filter(quarter_id=q_1_quarter).annotate(country_name=F('country_id__country_name')).values('country_id','country_name').distinct().order_by('country_name'))
        filter_options['status_filter'] = FilingPlan.objects.filter(quarter_id=q_1_quarter).values_list('status',flat=True).distinct()
        
        for partner in partners:
            partner_id = partner
            company_name=partner.company_name
            approved_partner_messages = TemplateMessage.objects.filter(partner_id=partner_id,quarter_id=q_1_quarter,template_type='filing plan',is_approved=True,is_partner_message=False).values('partner_id')
            if not approved_partner_messages.exists():
                continue

            active_products = ActiveProduct.objects.filter(partner_id=partner_id,product_id__in=products,is_active=True).order_by('product_id')
            filing_plan=FilingPlan.objects.filter(active_product_id__partner_id=partner,active_product_id__in=active_products,country_id__in=countries, quarter_id=q_1_quarter).annotate(
                company_name=F('active_product_id__partner_id__company_name'),
                product_name=F('active_product_id__product_id__product_name'),
                country_name=F('country_id__country_name')
            ).values('company_name','product_name','country_name','status').order_by('country_name')
            
            if filter_products:
                filtered_df = pd.DataFrame()
                filing_plan_df = pd.DataFrame(filing_plan)
                filing_plan_df = filing_plan_df.pivot_table(index=['company_name','country_name'], columns = 'product_name', aggfunc='first')
                # print(partner_id, filing_plan_df.head())
                for product, statuses in product_status_dict.items():
                    try:
                        if filtered_df.empty:
                            filtered_df = filing_plan_df[(filing_plan_df['status'][product].isin(statuses))]
                        else:
                            filtered_df = filtered_df[(filtered_df['status'][product].isin(statuses))]
                        # filtered_df = pd.concat([filtered_df, df], axis=0)
                    except:
                        continue
                filtered_df = filtered_df.stack().reset_index()
                filing_plan = filtered_df.to_dict('records')
                # print(filing_plan)

            
            temp1 = {}
            for item in filing_plan:
                if temp1.get(item['country_name'],False) == False:
                    temp1[item['country_name']] = {}
                temp1[item['country_name']][item['product_name']] = item['status']
            for country,product_dict in temp1.items():
                temp2 = {}
                temp2["country"] = country
                temp2["company_name"] = company_name
                for product_name,statuses in product_dict.items():
                    temp2[product_name] = statuses
                rows.append(temp2)
            
        #     try:
        #         company_name = Partner.objects.get(partner_id=partner_id).company_name
        #         active_products = ActiveProduct.objects.filter(partner_id=partner_id,is_active=True).order_by('product_id')
        #         if not active_products.exists():
        #             continue
        #     except:
        #         continue
        #     temp1 = {}
        #     for country in countries:
        #         filing_plan=FilingPlan.objects.filter(active_product_id__in=active_products,country_id=country.country_id).values('active_product_id__product_id__product_name','country_id__country_name','status').order_by('country_id__country_name')
        #         for item in filing_plan:
        #             if temp1.get(item['country_id__country_name'],False) == False:
        #                 temp1[item['country_id__country_name']] = {}
                    
        #             temp1[item['country_id__country_name']][item['active_product_id__product_id__product_name']] = item['status']
                
        #     for country,product_dict in temp1.items():
        #         temp2 = {}
        #         temp2["country"] = country
        #         temp2["company_name"] = company_name
        #         for product_name,statuses in product_dict.items():
        #             temp2[product_name] = statuses
        #         rows.append(temp2)
                    
        try:
            p = Paginator(rows, request.data['page_size'])
            pages = p.page(request.data['page_number'])
            rows = pages.object_list
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(data={'total_rows':p.count,'total_pages':p.num_pages,"product_order":product_order,"rows":rows,"quarter_dropdown":quarter_dropdown,"current_quarter":current_quarter,"filter_options":filter_options},status=status.HTTP_200_OK)
        
class ConsolidatedSalesReportView(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(request_body=request_body_sales)
    def post(self,request, sales_report_type):

        sales_report_type = sales_report_type.upper()

        
        if request.data.get('partner_id',None) == None:
            partner_ids = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('partner_id',flat=True).distinct()
        else:
            partner_ids = request.data['partner_id']

        if request.data.get('product_id',None) == None:
            product_ids = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('product_id',flat=True).distinct()
        else:
            product_ids = request.data['product_id']
        
        if request.data.get('country_id',None) == None:
            country_ids = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('country_id',flat=True).distinct()
        else:
            country_ids = request.data['country_id']
        
        if request.data.get('quarter_id',None) == None:
            quarter_ids = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('quarter_id',flat=True).distinct()
        else:
            quarter_ids = request.data['quarter_id']
        
        if request.data.get('year',None) == None:
            years = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('year',flat=True).distinct()
        else:
            years = request.data['year']
        
        if request.data.get('month',None) == None:
            months = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('month',flat=True).distinct()
        else:
            months = request.data['month']
        
        if request.data.get('purchaser',None) == None:
            purchasers = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('purchaser',flat=True).distinct()
            filter_purchasers=False
        else:
            filter_purchasers=True
            purchasers = request.data['purchaser']
                
        if sales_report_type == 'FDF':
            if request.data.get('strength',None) == None:
                strengths = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('strength',flat=True).distinct()
                filter_strengths=False
            else:
                filter_strengths=True
                strengths = request.data['strength']

            if request.data.get('formulation_md',None) == None:
                formulation_mds = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('formulation_md',flat=True).distinct()
                filter_formulation_mds=False
            else:
                filter_formulation_mds=True
                formulation_mds = request.data['formulation_md']

            if request.data.get('currency',None) == None:
                currencies = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('currency',flat=True).distinct()
                filter_currencies=False
            else:
                filter_currencies=True
                currencies = request.data['currency']

            if request.data.get('procurement_end_country',None) == None:
                procurement_end_countries = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('procurement_end_country',flat=True).distinct()
                filter_procurement_end_countries=False
            else:
                filter_procurement_end_countries=True
                procurement_end_countries = request.data['procurement_end_country']

            if request.data.get('comments',None) == None:
                comments = SalesReport.objects.filter(sales_report_type=sales_report_type).values_list('comments',flat=True).distinct()
                filter_comments=False
            else:
                filter_comments=True
                comments = request.data['comments']

        approved_partners = TemplateMessage.objects.filter(template_type='sales',is_approved=True,is_partner_message=False).values('partner_id', 'quarter_id').distinct()

        rows = SalesReport.objects.none()
        for approval_dict in approved_partners:
            sales = SalesReport.objects.filter(sales_report_type=sales_report_type,partner_id=approval_dict['partner_id'],quarter_id=approval_dict['quarter_id'])
            rows = rows | sales        
        
        rows = rows.annotate(company_name=F('partner_id__company_name'),country_name=F('country_id__country_name'),quarter_name=F('quarter_id__quarter_name')).values(
        'partner_id',
        'company_name',
        'year',
        'month',
        'country_id',
        'country_name',
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
        'product_name',
        'quarter_name'
        )
        
        rows = rows.filter(
            partner_id__in=partner_ids,
            product_id__in=product_ids,
            country_id__in=country_ids,
            quarter_id__in=quarter_ids,
            year__in=years,
            month__in=months
        )

        filter_options = {}
        filter_options['partner_filter'] = list(rows.values('partner_id','company_name').distinct().order_by('company_name'))
        filter_options['country_filter'] = list(rows.values('country_id','country_name').distinct().order_by('country_name'))
        filter_options['quarter_filter'] = list(rows.values('quarter_id','quarter_name').distinct().order_by('-quarter_id__quarter_year', '-quarter_id__quarter_index'))
        filter_options['product_filter'] = list(rows.exclude(product_id__isnull=True).values('product_id','product_name').distinct().order_by('product_name'))
        filter_options['year_filter'] = list(rows.values('year').distinct().order_by('year'))
        filter_options['month_filter'] = list(rows.values('month').distinct().order_by('month'))
        filter_options['purchaser_filter'] = list(rows.values('purchaser').distinct().order_by('purchaser'))
        
        if sales_report_type == 'FDF':
            filter_options['strength_filter'] = list(rows.values('strength').distinct().order_by('strength'))
            filter_options['formulation_md_filter'] = list(rows.values('formulation_md').distinct().order_by('formulation_md'))
            filter_options['currency_filter'] = list(rows.values('currency').distinct().order_by('currency'))
            filter_options['procurement_end_country_filter'] = list(rows.values('procurement_end_country').distinct().order_by('procurement_end_country'))
            filter_options['comments_filter'] = list(rows.values('comments').distinct().order_by('comments'))
            
            if filter_purchasers == True:
                rows = rows.filter(purchaser__in=purchasers)
            if filter_strengths == True:
                rows = rows.filter(strength__in=strengths)
            if filter_formulation_mds == True:
                rows = rows.filter(formulation_md__in=formulation_mds)
            if filter_currencies == True:
                rows = rows.filter(currency__in=currencies)
            if filter_procurement_end_countries == True:
                rows = rows.filter(procurement_end_country__in=procurement_end_countries)
            if filter_comments == True:
                rows = rows.filter(comments__in=comments)
        
        product_order = Product.objects.values('product_id','product_name')
        countries = Country.objects.values('country_id','country_name')
        country_order = [entry for entry in countries]
        
        if not rows.exists():
            return Response(data={"no_content":"No content found. Please add Sales data via POST request.","rows":rows,"product_order":product_order,"country_order":country_order,"filter_options":filter_options},status=status.HTTP_200_OK)
        
        # Send country name and product name alongwith ids for front end
        # rows = [entry for entry in rows]
        # for row in rows:
        #     row['company_name'] =  Partner.objects.filter(partner_id=row['partner_id']).values('company_name')[0]['company_name']
        #     if row['country_id']:
        #         row['country_name'] =  Country.objects.filter(country_id=row['country_id']).values('country_name')[0]['country_name']
            # try:
            #     product_id = ActiveProduct.objects.filter(partner_id__in=partner_ids,active_product_id = row['active_product_id'],is_active=True).values('product_id')[0]['product_id']
            # except:
            #     pass
            # row['product_name'] = Product.objects.filter(product_id=product_id).values('product_name')[0]['product_name']
        
        
        rows = sorted(rows, key=lambda k: (k['company_name'].lower()))
        try:
            p = Paginator(rows, request.data['page_size'])
            pages = p.page(request.data['page_number'])
            rows = pages.object_list
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(data={'total_rows':p.count,'total_pages':p.num_pages,"rows":rows,"product_order":product_order,"country_order":country_order,"filter_options":filter_options},status=status.HTTP_200_OK)