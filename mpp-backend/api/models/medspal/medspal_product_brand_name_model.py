from django.db import models
from rest_framework import serializers
from django.contrib.postgres.fields import ArrayField, JSONField

class MedspalProductBrandName(models.Model):

    class Meta:
        db_table = "medspal_product_brand_name"
    
    product_brand_name_id = models.AutoField(primary_key=True)
    record_id = models.ForeignKey("api.MedspalRecords",on_delete=models.CASCADE,db_column='record_id',null=True)
    product_brand_name = models.CharField(max_length=500,null=True)
    