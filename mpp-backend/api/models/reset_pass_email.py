from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags
import os
from api.models import Partner
from MPP_API.settings import FROM_EMAIL_ID

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    from_email_id = FROM_EMAIL_ID
    to_email_id = [reset_password_token.user.email]
    email_subject = str('Reset password on MPP Data Portal')
    api_link = os.getenv('API_LINK')
    
    if reset_password_token.user.role == 'ADMIN':
        partner_name = reset_password_token.user.username
        
    elif reset_password_token.user.role == 'PARTNER':
        partner_name = Partner.objects.get(partner_id=reset_password_token.user.id).company_name

    html_message = render_to_string('reset_password_email.html', {'partner_name': partner_name.capitalize(),'token':reset_password_token.key,'api_link':api_link})
    plain_message = strip_tags(html_message)    
    send_mail(email_subject, plain_message, from_email_id, to_email_id, html_message=html_message)

   