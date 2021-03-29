from django.db import models
from rest_framework import serializers
from django.contrib.postgres.fields import ArrayField, JSONField

class MedspalExclusivityStartedOn(models.Model):

    class Meta:
        db_table = "medspal_exclusivity_started_on"
    
    exclusivity_started_on_id = models.AutoField(primary_key=True)
    record_id = models.ForeignKey("api.MedspalRecords",on_delete=models.CASCADE,db_column='record_id',null=True)
    exclusivity_started_on = models.CharField(max_length=500,null=True)
    