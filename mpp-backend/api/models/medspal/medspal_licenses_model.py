from django.db import models
from rest_framework import serializers
from django.contrib.postgres.fields import ArrayField, JSONField

class MedspalLicenses(models.Model):

    class Meta:
        db_table = "medspal_licenses"
    
    license_id = models.AutoField(primary_key=True)
    record_id = models.ForeignKey("api.MedspalRecords",on_delete=models.CASCADE,db_column='record_id',null=True)
    uuid = models.CharField(max_length=100,null=True)
    country_uuid = models.CharField(max_length=100,null=True)
    type = models.CharField(max_length=100,null=True)
    covered = models.BooleanField(null=True)
    headline = models.CharField(max_length=500,null=True)
    url = models.CharField(max_length=500,null=True)
    