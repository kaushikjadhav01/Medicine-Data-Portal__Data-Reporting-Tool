from django.db import models
from rest_framework import serializers
from django.contrib.postgres.fields import ArrayField, JSONField

class MedspalApplications(models.Model):

    class Meta:
        db_table = "medspal_applications"
    
    application_id = models.AutoField(primary_key=True)
    record_id = models.ForeignKey("api.MedspalRecords",on_delete=models.CASCADE,db_column='record_id',null=True)
    uuid = models.CharField(max_length=100,null=True)
    country_uuid = models.CharField(max_length=100,null=True)
    simple_family_uuid = models.CharField(max_length=100,null=True)
    description = models.CharField(max_length=500,null=True)
    status = models.CharField(max_length=100,null=True)
    docdb_number = models.CharField(max_length=100,null=True)
    date = models.CharField(max_length=100,null=True)
    updated_at = models.CharField(max_length=100,null=True)
    expiration_date = models.CharField(max_length=100,null=True)
    publications = JSONField(blank=True, null=True)
    priorities = JSONField(blank=True, null=True)
    pct = JSONField(blank=True, null=True)
    pcts = JSONField(blank=True, null=True)

    