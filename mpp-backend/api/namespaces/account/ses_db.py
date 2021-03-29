from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.helpers.custom_permissions import IsAdmin
from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags
from api.models import (
    SESModel
)
from django.http import HttpResponse
import os, json
from django.template.defaultfilters import date
from api.models.password_email_token import ResetPasswordRequestToken
import requests

class SESDBView(APIView):

    message_type_header = 'HTTP_X_AMZ_SNS_MESSAGE_TYPE'

    def post(self, request):
        
        if self.message_type_header in request.META:
            payload = json.loads(request.body.decode('utf-8'))

            message_type = request.META[self.message_type_header]
            if message_type == 'SubscriptionConfirmation':
                subscribe_url = payload.get('SubscribeURL')
                print('subscribe_url',subscribe_url)
                res = requests.get(subscribe_url)
                print('res',res)
            else:
                # The actual body is in the 'Message' key of the
                # notification, which in turn is also a json encoded
                # string. Which needs to be parsed as json before
                # actually being useful.
                sns_message_id = payload.get('MessageId') 
                message = json.loads(payload.get('Message'))
                ses_email_type = message.get('notificationType')
                timestamp = message['mail']['timestamp']
                source = message['mail']['source'] 
                destination = message['mail']['destination'][0] 
                ses_message_id = message['mail']['messageId'] 
                subject = message['mail']['headers'][3]['value']
                SESModel.objects.create(
                    sns_message_id=sns_message_id,
                    ses_message_id=ses_message_id,
                    ses_email_type=ses_email_type,
                    source=source,
                    destination=destination,
                    timestamp=timestamp,
                    subject=subject,
                    payload=payload
                ) 

                

                return self.handle_sns_message(message)
        
        return HttpResponse('OK')

    def handle_sns_message(self, message):
        return HttpResponse('OK')