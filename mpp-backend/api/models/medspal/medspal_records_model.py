from django.db import models
from rest_framework import serializers
from django.contrib.postgres.fields import ArrayField, JSONField

class MedspalRecords(models.Model):

    class Meta:
        db_table = "medspal_records"
    
    record_id = models.AutoField(primary_key=True)
    object_id = models.CharField(max_length=100)
    country_name = models.CharField(max_length=100,null=True)
    country_code = models.CharField(max_length=100,null=True)
    disease_areas = ArrayField(models.CharField(max_length=100,null=True))
    
    