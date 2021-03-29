import csv, json
from api.models import ActiveProduct, SalesReport, Country, Partner, Product

def run():
    api_data=csv.DictReader(open('./scripts/Historical sales Jan API 0302.csv',encoding='utf-8-sig'))
    fdf_data=csv.DictReader(open('./scripts/Historical sales Jan FDF 0302.csv',encoding='utf-8-sig'))
    
    products = list(Product.objects.values_list('product_name',flat=True))
    partners = list(Partner.objects.values_list('company_name',flat=True))
    countries = list(Country.objects.values_list('country_name',flat=True))
    
    new_partners = []
    new_products = []
    new_countries = []
    new_months = []
    
    for row in api_data:
        # print('in row',row['Product'])
        if row['Name of API'] not in products:
            new_products.append(row['Name of API'])
        if row['Company'] not in partners:
            new_partners.append(row['Company'])
        if row['Country'] not in countries:
            new_countries.append(row['Country'])
        if row['Month'][:3] not in new_months:
            new_months.append(row['Month'][:3])
    
    for row in fdf_data:
        # print('in row',row['Product'])
        if row['Product'] not in products:
            new_products.append(row['Product'])
        if row['Company'] not in partners:
            new_partners.append(row['Company'])
        if row['Country'] not in countries:
            new_countries.append(row['Country'])
        if row['Month'][:3] not in new_months:
            new_months.append(row['Month'][:3])

    print('New Products')
    print(set(new_products))
    print('New Partners')
    print(set(new_partners))
    print('New Countries')
    print(set(new_countries))
    print('New Months')
    print(set(new_months))