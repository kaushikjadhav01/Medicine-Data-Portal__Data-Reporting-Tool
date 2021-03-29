from django.db import models
from rest_framework import serializers

class ProductVerification(models.Model):

    class Meta:
        db_table = "product_verification"

    product_verification_id = models.AutoField(primary_key=True,db_index=True)
    partner_id = models.ForeignKey("api.Partner",on_delete=models.CASCADE, db_column='partner_id',null=True)
    product_name = models.TextField(max_length=200,blank=True)
    quarter_id = models.ForeignKey("api.Quarter",on_delete=models.CASCADE, db_column='quarter_id',null=True)
    is_approved = models.BooleanField(default=None,null=True)
    sales_report_type = models.CharField(max_length=500,null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)


# class TemplateMessageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TemplateMessage
#         fields = ('template_message_id','partner_id','message','quarter_id','quarter_name','is_approved','template_type','is_read','is_partner_message')
#         extra_kwargs = {'quarter_name': {'read_only': True},'quarter_id': {'read_only': True},'template_type': {'read_only': True},'is_read': {'read_only': True},'is_partner_message': {'read_only': True}}

#     def create(self,validated_data):
#         curr_user = self.context['request'].user.id
#         validated_data['created_by'] = curr_user
#         validated_data['updated_by'] = curr_user
#         template_message = TemplateMessage(**validated_data)
#         template_message.save()
#         return template_message

#     def update(self,instance,validated_data):
#         curr_user = self.context['request'].user.id
#         instance.updated_by = curr_user
#         instance.save()
#         return instance