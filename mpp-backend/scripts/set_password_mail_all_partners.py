from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags
from api.models import (
    User
)
import os
from django.template.defaultfilters import date
from api.models.password_email_token import ResetPasswordRequestToken
import requests, re
from django_rest_passwordreset.models import ResetPasswordToken

to_email_ids = User.objects.filter(is_active=True).values_list('email',flat=True)
email_subject = str('Set password on MPP Data Portal')
from_email_id = os.getenv('FROM_EMAIL_ID')
from_email_address = re.search('<(.*)>', from_email_id).group(1)

for email in to_email_ids:
    
    
    obj = ResetPasswordRequestToken()
    user = User.objects.filter(email=email)
    if user[0].role != 'ADMIN' and user[0].role != 'STAFF':
        print('Email ID: ',email)
        request=''
        token = ResetPasswordToken.objects.create(
                    user=user[0],
                    user_agent='',
                    ip_address='',
                ).key
        partner_name = user.values('partner__company_name')[0]['partner__company_name']
        print('Company Name: ',partner_name)
        print('Token: ',token)
        api_link = os.getenv('API_LINK')
        link = str(api_link+'set-password/'+token)
        to_email_id = [email]
        

        html_message = render_to_string('password_email.html', {'partner_name': partner_name.capitalize(),'token':token,'api_link':api_link})
        plain_message = strip_tags(html_message)
    
        send_mail(email_subject, plain_message, from_email_id, to_email_id, html_message=html_message)
print('Set Password Email Sent to All Partners Successfully!')