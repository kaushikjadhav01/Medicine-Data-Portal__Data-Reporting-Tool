from api.helpers.custom_permissions import IsAdmin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.utils.html import strip_tags
from django.template.loader import render_to_string, get_template
import os
from api.models import (
    User,Partner, Quarter
)
from api.tasks import send_bulk_email
from MPP_API.settings import FROM_EMAIL_ID
from datetime import datetime, tzinfo

request_body_reminder_mail = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'partner_id':openapi.Schema(type=openapi.TYPE_INTEGER),
        'template_type':openapi.Items(type=openapi.TYPE_STRING,enum=["PDT","Filing Plans", "Sales"])
    }
)

request_body_bulk_reminder_mail = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'data':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_OBJECT)),
    }
)

class ReminderMailView(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(request_body=request_body_reminder_mail)
    def post(self,request):
        
        template_type = request.data['template_type']
        if template_type != "PDT" and template_type != "Filing Plans" and template_type != "Sales":
            return Response(status=status.HTTP_400_BAD_REQUEST) 
        
        try:
            partner_id = request.data['partner_id']
            partner_name = Partner.objects.get(partner_id=partner_id).company_name
            partner_email = User.objects.get(pk=partner_id).email
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        api_link = os.getenv('API_LINK')
        template_url = None
        if template_type == "PDT":
            template_url = "development-timeline"
        elif template_type == "Filing Plans":
            template_url = "filing-plans"
        elif template_type == "Sales":
            template_url = "sales-report"


        q_1 = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]
        cut_off_date = q_1.cut_off_date
        tz_info = cut_off_date.tzinfo
        today= datetime.now(tz_info)
        no_of_days_to_submit = cut_off_date - today
        no_of_days_to_submit = no_of_days_to_submit.days + 1

        link = str(api_link + 'partner/' + template_url)

        email_subject = str('Reminder: Please submit your ' + template_type + ' report')
        
        html_message = render_to_string('partner_reminder.html', {'partner_name': partner_name.capitalize(),'template_type':template_type,'no_of_days_to_submit':no_of_days_to_submit,'link':link})
        plain_message = strip_tags(html_message)
        send_mail(email_subject, plain_message, FROM_EMAIL_ID, [partner_email], html_message=html_message)

        return Response(status=status.HTTP_200_OK)


class BulkReminderMailView(APIView):

    permission_classes = [IsAdmin]

    @swagger_auto_schema(request_body=request_body_bulk_reminder_mail)
    def post(self,request):
        
        data = request.data['data']

        t = send_bulk_email.delay(data)

        return Response(status=status.HTTP_200_OK)
        
