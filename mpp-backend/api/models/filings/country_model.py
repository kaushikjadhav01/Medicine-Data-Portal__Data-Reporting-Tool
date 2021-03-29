from django.db import models
from rest_framework import serializers

class Country(models.Model):

    class Meta:
        db_table = "country"

    country_id = models.AutoField(primary_key=True,db_index=True)
    country_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('country_id','country_name')

    def create(self,validated_data):
        
        curr_user = self.context['request'].user.id
        
        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        country = Country(**validated_data)
        country.save()

        return country

    def update(self,instance,validated_data):
        
        curr_user = self.context['request'].user.id
        
        instance.country_name = validated_data.get('country_name', instance.country_name)
        instance.updated_by = curr_user

        instance.save()

        return instance
