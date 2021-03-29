from django.db import models
from rest_framework import serializers
from django.contrib.postgres.fields import ArrayField, JSONField

class MedspalOriginator(models.Model):

    class Meta:
        db_table = "medspal_originator"
    
    originator_id = models.AutoField(primary_key=True)
    record_id = models.ForeignKey("api.MedspalRecords",on_delete=models.CASCADE,db_column='record_id',null=True)
    originator = models.CharField(max_length=500,null=True)
    