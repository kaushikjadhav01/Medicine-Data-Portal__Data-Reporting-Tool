from django.db import models
from rest_framework import serializers
from django.contrib.postgres.fields import ArrayField, JSONField

class MedspalExclusivityDuration(models.Model):

    class Meta:
        db_table = "medspal_exclusivity_duration"
    
    exclusivity_duration_id = models.AutoField(primary_key=True)
    record_id = models.ForeignKey("api.MedspalRecords",on_delete=models.CASCADE,db_column='record_id',null=True)
    exclusivity_duration = models.CharField(max_length=500,null=True)
    