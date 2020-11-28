from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.helpers.custom_permissions import IsAdmin
from django.db.models import F
from django.db import connection
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from MPP_API.settings import quarter_list,quarter_mapping
from api.models import (
    ActiveProduct,Product,OngoingQuarter,
    Country,FilingPlan, Partner,
    Quarter, TemplateMessage
)
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

class AdminDashboardCountry(APIView):

    permission_classes = [IsAdmin]
    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'type', openapi.IN_QUERY, 
            type=openapi.TYPE_STRING, 
            required=True,
            enum=['Filed', 'Registered','status']
        )],
    )
    
    def get(self,request):

        if request.query_params['type'] == 'Filed':
            with connection.cursor() as cursor:
                cursor.execute(
                    "WITH TEMP AS\
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
                    SELECT COUNTRY_ID,COUNTRY_NAME,PRODUCT_ID,PRODUCT_NAME, COUNT(*)\
                    FROM\
                    \
                    (SELECT COUNTRY_ID,COUNTRY_NAME, PRODUCT_ID, PRODUCT_NAME\
                    FROM ((((FILING_PLAN AS FP JOIN COUNTRY USING (COUNTRY_ID)) JOIN ACTIVE_PRODUCT USING (ACTIVE_PRODUCT_ID)) JOIN PARTNER USING (PARTNER_ID)) JOIN PRODUCT USING (PRODUCT_ID) JOIN TEMP USING (PARTNER_ID))\
                    WHERE FP.STATUS = 'Filed'\
                    GROUP BY COUNTRY_ID,COUNTRY_NAME,PARTNER_ID,PRODUCT_ID,PRODUCT_NAME) AS A\
                    \
                    GROUP BY COUNTRY_ID,COUNTRY_NAME,PRODUCT_ID,PRODUCT_NAME\
                    ORDER BY COUNTRY_NAME\
                    "
                )
                row = cursor.fetchall()

            temp = []
            for each in row:
                temp.append({
                    'country_id':each[0],
                    'country_name':each[1],
                    'product_id':each[2],
                    'product_name':each[3],
                    'no_of_partners':each[4]
                })

            return Response(data={"rows":temp},status=status.HTTP_200_OK)


        if request.query_params['type'] == 'Registered':
            with connection.cursor() as cursor:
                cursor.execute(
                    "WITH TEMP AS\
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
                    SELECT COUNTRY_ID,COUNTRY_NAME,PRODUCT_ID,PRODUCT_NAME, COUNT(*)\
                    FROM\
                    \
                    (SELECT COUNTRY_ID,COUNTRY_NAME, PRODUCT_ID, PRODUCT_NAME\
                    FROM ((((FILING_PLAN AS FP JOIN COUNTRY USING (COUNTRY_ID)) JOIN ACTIVE_PRODUCT USING (ACTIVE_PRODUCT_ID)) JOIN PARTNER USING (PARTNER_ID)) JOIN PRODUCT USING (PRODUCT_ID) JOIN TEMP USING (PARTNER_ID))\
                    WHERE FP.STATUS = 'Registered'\
                    GROUP BY COUNTRY_ID,COUNTRY_NAME,PARTNER_ID,PRODUCT_ID,PRODUCT_NAME) AS A\
                    \
                    GROUP BY COUNTRY_ID,COUNTRY_NAME,PRODUCT_ID,PRODUCT_NAME\
                    ORDER BY COUNTRY_NAME\
                    "
                )
                row = cursor.fetchall()

            temp = []
            for each in row:
                temp.append({
                    'country_id':each[0],
                    'country_name':each[1],
                    'product_id':each[2],
                    'product_name':each[3],
                    'no_of_partners':each[4]
                })

            return Response(data={"rows":temp},status=status.HTTP_200_OK)


        if request.query_params['type'] == 'status':
            countries = Country.objects.order_by('country_id')
            rows=[]
            allowed_statuses = []

            ongoing_quarter = OngoingQuarter.objects.all().first()
            if ongoing_quarter != None:
                curr_index = ongoing_quarter.index
                curr_year = ongoing_quarter.year

                temp = quarter_mapping[quarter_list[curr_index]] + "-" + str(curr_year)[-2:]
                allowed_statuses.append(temp)

                for i in range(3): # 3 Future quarters
                    if (curr_index+1)%4 == 0:
                        curr_index = 0
                        curr_year += 1
                    else:
                        curr_index += 1

                    temp = quarter_mapping[quarter_list[curr_index]] + "-" + str(curr_year)[-2:]
                    allowed_statuses.append(temp)
        
            for country in countries:
                country_id = country
                country_name = country.country_name
                q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]
                filing_plans = FilingPlan.objects.filter(country_id=country_id,status__in=allowed_statuses).annotate(partner_id=F('active_product_id__partner_id'),country_name=F('country_id__country_name'),product_id=F('active_product_id__product_id'),product_name=F('active_product_id__product_id__product_name')).values('country_name','product_id','product_name','status','partner_id')
                if filing_plans:
                    for filing_plan in filing_plans:
                        approved_partner = TemplateMessage.objects.filter(template_type='sales',partner_id=filing_plan['partner_id'],is_partner_message=False,quarter_id=q_1_quarter).last()
                        active_partner=Partner.objects.filter(is_active=True,partner_id=filing_plan['partner_id'])
                        if approved_partner != None and approved_partner.is_approved == True and active_partner.exists():
                            product_id=filing_plan['product_id']
                            product_name=filing_plan['product_name']
                            product_status=filing_plan['status']
                            rows.append({
                                'country_id':country_id.country_id,
                                'country_name':country_name,
                                'product_id':product_id,
                                'product_name':product_name,
                                'status':product_status
                            })
        
            return Response(data={"rows":rows},status=status.HTTP_200_OK) 

        
    '''
        if request.query_params['type'] == 'partner':
            countries = Country.objects.filter(is_active=True).order_by('country_id')
            rows=[]
            # print('here')
            allowed_statuses = ['Registered','Filed']
            for country in countries:
                country_id = country
                country_name = country.country_name
                filing_plans = FilingPlan.objects.filter(country_id=country_id,status__in=allowed_statuses).annotate(country_name=F('country_id__country_name'),product_id=F('active_product_id__product_id'),product_name=F('active_product_id__product_id__product_name')).values('country_name','product_id','product_name')
                if filing_plans:
                    # print(filing_plans)
                    # print(filing_plans.count())
                    for filing_plan in filing_plans:
                        product_id=filing_plan['product_id']
                        product_name=filing_plan['product_name']
                        no_of_partners=ActiveProduct.objects.filter(product_id=product_id,product_id__activeproduct__partner_id__is_active=True).values('product_id__activeproduct__partner_id__company_name').distinct().count()
                        rows.append({
                            'country_id':country_id.country_id,
                            'country_name':country_name,
                            'product_id':product_id,
                            'product_name':product_name,
                            'no_of_partners':no_of_partners
                        })

        if request.query_params['type'] == 'status':
            countries = Country.objects.filter(is_active=True).order_by('country_id')
            rows=[]
            allowed_statuses = []

            ongoing_quarter = OngoingQuarter.objects.all().first()
            if ongoing_quarter != None:
                curr_index = ongoing_quarter.index
                curr_year = ongoing_quarter.year

                temp = quarter_mapping[quarter_list[curr_index]] + "-" + str(curr_year)[-2:]
                allowed_statuses.append(temp)

                for i in range(3): # 3 Future quarters
                    if (curr_index+1)%4 == 0:
                        curr_index = 0
                        curr_year += 1
                    else:
                        curr_index += 1

                    temp = quarter_mapping[quarter_list[curr_index]] + "-" + str(curr_year)[-2:]
                    allowed_statuses.append(temp)
        
            for country in countries:
                country_id = country
                country_name = country.country_name
                filing_plans = FilingPlan.objects.filter(country_id=country_id,status__in=allowed_statuses).annotate(country_name=F('country_id__country_name'),product_id=F('active_product_id__product_id'),product_name=F('active_product_id__product_id__product_name')).values('country_name','product_id','product_name','status')
                if filing_plans:
                    for filing_plan in filing_plans:
                        product_id=filing_plan['product_id']
                        product_name=filing_plan['product_name']
                        product_status=filing_plan['status']
                        rows.append({
                            'country_id':country_id.country_id,
                            'country_name':country_name,
                            'product_id':product_id,
                            'product_name':product_name,
                            'status':product_status
                        })
        return Response(data={"rows":rows},status=status.HTTP_200_OK)
    '''


class AdminDashboardCountryPartnerDetail(APIView):

    permission_classes = [IsAdmin]
    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'product_id', openapi.IN_QUERY, 
            type=openapi.TYPE_INTEGER, 
            required=True
        )],
    )
    
    def get(self,request):
        product_id = request.query_params['product_id']
        partners=ActiveProduct.objects.filter(product_id=product_id,product_id__activeproduct__partner_id__is_active=True).annotate(
            company_id=F('product_id__activeproduct__partner_id'),
            company_name=F('product_id__activeproduct__partner_id__company_name')).values('company_id','company_name').distinct()
        return Response(data={"rows":partners},status=status.HTTP_200_OK)