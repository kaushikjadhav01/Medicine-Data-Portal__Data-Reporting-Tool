from django.db import models
from rest_framework import serializers
from django import forms

class ProductQuarterDate(models.Model):

    class Meta:
        db_table = "product_quarter_date"

    product_quarter_date_id = models.AutoField(primary_key=True)
    product_quarter_id = models.ForeignKey("api.ProductQuarter",on_delete=models.CASCADE,db_column='product_quarter_id')
    stage_id = models.ForeignKey("api.Stage",on_delete=models.CASCADE,db_column='stage_id')
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)


class ProductQuarterDateSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductQuarterDate
        fields = ('product_quarter_date_id','product_quarter_id','stage_id','start_date','end_date')
    
    def create(self,validated_data):
        
        curr_user = self.context['request'].user.id
        
        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        product_quarter_date = ProductQuarterDate(**validated_data)
        product_quarter_date.save()

        return product_quarter_date

    def update(self,instance,validated_data):
        
        curr_user = self.context['request'].user.id
        
        instance.product_quarter_id = validated_data.get('product_quarter_id', instance.product_quarter_id)
        instance.stage_id = validated_data.get('stage_id', instance.stage_id)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.updated_by = curr_user

        instance.save()

        return instance