from django.db import models
from django.conf import settings
from rest_framework import serializers

class Partner(models.Model):

    class Meta:
        db_table = "partner"
    
    partner_id = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,primary_key=True,db_column='partner_id',db_index=True)

    company_name = models.CharField(max_length=50)
    contact_number = models.CharField(max_length=50)
    address = models.TextField(max_length=500,null=True)
    region = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)


class PartnerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Partner
        fields = ('partner_id','company_name','contact_number','address','region')
        
    def create(self,validated_data):

        curr_user = self.context['request'].user.id

        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        partner = Partner(**validated_data)
        partner.save()

        return partner
