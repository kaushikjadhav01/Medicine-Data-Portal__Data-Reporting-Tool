from django.db import models
from rest_framework import serializers

class OngoingQuarter(models.Model):

    class Meta:
        db_table = "ongoing_quarter"

    ongoing_quarter_id = models.AutoField(primary_key=True)
    index = models.IntegerField()
    year = models.IntegerField()
   
   
   