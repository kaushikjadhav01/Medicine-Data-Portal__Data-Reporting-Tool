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
    User
)
import os
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.template.defaultfilters import date
from api.models.password_email_token import ResetPasswordRequestToken
import requests

request_body = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'email':openapi.Schema(type=openapi.TYPE_STRING),
        'password':openapi.Schema(type=openapi.TYPE_STRING)
    }
)
class TestSetPasswordView(APIView):

    @swagger_auto_schema(request_body=request_body)
    def post(self,request):
        data = request.data
        email = data['email']
        password = data['password']
        obj = ResetPasswordRequestToken()
        token = obj.generate_token({'email':email},request).key
        api_link = 'http://35.154.57.223:81/'
        link = str(api_link+'set-password/'+token)
        # req = requests.post(link, data = {password:password,token:token})
        # print(req.text)
        # user = User.objects.filter(email=email)
        # user[0].set_password(password)
        # user[0].save()
        return Response(status=status.HTTP_200_OK, data={link})