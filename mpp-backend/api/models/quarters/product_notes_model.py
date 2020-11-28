from django.db import models
from rest_framework import serializers

class ProductNotes(models.Model):

    class Meta:
        db_table = "product_notes"

    product_notes_id = models.AutoField(primary_key=True)
    active_product_id = models.ForeignKey("api.ActiveProduct",on_delete=models.CASCADE,db_column='active_product_id')
    stage_id = models.ForeignKey("api.Stage",on_delete=models.CASCADE,db_column='stage_id')
    description = models.TextField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)

class ProductNotesSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductNotes
        fields = ('product_notes_id','active_product_id','stage_id','description')
    
    def create(self,validated_data):
        
        curr_user = self.context['request'].user.id
        
        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        product_notes = ProductNotes(**validated_data)
        product_notes.save()

        return product_notes

    def update(self,instance,validated_data):
        
        curr_user = self.context['request'].user.id
        
        instance.active_product_id = validated_data.get('active_product_id', instance.active_product_id)
        instance.stage_id = validated_data.get('stage_id', instance.stage_id)
        instance.description = validated_data.get('description', instance.description)
        instance.updated_by = curr_user

        instance.save()

        return instance
    