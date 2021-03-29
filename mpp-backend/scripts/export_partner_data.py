import csv
from api.models import ActiveProduct, User, Product, Partner
from django.db.models import F

users = User.objects.filter(role='PARTNER').annotate(partner_id=F('partner'),company_name=F('partner__company_name'),contact_number=F('partner__contact_number'),address=F('partner__address'),region=F('partner__region')).values()

for user in users:
    product_dict={}
    active_products = ActiveProduct.objects.filter(partner_id = user['partner_id']).values('status','product_id__product_name')
    for active_product in active_products:
        product_dict[active_product['product_id__product_name']]=active_product['status'] 
        user['active_products']=product_dict

column_names = list(users[0].keys())
with open('MPP_Prod_Partner_data.csv', 'w', newline='')  as output_file:
    dict_writer = csv.DictWriter(output_file, column_names)
    dict_writer.writeheader()
    dict_writer.writerows(users)