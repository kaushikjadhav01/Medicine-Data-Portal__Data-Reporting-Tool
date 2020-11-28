from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags
from api.models import (
    User
)
from .password_email_token import ResetPasswordRequestToken
import os
from MPP_API.settings import FROM_EMAIL_ID

def send_password_email(partner_name,email,password,request):

    obj = ResetPasswordRequestToken()
    token = obj.generate_token({'email':email},request)
    api_link = os.getenv('API_LINK')
    from_email_id = FROM_EMAIL_ID
    to_email_id = [email]
    email_subject = str('Set password on MPP Data Portal')
    html_message = render_to_string('password_email.html', {'partner_name': partner_name.capitalize(),'token':token.key,'api_link':api_link})
    plain_message = strip_tags(html_message)
    
    send_mail(email_subject, plain_message, from_email_id, to_email_id, html_message=html_message)