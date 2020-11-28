import csv, json
from api.models import ActiveProduct, SalesReport, Country, Partner

def run(path,sales_report_type):
    data = csv.DictReader(open(path,encoding='utf-8-sig'))
    # Get Stages
    stages_json = open("static/stages.json").read()
    stages_json = json.loads(stages_json)

    if sales_report_type == 'FDF':
        for row in data:
            country = Country.objects.filter(country_name = row['Country'])
            partner = Partner.objects.filter(company_name__iexact = row['Company'])
            active_product = ActiveProduct.objects.filter(partner_id=partner[0],product_id__product_name = row['Product'])

            SalesReport.objects.bulk_create([SalesReport(
                sales_report_type=sales_report_type,
                active_product_id=active_product[0],
                country_id=country[0],
                partner_id=partner[0],
                year=row['Year'],
                month=row['Month'],
                purchaser=row['Purchaser'],
                strength=row['Strength'],
                formulation_md=row['Formulation Type'],
                pack_size=row['Pack Size'],
                quantity=row['Quantity'],
                currency=row['Currency'],
                gross_sale_price_currency=row['Gross Sale Price (per pack)\n(Local Currency)'],
                usd_exchange_rate=row['Applicable Currency Exchange Rate to USD'],
                gross_sale_price_usd=row['Gross Sale Price (per pack)\n(USD)'],
                total_gross_value=row['Total Gross Sales Value (= Quantity * Gross Sale Price) (USD)'],
                deductable_expenses=row['Deductable Expenses \n(USD)'],
                total_value=row['Total Net sales Value \n(= Total Gross Sales Value - Deductable Expenses) (USD)'],
                royalty_percent=row['Royalty %'],
                royalty_due=row['Royalty Due (USD)'],
                procurement_end_country=row['Procurement Agency End-Country(ies)'],
                comments=row['Comments'],
                created_by=partner.values('partner_id')[0]['partner_id'],
                updated_by=partner.values('partner_id')[0]['partner_id']
                )])
    elif sales_report_type == 'API':
        for row in data:
            country = Country.objects.filter(country_name = row['Country'])
            partner = Partner.objects.filter(company_name__iexact = row['Company'])
            active_product = ActiveProduct.objects.filter(partner_id=partner[0],product_id__product_name = row['API Name'])

            SalesReport.objects.bulk_create([SalesReport(
                sales_report_type=sales_report_type,
                active_product_id=active_product[0],
                country_id=country[0],
                partner_id=partner[0],
                year=row['Year'],
                month=row['Month'],
                purchaser=row['Purchaser'],
                strength=None,
                formulation_md=None,
                pack_size=None,
                quantity=row['Quantity (kg)'],
                currency=None,
                gross_sale_price_currency=None,
                usd_exchange_rate=None,
                gross_sale_price_usd=None,
                total_gross_value=None,
                deductable_expenses=None,
                total_value=row['Total Value (USD)'],
                royalty_percent=None,
                royalty_due=None,
                procurement_end_country=None,
                comments=None,
                created_by=partner.values('partner_id')[0]['partner_id'],
                updated_by=partner.values('partner_id')[0]['partner_id']
                )])
    else:
        print('Invalid Sales Report Type')

