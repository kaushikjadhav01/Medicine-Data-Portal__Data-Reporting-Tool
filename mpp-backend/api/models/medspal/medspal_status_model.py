from django.db import models
from rest_framework import serializers
from django.contrib.postgres.fields import ArrayField, JSONField

class MedspalStatus(models.Model):

    class Meta:
        db_table = "medspal_status"
    
    status_id = models.AutoField(primary_key=True)
    record_id = models.ForeignKey("api.MedspalRecords",on_delete=models.CASCADE,db_column='record_id',null=True)
    application_id = models.ForeignKey("api.MedspalApplications",on_delete=models.CASCADE,db_column='application_id',null=True)
    license_id = models.ForeignKey("api.MedspalLicenses",on_delete=models.CASCADE,db_column='license_id',null=True)
    status = models.CharField(max_length=100,null=True)
    country_name = models.CharField(max_length=500,null=True)
    product_standardized_name = models.CharField(max_length=500,null=True)
    