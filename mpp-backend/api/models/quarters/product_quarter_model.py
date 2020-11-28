from django.db import models
from rest_framework import serializers

class ProductQuarter(models.Model):

    class Meta:
        db_table = "product_quarter"

    product_quarter_id = models.AutoField(primary_key=True)
    active_product_id = models.ForeignKey("api.ActiveProduct",on_delete=models.CASCADE,db_column='active_product_id')
    quarter_id = models.ForeignKey("api.Quarter",on_delete=models.CASCADE, db_column='quarter_id')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)


class ProductQuarterSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductQuarter
        fields = ('product_quarter_id','active_product_id','quarter_id','status')
    
    def create(self,validated_data):
        
        curr_user = self.context['request'].user.id
        
        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        product_quarter = ProductQuarter(**validated_data)
        product_quarter.save()

        return product_quarter


    def update(self,instance,validated_data):
        
        curr_user = self.context['request'].user.id
        
        instance.active_product_id = validated_data.get('active_product_id', instance.active_product_id)
        instance.quarter_id = validated_data.get('quarter_id', instance.quarter_id)
        instance.status = validated_data.get('status', instance.status)
        instance.updated_by = curr_user

        instance.save()

        return instance