from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.helpers.custom_permissions import IsAdmin

from django.db import connection
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from api.models import (
    ActiveProduct
)

class AdminDashboardProject(APIView):

    permission_classes = [IsAdmin]
    
    @swagger_auto_schema(
        operation_summary="Project-Wise Count",
        operation_description="Number of projects (every distinct \
            count of company and product is a unique project)\
            against status- under-development, filed, approved, on-hold, dropped",
    )
    def get(self,request):

        p_status_all = ['UNDER_DEVELOPMENT','FILED','APPROVED','ON_HOLD','DROPPED']
        send_data = []

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
                SELECT STATUS, COUNT(ACTIVE_PRODUCT_ID)\
                FROM ACTIVE_PRODUCT AS AP JOIN TEMP USING (PARTNER_ID)\
                WHERE AP.IS_ACTIVE = TRUE AND AP.STATUS IN ('UNDER_DEVELOPMENT','FILED','APPROVED','ON_HOLD','DROPPED')\
                GROUP BY STATUS"
            )
            row = cursor.fetchall()
            
        for each in row:
            p_status = each[0]
            count = each[1]

            if p_status in p_status_all:
                p_status_all.remove(p_status) 

            send_data.append({
                "status":p_status,
                "count":count
            })

        for remaining_status in p_status_all:
            send_data.append({
                "status":remaining_status,
                "count":0
            })
        
        if len(send_data) < 1:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(data=send_data,status=status.HTTP_200_OK)


class AdminDashboardProjectDetail(APIView):

    permission_classes = [IsAdmin]
    
    @swagger_auto_schema(manual_parameters=[
        openapi.Parameter(
            'status', openapi.IN_QUERY, 
            type=openapi.TYPE_STRING, 
            required=True, 
            enum=['UNDER_DEVELOPMENT','FILED','APPROVED','ON_HOLD','DROPPED'])],

        operation_summary="Project-Wise Count Detail",
        operation_description="Shows the partner and product details (unique project details) against \
            a given status",
    )

    def get(self,request):

        send_data = []

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT PARTNER_ID, COMPANY_NAME, PRODUCT_ID, PRODUCT_NAME, STATUS\
                FROM (ACTIVE_PRODUCT AS AP JOIN PRODUCT USING (PRODUCT_ID)) JOIN PARTNER USING (PARTNER_ID)\
                WHERE AP.IS_ACTIVE = TRUE AND AP.STATUS = %s;", [request.query_params['status']]
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
                "status":p_status
            })

        if len(send_data) < 1:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(data=send_data,status=status.HTTP_200_OK)