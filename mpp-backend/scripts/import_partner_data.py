import csv, ast
from api.models import ActiveProduct, User, Product, Partner, Country
from django.db.models import F

def run(path):
    data = csv.DictReader(open(path,encoding='utf-8-sig'))
    for row in data:
        print(row['company_name'])
        user = User.objects.create(last_login=None,is_superuser=False,first_name='',last_name='',is_staff=False,is_active=True,date_joined=row['date_joined'],username=None,email=str('dev.'+row['email']),role='PARTNER',created_by=1,updated_by=1,created_at=row['created_at'],updated_at=row['updated_at'])
        user.set_password('samplepass12')
        user.save()
        partner = Partner.objects.create(partner_id_id=user.id,company_name=row['company_name'],contact_number=row['contact_number'],address=row['address'],region=row['region'],is_active=True,created_by=1,updated_by=1,created_at=row['created_at'],updated_at=row['updated_at'])
        active_product_dict = ast.literal_eval(row['active_products'])

        for key,value in active_product_dict.items():
            if key == 'ABC/3TC/DTG (adult)':
                key = 'ABC/3TC/DTG (Adult)'
            product_id = Product.objects.get(product_name=key).product_id
            ActiveProduct.objects.create(partner_id=partner,product_id_id=product_id,status=value,has_last_quarter=None,is_active=True,created_by=1,updated_by=1,created_at=row['created_at'],updated_at=row['updated_at'])

# Add Single Partner from shell
# from datetime import datetime
# timestamp = datetime.now()
# email='kaushik.jadhav@ajackus.com'
# password='samplepass12'
# company_name='Roche'
# contact_number='1234567890'
# address=None
# region='India'
# user = User.objects.create(last_login=None,is_superuser=False,first_name='',last_name='',is_staff=False,is_active=True,date_joined=timestamp,username=None,email=email,role='PARTNER',created_by=1,updated_by=1,created_at=timestamp,updated_at=timestamp)
# user.set_password(password)
# user.save()
# partner = Partner.objects.create(partner_id_id=user.id,company_name=company_name,contact_number=contact_number,address=address,region=region,is_active=True,created_by=1,updated_by=1,created_at=timestamp,updated_at=timestamp)

# Rename Product
# product = Product.objects.get(product_name='ABC/3TC/DTG (adult)') 
# product.product_name = 'ABC/3TC/DTG (Adult)'
# product.save()

# Add Countries
# countries = ['MSF', 'Pending', 'Curacao', 'SSA', 'Andorra', 'EU', 'Bermuda', 'Taiwan']
# for country in countries:
#     Country.objects.create(country_name=country)