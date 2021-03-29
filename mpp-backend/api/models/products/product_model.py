from django.db import models
from rest_framework import serializers
from api.models.products.stage_model import Stage,StageSerializer
from api.models.custom_exception import MyCustomException
import json, os

# Parsing json file as dictionary
stages_json = open("static/stages.json").read()
stages_json = json.loads(stages_json)

# Extract keys for category choices from stages_json dictionary
CATEGORY_CHOICES = []
for key in stages_json.keys():
    CATEGORY_CHOICES.append((key,key))

class Product(models.Model):

    class Meta:
        db_table = "product"

    product_id = models.AutoField(primary_key=True,db_index=True)
    product_name = models.CharField(max_length=50)
    category = models.CharField(max_length=50,choices=CATEGORY_CHOICES)
    therapy_area = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ('product_id','product_name','category','therapy_area')

    def is_valid(self, raise_exception=False):
        try:
            return super(ProductSerializer, self).is_valid(raise_exception)
        except serializers.ValidationError as e:
            e = e.detail

            arr = []
            obj = e.get('product_name',False)
            temp = obj.pop() if obj else None
            arr.append(str(temp))

            obj = e.get('category',False)
            temp = "Not a Valid Choice" if obj else None
            arr.append(str(temp))

            obj = e.get('therapy_area',False)
            temp = obj.pop() if obj else None
            arr.append(str(temp))

            raise MyCustomException(detail={"error":arr})
    
    def create(self,validated_data):
        
        curr_user = self.context['request'].user.id
        
        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        product = Product(**validated_data)
        product.save()

        # Create Stage object for product by matching key in stages_json
        Stage.objects.bulk_create([Stage(product_id=product,description=description,created_by=curr_user,updated_by=curr_user) for description in stages_json[validated_data['category']]])
        return product


    def update(self,instance,validated_data):
        
        curr_user = self.context['request'].user.id
        
        instance.product_name = validated_data.get('product_name', instance.product_name)
        instance.category = validated_data.get('category', instance.category)
        instance.therapy_area = validated_data.get('therapy_area', instance.therapy_area)
        instance.updated_by = curr_user

        instance.save()

        return instance