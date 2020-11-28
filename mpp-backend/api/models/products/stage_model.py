from django.db import models
from rest_framework import serializers

class Stage(models.Model):

    class Meta:
        db_table = "stage"

    stage_id = models.AutoField(primary_key=True)
    product_id = models.ForeignKey("api.Product",on_delete=models.CASCADE, db_column='product_id')
    description = models.TextField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)


class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = ('stage_id','product_id','description')

    def create(self,validated_data):
        
        curr_user = self.context['request'].user.id
        
        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        stage = Stage(**validated_data)
        stage.save()

        return stage

    def update(self,instance,validated_data):
        
        curr_user = self.context['request'].user.id
        
        instance.product_id = validated_data.get('product_id', instance.product_id)
        instance.description = validated_data.get('description', instance.description)
        instance.updated_by = curr_user

        instance.save()

        return instance
