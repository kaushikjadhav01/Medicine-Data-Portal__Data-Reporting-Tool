import csv, json
from api.models import Country

def run(path):
    data = csv.DictReader(open(path))
    
    for row in data:
        country = row['Country']
        Country.objects.create(country_name=country)