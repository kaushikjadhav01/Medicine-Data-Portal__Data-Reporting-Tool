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

request_body = openapi.Schema(
    type=openapi.TYPE_OBJECT, 
    properties={
        'email':openapi.Schema(type=openapi.TYPE_STRING)
    }
)
class TestDeleteUserView(APIView):

    @swagger_auto_schema(request_body=request_body)
    def post(self,request):
        data = request.data
        email = data['email']
        user = User.objects.filter(email=email)
        user.delete()
        return Response(status=status.HTTP_200_OK, data={'User Deleted!'})