from django.db import models
from rest_framework import serializers
from django.contrib.postgres.fields import ArrayField, JSONField

class MedspalRecordsSummary(models.Model):

    class Meta:
        db_table = "medspal_records_summary"
    
    summary_id = models.AutoField(primary_key=True)
    updated_record_ids = ArrayField(models.CharField(max_length=100,null=True))
    unchanged_record_ids = ArrayField(models.CharField(max_length=100,null=True))
    newly_created_record_ids = ArrayField(models.CharField(max_length=100,null=True))
    summary_timestamp = models.DateTimeField(auto_now_add=True)
    