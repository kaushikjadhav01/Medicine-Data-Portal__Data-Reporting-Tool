from django.db import models
from rest_framework import serializers

class ActiveProduct(models.Model):

    STATUS_CHOICES = [
        ('PLANNED','PLANNED'),
        ('UNDER_DEVELOPMENT','UNDER_DEVELOPMENT'),
        ('ON_HOLD','ON_HOLD'),
        ('DROPPED','DROPPED'),
        ('FILED','FILED'),
        ('APPROVED','APPROVED')
    ]

    class Meta:
        db_table = "active_product"

    active_product_id = models.AutoField(primary_key=True,db_index=True)
    partner_id = models.ForeignKey("api.Partner",on_delete=models.CASCADE, db_column='partner_id')
    product_id = models.ForeignKey("api.Product",on_delete=models.CASCADE, db_column='product_id')
    status = models.CharField(max_length=50,choices=STATUS_CHOICES)
    has_last_quarter = models.IntegerField(null=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)


class ActiveProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActiveProduct
        fields = ('active_product_id','partner_id','product_id')

    def create(self,validated_data):

        curr_user = self.context['request'].user.id

        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        active_product = ActiveProduct(**validated_data)
        active_product.save()

        return active_product

    def update(self,instance,validated_data):
        
        curr_user = self.context['request'].user.id
        
        instance.partner_id = validated_data.get('partner_id', instance.partner_id)
        instance.product_id = validated_data.get('product_id', instance.product_id)
        instance.updated_by = curr_user

        instance.save()

        return instance