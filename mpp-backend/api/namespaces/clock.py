from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.helpers.custom_permissions import IsAdmin
from api.models import (
    Quarter,
    OngoingQuarter,
    ProductQuarter,
    ActiveProduct,
    User
)

from MPP_API.settings import quarter_list, INIT_QUARTER_INDEX, INIT_YEAR

import os
from django.utils.html import strip_tags
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail, EmailMultiAlternatives
from MPP_API.settings import FROM_EMAIL_ID

class Clock(APIView):
    
    permission_classes=[IsAdmin]

    def post(self,request):

        ongoing_quarter = OngoingQuarter.objects.all().first()
        
        if ongoing_quarter == None:
            ongoing_quarter = OngoingQuarter.objects.create(index=INIT_QUARTER_INDEX,year=INIT_YEAR)
        else:
            if (ongoing_quarter.index + 1)%4 == 0:
                ongoing_quarter.index = 0
                ongoing_quarter.year += 1
                ongoing_quarter.save()
            else:
                ongoing_quarter.index += 1
                ongoing_quarter.save()
        
        quarter_name = quarter_list[ongoing_quarter.index] + " " + str(ongoing_quarter.year)
        
        quarter = Quarter.objects.create(
            quarter_name=quarter_name,
            created_by=0,
            updated_by=0
        )
        
        active_products = ActiveProduct.objects.all()    
        for active_product in active_products:
            
            product_quarter = ProductQuarter.objects.create(
                active_product_id=active_product,
                quarter_id=quarter,
                created_by=0,
                updated_by=0
            )
        
        active_quarters = Quarter.objects.filter(is_active=True).order_by('quarter_id')
        if active_quarters.exists() and len(active_quarters) > 3:
            quarter = active_quarters[0]
            quarter.is_active = False
            quarter.save()
        

        api_link = os.getenv('API_LINK')
        link = str(api_link + 'partner/dashboard')
        email_subject = str('New Quarter has Started')
            
        html_message = render_to_string('new_quarter_mail.html', {'link':link})
        plain_message = strip_tags(html_message)

        to_email_list = []
        partners = User.objects.filter(is_active=True,role='PARTNER')
        for each in partners:
            to_email_list.append(each.email)

        msg = EmailMultiAlternatives(email_subject, plain_message, FROM_EMAIL_ID, bcc=to_email_list)
        msg.attach_alternative(html_message, "text/html")
        msg.send()

        return Response(status=status.HTTP_200_OK)
