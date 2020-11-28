import csv, json
from api.models import Product, Stage

def run(path):
    data = csv.DictReader(open(path))

    # Get Stages
    stages_json = open("static/stages.json").read()
    stages_json = json.loads(stages_json)

    for row in data:
        product = Product.objects.create(product_name = row['Product Name'],
                                category=row['Category'],
                                therapy_area=row['Therapy'],)
        Stage.objects.bulk_create([Stage(product_id=product,description=description) for description in stages_json[row['Category']]])

