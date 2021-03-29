import csv
from api.models import Product
from django.db.models import F

products = Product.objects.values()

column_names = list(products[0].keys())
with open('MPP_Prod_Product_data.csv', 'w', newline='')  as output_file:
    dict_writer = csv.DictWriter(output_file, column_names)
    dict_writer.writeheader()
    dict_writer.writerows(products)