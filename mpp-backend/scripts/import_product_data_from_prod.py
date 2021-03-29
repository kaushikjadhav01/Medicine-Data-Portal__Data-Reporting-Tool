import csv, json
from api.models import Product, Stage

def run(path):
    data = csv.DictReader(open(path))

    # Get Stages
    stages_json = open("static/stages.json").read()
    stages_json = json.loads(stages_json)

    for row in data:
        product_already_exists = Product.objects.filter(product_name=row['product_name'])
        if not product_already_exists.exists():
            print(row['product_name'])
            product = Product.objects.create(product_name = row['product_name'],
                                    category=row['category'],
                                    therapy_area=row['therapy_area'],)
            Stage.objects.bulk_create([Stage(product_id=product,description=description) for description in stages_json[row['category']]])

