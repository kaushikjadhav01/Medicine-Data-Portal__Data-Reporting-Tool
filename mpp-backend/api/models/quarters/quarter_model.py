from django.db import models
from rest_framework import serializers

class Quarter(models.Model):

    class Meta:
        db_table = "quarter"

    quarter_id = models.AutoField(primary_key=True)
    quarter_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    cut_off_date = models.DateTimeField(null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)


class QuarterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Quarter
        fields = ('quarter_id','quarter_name')
    
    def create(self,validated_data):
        
        curr_user = self.context['request'].user.id

        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        quarter = Quarter(**validated_data)
        quarter.save()

        return quarter

    def update(self,instance,validated_data):
        
        curr_user = self.context['request'].user.id
        
        instance.quarter_name = validated_data.get('quarter_name', instance.quarter_name)
        instance.updated_by = curr_user

        instance.save()

        return instance