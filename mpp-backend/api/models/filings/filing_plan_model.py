from django.db import models
from rest_framework import serializers

class FilingPlan(models.Model):

    class Meta:
        db_table = "filing_plan"

    filing_plan_id = models.AutoField(primary_key=True)
    active_product_id = models.ForeignKey("api.ActiveProduct",on_delete=models.CASCADE,db_column='active_product_id')
    country_id = models.ForeignKey("api.Country",on_delete=models.CASCADE,db_column='country_id')
    status = models.CharField(max_length=50,null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)


class FilingPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilingPlan
        fields = ('filing_plan_id','active_product_id','country_id','status')

    def create(self,validated_data):
        
        curr_user = self.context['request'].user.id
        
        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        filing_plan = FilingPlan(**validated_data)
        filing_plan.save()

        return filing_plan

    def update(self,instance,validated_data):
        
        curr_user = self.context['request'].user.id
        
        instance.active_product_id = validated_data.get('active_product_id', instance.active_product_id)
        instance.country_id = validated_data.get('country_id', instance.country_id)
        instance.status = validated_data.get('status', instance.status)
        instance.updated_by = curr_user

        instance.save()

        return instance
