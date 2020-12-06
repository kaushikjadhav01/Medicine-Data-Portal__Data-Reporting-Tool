from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.helpers.custom_permissions import IsAdmin

from django.db import connection
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from MPP_API.settings import quarter_list,quarter_mapping
from api.models import (
    ActiveProduct,Product
)

class AdminDashboardCompany(APIView):

    permission_classes = [IsAdmin]
    
    @swagger_auto_schema(
        operation_summary="Company-Wise Count",
        operation_description="Count of how many products are currently \
            (developing,dropped,on_hold,filed,approved) by the company",
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
                SELECT PARTNER_ID, COMPANY_NAME,STATUS,coalesce(COUNT,0)\
                FROM\
                \
                (SELECT *\
                FROM\
                \
                (SELECT PARTNER_ID, COMPANY_NAME, STATUS, COUNT(*)\
                FROM (PRODUCT JOIN ACTIVE_PRODUCT AS AP USING (PRODUCT_ID)) JOIN PARTNER USING (PARTNER_ID)\
                WHERE AP.IS_ACTIVE = TRUE  AND AP.STATUS in ('UNDER_DEVELOPMENT','DROPPED','ON_HOLD','FILED','APPROVED')\
                GROUP BY PARTNER_ID, COMPANY_NAME, STATUS) AS A\
                \
                JOIN TEMP USING (PARTNER_ID)) AS S\
                \
                NATURAL FULL OUTER JOIN\
                \
                (SELECT PARTNER_ID,COMPANY_NAME FROM PARTNER WHERE IS_ACTIVE = TRUE) AS B\
                ORDER BY PARTNER_ID\
                "
            )
            row = cursor.fetchall()

        temp = {}
        for each in row:
            partner_id = each[0]
            company_name = each[1]
            p_status = each[2]
            count = each[3]

            if temp.get(partner_id,False) == False:
                temp[partner_id] = {
                    "company_name":company_name,
                    "UNDER_DEVELOPMENT":0,
                    "DROPPED":0,
                    "ON_HOLD":0,
                    "FILED":0,
                    "APPROVED":0
                }

            if p_status != None:
                temp[partner_id][p_status] = count


        for partner_id,statuses in temp.items():
            send_data.append({
                "partner_id":partner_id,
                "company_name":statuses["company_name"],
                "UNDER_DEVELOPMENT":statuses["UNDER_DEVELOPMENT"],
                "DROPPED":statuses["DROPPED"],
                "ON_HOLD":statuses["ON_HOLD"],
                "FILED":statuses["FILED"],
                "APPROVED":statuses["APPROVED"]
            })

            
        if len(send_data) < 1:
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        return Response(data=send_data,status=status.HTTP_200_OK)



class AdminDashboardCompanyDetail(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'partner_id', openapi.IN_QUERY, 
            type=openapi.TYPE_INTEGER, 
            required=True, 
        )],
        
        operation_summary="Company-Wise Count Detail",
        operation_description="Shows which products are currently \
            (developing,dropped,on_hold,filed,approved)\
            against a given partner_id",
    )

    def get(self,request):

        send_data = []

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT PRODUCT_ID, PRODUCT_NAME, STATUS\
                FROM (PARTNER JOIN ACTIVE_PRODUCT AS AP USING (PARTNER_ID)) JOIN PRODUCT USING (PRODUCT_ID)\
                WHERE AP.IS_ACTIVE = TRUE AND PARTNER_ID = %s AND AP.STATUS IN ('UNDER_DEVELOPMENT','DROPPED','ON_HOLD','FILED','APPROVED')", [request.query_params['partner_id']]
            )
            row = cursor.fetchall()

        for each in row:
            product_id = each[0]
            product_name = each[1]
            p_status = each[2]
            
            send_data.append({
                "product_id":product_id,
                "product_name":product_name,
                "p_status":p_status
            })

        if len(send_data) < 1:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(data=send_data,status=status.HTTP_200_OK)
