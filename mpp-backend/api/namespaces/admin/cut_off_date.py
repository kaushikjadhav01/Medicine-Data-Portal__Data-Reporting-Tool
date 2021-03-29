from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from api.helpers.custom_permissions import IsAdmin
from api.models import (
    Partner,PartnerSerializer,
    Product,ActiveProduct,Stage,
    Quarter,ProductQuarter,ProductQuarterDate,ProductNotes,
    TemplateMessage, TemplateMessageSerializer,
    User
)
from datetime import datetime
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.template.defaultfilters import date

request_body = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'date':openapi.Schema(type=openapi.TYPE_STRING)
    }
)


class CutOffDateView(APIView):

    permission_classes = [IsAdmin]

    def get(self,request):
        
        q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
        cut_off_date = q_1_quarter.cut_off_date
        
        return Response(data={'cut_off_date':cut_off_date},status=status.HTTP_200_OK)


    @swagger_auto_schema(request_body=request_body)
    def post(self,request):
        data = request.data
        cut_off_date = datetime.strptime(data['date'],'%d-%m-%Y')
        q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
        q_1_quarter.cut_off_date=cut_off_date
        q_1_quarter.save()
        return Response(data={'Cut Off Date Set Successfully.'},status=status.HTTP_200_OK)