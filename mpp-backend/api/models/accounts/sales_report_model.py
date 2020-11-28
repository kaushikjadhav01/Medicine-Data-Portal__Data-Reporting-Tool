from django.db import models
from rest_framework import serializers

MONTH_CHOICES = [
('January','January'),
('February','February'),
('March','March'),
('April','April'),
('May','May'),
('June','June'),
('July','July'),
('August','August'),
('September','September'),
('October','October'),
('November','November'),
('December','December')
]

FORMULATION_CHOICES = [
('Tablet','Tablet'),
('Liquid','Liquid'),
('Granuels','Granuels'),
('Powder for Suspension','Powder for Suspension'),
('Add more','Add more')
]

class SalesReport(models.Model):
   

    class Meta:
        db_table = "sales_report"

    sales_report_id = models.AutoField(primary_key=True)
    sales_report_type = models.CharField(max_length=500)
    quarter_id = models.ForeignKey("api.Quarter",on_delete=models.CASCADE, db_column='quarter_id',null=True)
    partner_id = models.ForeignKey("api.Partner",on_delete=models.CASCADE, db_column='partner_id')
    year = models.IntegerField(null=True)
    month = models.CharField(max_length=500,choices=MONTH_CHOICES,null=True)
    active_product_id = models.ForeignKey("api.ActiveProduct",on_delete=models.CASCADE,db_column='active_product_id',null=True)
    product_id = models.ForeignKey("api.Product",on_delete=models.CASCADE,db_column='product_id',null=True)
    product_name = models.CharField(max_length=200,null=True)
    country_id = models.ForeignKey("api.Country",on_delete=models.CASCADE,db_column='country_id',null=True)
    purchaser = models.CharField(max_length=500,null=True)
    strength = models.CharField(max_length=500,null=True)
    formulation_md = models.CharField(max_length=500,choices=FORMULATION_CHOICES,null=True)
    pack_size = models.DecimalField(max_digits=50, decimal_places=20, null=True)
    quantity = models.DecimalField(max_digits=50, decimal_places=20, null=True)
    currency = models.CharField(max_length=500,null=True)
    gross_sale_price_currency = models.DecimalField(max_digits=50, decimal_places=20, null=True)
    usd_exchange_rate = models.DecimalField(max_digits=50, decimal_places=20, null=True)
    gross_sale_price_usd = models.DecimalField(max_digits=50, decimal_places=20, null=True)
    total_gross_value = models.DecimalField(max_digits=50, decimal_places=20, null=True)
    deductable_expenses = models.DecimalField(max_digits=50, decimal_places=20, null=True)
    total_value = models.DecimalField(max_digits=50, decimal_places=20,null=True)
    royalty_percent = models.DecimalField(max_digits=50, decimal_places=20, null=True)
    royalty_due = models.DecimalField(max_digits=50, decimal_places=20, null=True)
    procurement_end_country = models.CharField(max_length=500,null=True)
    comments = models.CharField(max_length=500,null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)


# class SalesReportSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SalesReport
#         fields = ('partner_id','month','country','product','purchaser','strength','formulation_md','pack_size','quantity','total_value','royalty_percent','royalty_due')

#     def create(self,validated_data):

#         curr_user = self.context['request'].user.id

#         validated_data['created_by'] = curr_user
#         validated_data['updated_by'] = curr_user
#         active_product = ActiveProduct(**validated_data)
#         active_product.save()

#         return active_product

#     def update(self,instance,validated_data):
        
#         curr_user = self.context['request'].user.id
        
#         instance.partner_id = validated_data.get('partner_id', instance.partner_id)
#         instance.product_id = validated_data.get('product_id', instance.product_id)
#         instance.updated_by = curr_user

#         instance.save()

#         return instance