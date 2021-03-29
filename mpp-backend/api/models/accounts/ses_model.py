from django.db import models
from rest_framework import serializers
from django.contrib.postgres.fields import JSONField

class SESModel(models.Model):

    class Meta:
        db_table = "ses_model"

    sns_message_id = models.CharField(max_length=500,primary_key=True)
    ses_message_id = models.CharField(max_length=500,null=True)
    ses_email_type = models.CharField(max_length=500,null=True)
    source = models.CharField(max_length=500,null=True)
    destination = models.CharField(max_length=500,null=True)
    timestamp = models.CharField(max_length=500, null=True)
    subject = models.CharField(max_length=500, null=True)
    payload = JSONField()