from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.helpers.custom_permissions import IsAdmin

from django.db import connection
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.db.models import F, Count
from MPP_API.settings import quarter_list,quarter_mapping
from api.models import (
    ActiveProduct,Product,OngoingQuarter, FilingPlan
)

class AdminDashboardProductCompany(APIView):

    permission_classes = [IsAdmin]
    
    @swagger_auto_schema(
        operation_summary="Product-Wise Count",
        operation_description="Count of how many companies are currently \
            (developing,dropped,on_hold,filed,approved) this product",
    )
    def get(self,request):

        send_data = []

        with connection.cursor() as cursor:
            cursor.execute(
                "WITH TEMP AS\
                (SELECT PARTNER_ID\
                FROM PARTNER\
                WHERE IS_ACTIVE = TRUE\
                )\
                SELECT PRODUCT_ID, PRODUCT_NAME, STATUS, coalesce(COUNT,0) AS COUNT\
                FROM\
                \
                (SELECT PRODUCT_ID, PRODUCT_NAME, STATUS, COUNT(*)\
                FROM (ACTIVE_PRODUCT AS AP JOIN TEMP USING (PARTNER_ID)) JOIN PRODUCT USING (PRODUCT_ID)\
                WHERE AP.IS_ACTIVE = TRUE AND AP.STATUS IN ('UNDER_DEVELOPMENT','DROPPED','ON_HOLD','FILED','APPROVED')\
                GROUP BY PRODUCT_ID, PRODUCT_NAME, STATUS) AS A\
                \
                NATURAL FULL OUTER JOIN\
                \
                (SELECT PRODUCT_ID,PRODUCT_NAME FROM PRODUCT) AS B\
                ORDER BY PRODUCT_ID\
                "
            )
            row = cursor.fetchall()

        temp = {}
        for each in row:
            product_id = each[0]
            product_name = each[1]
            p_status = each[2]
            count = each[3]

            if temp.get(product_id,False) == False:
                temp[product_id] = {
                    "product_name":product_name,
                    "UNDER_DEVELOPMENT":0,
                    "DROPPED":0,
                    "ON_HOLD":0,
                    "FILED":0,
                    "APPROVED":0
                }

            if p_status != None:
                temp[product_id][p_status] = count


        for product_id,statuses in temp.items():
            send_data.append({
                "product_id":product_id,
                "product_name":statuses["product_name"],
                "UNDER_DEVELOPMENT":statuses["UNDER_DEVELOPMENT"],
                "DROPPED":statuses["DROPPED"],
                "ON_HOLD":statuses["ON_HOLD"],
                "FILED":statuses["FILED"],
                "APPROVED":statuses["APPROVED"]
            })

            
        if len(send_data) < 1:
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        return Response(data=send_data,status=status.HTTP_200_OK)


class AdminDashboardProductCompanyDetail(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'product_id', openapi.IN_QUERY, 
            type=openapi.TYPE_INTEGER, 
            required=True, 
        )],

        operation_summary="Product-Wise Count Detail",
        operation_description="Shows which companies are currently \
            (developing,dropped,on_hold,filed,approved) this product\
            against a given product_id",
        
    )

    def get(self,request):

        send_data = []

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT PARTNER_ID,COMPANY_NAME,PRODUCT_ID,PRODUCT_NAME,STATUS\
                FROM (ACTIVE_PRODUCT AS AP JOIN PRODUCT USING (PRODUCT_ID)) JOIN PARTNER USING (PARTNER_ID)\
                WHERE AP.IS_ACTIVE = TRUE AND PRODUCT_ID = %s AND AP.STATUS IN ('UNDER_DEVELOPMENT','DROPPED','ON_HOLD','FILED','APPROVED')", [request.query_params['product_id']]
            )
            row = cursor.fetchall()

        for each in row:
            partner_id = each[0]
            company_name = each[1]
            product_id = each[2]
            product_name = each[3]
            p_status = each[4]

            send_data.append({
                "partner_id":partner_id,
                "company_name":company_name,
                "product_id":product_id,
                "product_name":product_name,
                "status":p_status,
            })

        if len(send_data) < 1:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(data=send_data,status=status.HTTP_200_OK)


class AdminDashboardProductCountry(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'status', openapi.IN_QUERY, 
            type=openapi.TYPE_STRING, 
            required=True,
            enum=['Filed', 'Registered', 'Filing-Planned']
        )],
        
        operation_summary="Product-Wise count of countries",
        operation_description="Shows Count of Countries in which the product status is \
            registered/filed or Filing-Planned depending upon the query parameter",
    )
    
    def get(self,request):

        send_data = []

        if request.query_params['status'] != None:
            send_data = FilingPlan.objects.filter(status=request.query_params['status']).annotate(product_id=F('active_product_id__product_id'),product_name=F('active_product_id__product_id__product_name')).values('product_id','product_name').annotate(count=Count('product_name')).order_by('product_name')

        else:
            send_data = FilingPlan.objects.filter(status='Filed').annotate(product_id=F('active_product_id__product_id'),product_name=F('active_product_id__product_id__product_name')).values('product_id','product_name').annotate(count=Count('product_name')).order_by('product_name')
            
        if len(send_data) < 1:
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        return Response(data=send_data,status=status.HTTP_200_OK)


class AdminDashboardProductCountryDetail(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'product_id', openapi.IN_QUERY, 
            type=openapi.TYPE_STRING, 
            required=True, 
        ),
        openapi.Parameter(
            'status', openapi.IN_QUERY, 
            type=openapi.TYPE_STRING, 
            required=True,
            enum=['Filed/Registered', 'Filing-Planned']
        )
        ],
        
        operation_summary="Product-Wise count of countries Detail",
        operation_description="Shows Name of Countries in which the product status is \
            registered/filed or Filing-Planned depending upon the query parameter against a \
            given product_id",
    )
    
    def get(self,request):

        send_data = []

        if request.query_params['status'] == 'Filed/Registered':
            query = "SELECT DISTINCT(COUNTRY_NAME), COUNTRY_ID\
                FROM ((ACTIVE_PRODUCT JOIN PRODUCT USING (PRODUCT_ID)) JOIN FILING_PLAN AS FP USING (ACTIVE_PRODUCT_ID)) JOIN COUNTRY USING (COUNTRY_ID)\
                WHERE (FP.STATUS = 'Filed' OR FP.STATUS = 'Registered') AND PRODUCT_ID = %s "


        elif request.query_params['status'] == 'Filing-Planned':
            query = "SELECT DISTINCT(COUNTRY_NAME), COUNTRY_ID\
                FROM ((ACTIVE_PRODUCT JOIN PRODUCT USING (PRODUCT_ID)) JOIN FILING_PLAN AS FP USING (ACTIVE_PRODUCT_ID)) JOIN COUNTRY USING (COUNTRY_ID)\
                WHERE FP.STATUS = 'Filing-Planned' AND PRODUCT_ID = %s "


        with connection.cursor() as cursor:
            cursor.execute(
                query, [request.query_params['product_id']]
            )
            row = cursor.fetchall()

        for each in row:
            country_name = each[0]
            country_id = each[1]
            send_data.append({
                "country_id":country_id,
                "country_name":country_name
            })

        if len(send_data) < 1:
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        return Response(data=send_data,status=status.HTTP_200_OK)


class AdminDashboardProductCountryQuarter(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(
        operation_summary="Product-Wise count of countries",
        operation_description="Shows Count of Countries in which the product is \
            expected to be filed in Qno-year,...",
    )
    def get(self,request):

        send_data = []
        future_quarters = []

        ongoing_quarter = OngoingQuarter.objects.all().first()
        if ongoing_quarter != None:
            curr_index = ongoing_quarter.index
            curr_year = ongoing_quarter.year

            temp = quarter_mapping[quarter_list[curr_index]] + "-" + str(curr_year)[-2:]
            future_quarters.append(temp)

            for i in range(3): # 3 Future quarters
                if (curr_index+1)%4 == 0:
                    curr_index = 0
                    curr_year += 1
                else:
                    curr_index += 1

                temp = quarter_mapping[quarter_list[curr_index]] + "-" + str(curr_year)[-2:]
                future_quarters.append(temp)

        
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
                WHERE TEMPLATE_TYPE = 'filing plan' AND IS_PARTNER_MESSAGE = 'FALSE'\
                ORDER BY PARTNER_ID,TEMPLATE_MESSAGE_ID DESC) AS R\
                \
                WHERE IS_APPROVED = 'TRUE') AS T\
                \
                JOIN PARTNER USING (PARTNER_ID)\
                WHERE IS_ACTIVE = TRUE\
                )\
                \
                SELECT PRODUCT_ID, PRODUCT_NAME, A.STATUS, coalesce(COUNT,0)\
                FROM\
                \
                (SELECT PRODUCT_ID, PRODUCT_NAME, FP.STATUS, COUNT(DISTINCT(COUNTRY_ID))\
                FROM ((ACTIVE_PRODUCT JOIN TEMP USING (PARTNER_ID)) JOIN PRODUCT USING (PRODUCT_ID)) JOIN FILING_PLAN AS FP USING (ACTIVE_PRODUCT_ID)\
                WHERE FP.STATUS in %s \
                GROUP BY PRODUCT_ID, PRODUCT_NAME, FP.STATUS) AS A\
                \
                NATURAL FULL OUTER JOIN\
                \
                (SELECT PRODUCT_ID, PRODUCT_NAME FROM PRODUCT) AS B\
                ORDER BY PRODUCT_ID\
                ", [tuple(future_quarters)]
            )
            row = cursor.fetchall()

        temp = {}
        for each in row:
            product_id = each[0]
            product_name = each[1]
            fp_status = each[2]
            count = each[3]

            if temp.get(product_id,False) == False:
                temp[product_id] = {
                    "product_name":product_name,
                    future_quarters[0]:0,
                    future_quarters[1]:0,
                    future_quarters[2]:0,
                    future_quarters[3]:0,
                }

            if fp_status != None:
                temp[product_id][fp_status] = count


        for product_id,statuses in temp.items():
            send_data.append({
                "product_id":product_id,
                "product_name":statuses["product_name"],
                future_quarters[0]:statuses[future_quarters[0]],
                future_quarters[1]:statuses[future_quarters[1]],
                future_quarters[2]:statuses[future_quarters[2]],
                future_quarters[3]:statuses[future_quarters[3]],
            })

            
        if len(send_data) < 1:
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        return Response(data={"rows":send_data,"quarter_list":future_quarters},status=status.HTTP_200_OK)



class AdminDashboardProductCountryQuarterDetail(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'product_id', openapi.IN_QUERY, 
            type=openapi.TYPE_INTEGER, 
            required=True, 
        )],
        
        operation_summary="Product-Wise count of countries Detail",
        operation_description="Shows Name of Countries in which the product is \
            expected to be filed in Qn-year against a \
            given product_id",
    )

    def get(self,request):

        send_data = []

        future_quarters = []

        ongoing_quarter = OngoingQuarter.objects.all().first()
        if ongoing_quarter != None:
            curr_index = ongoing_quarter.index
            curr_year = ongoing_quarter.year

            temp = quarter_mapping[quarter_list[curr_index]] + "-" + str(curr_year)[-2:]
            future_quarters.append(temp)

            for i in range(3): # 3 Future quarters
                if (curr_index+1)%4 == 0:
                    curr_index = 0
                    curr_year += 1
                else:
                    curr_index += 1

                temp = quarter_mapping[quarter_list[curr_index]] + "-" + str(curr_year)[-2:]
                future_quarters.append(temp)

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT DISTINCT COUNTRY_ID, COUNTRY_NAME, PRODUCT_ID, PRODUCT_NAME, FP.STATUS\
                FROM ((ACTIVE_PRODUCT JOIN PRODUCT USING (PRODUCT_ID)) JOIN FILING_PLAN AS FP USING (ACTIVE_PRODUCT_ID)) JOIN COUNTRY USING (COUNTRY_ID)\
                WHERE PRODUCT_ID = %s AND FP.STATUS in %s", [request.query_params['product_id'], tuple(future_quarters)]
            )
            row = cursor.fetchall()

        for each in row:
            country_id = each[0]
            country_name = each[1]
            product_id = each[2]
            product_name = each[3]
            fp_status = each[4]

            send_data.append({
                "country_id":country_id,
                "country_name":country_name,
                "product_id":product_id,
                "product_name":product_name,
                "status":fp_status,
            })

        if len(send_data) < 1:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(data=send_data,status=status.HTTP_200_OK)