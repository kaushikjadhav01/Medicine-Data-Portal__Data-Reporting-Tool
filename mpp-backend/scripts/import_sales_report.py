import csv, json
from api.models import ActiveProduct, SalesReport, Country, Partner, Product, Quarter, TemplateMessage

def run(path,sales_report_type):
    data = csv.DictReader(open(path,encoding='utf-8-sig'))
    # Get Stages
    stages_json = open("static/stages.json").read()
    stages_json = json.loads(stages_json)
    partner_ids=[]
    first_month_of_quarter = ['Dummy Month','January','April','July','October']
    quarter_months = ['Dummy Quarter','Jan-Mar','Apr-Jun','Jul-Sep','Oct-Dec']
    q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]

    if sales_report_type == 'FDF':
        for row in data:
            months_dict = {'Jul':'July', 'Apr':'April', 'Sep':'September', 'May':'May', 'Aug':'August', 'Jan':'January', 'Jun':'June', 'Dec':'December', 'Feb':'February', 'Nov':'November', 'Mar':'March', 'Oct':'October'}
            
            country_name=row['Country']
            year=row['Year']
            quarter_name=row['Quarter']
            # quarter_obj = None
            # if quarter_name != None and quarter_name != '':
            #     quarter_name = quarter_months[int(quarter_name[1])]+' '+year
            #     quarter_obj = Quarter.objects.filter(quarter_name=quarter_name)
            #     if quarter_obj.exists():
            #         quarter_obj = quarter_obj[0]
            #     else:
            #         quarter_obj = Quarter.objects.create(quarter_name=quarter_name,is_active=True,created_by=0,updated_by=0)
            
            month=row['Month']
            purchaser=row['Purchaser']
            strength=row['Strength']
            formulation_md=row['Formulation Type']
            pack_size=row['Pack Size']
            quantity=row['Quantity']
            currency=row['Currency']
            gross_sale_price_currency=row['Gross Sale Price (per pack)\n(Local Currency)']
            usd_exchange_rate=row['Applicable Currency Exchange Rate to USD']
            gross_sale_price_usd=row['Gross Sale Price (per pack)\n(USD)']
            total_gross_value=row['Total Gross Sales Value (= Quantity * Gross Sale Price) (USD)']
            deductable_expenses=row['Deductable Expenses \n(USD)']
            total_value=row['Total Net sales Value \n(= Total Gross Sales Value - Deductable Expenses) (USD)']
            royalty_percent=row['Royalty %']
            royalty_due=row['Royalty Due (USD)']
            procurement_end_country=row['Procurement Agency End-Country(ies)']
            comments=row['Comments']

            if year == '':
                year=None
            
            if month == '':
                if quarter_name != '' and quarter_name != None: 
                    month=first_month_of_quarter[int(quarter_name[1])]
                else:
                    month=None
            else:
                month = months_dict[month[:3].title()]

            if country_name == '':
                country=None
            else:
                country = Country.objects.filter(country_name = row['Country'])[0]    
            
            if pack_size == '':
                pack_size=None
            else:
                pack_size=float(pack_size)

            if quantity == '':
                quantity=0
            else:
                quantity=float(quantity)

            if currency == '':
                currency=None
            
            if gross_sale_price_currency == '':
                gross_sale_price_currency=None
            else:
                gross_sale_price_currency=float(gross_sale_price_currency)

            if usd_exchange_rate == '':
                usd_exchange_rate=None
            else:
                usd_exchange_rate=float(usd_exchange_rate)
            
            if gross_sale_price_usd == '':
                gross_sale_price_usd=None
            else:
                gross_sale_price_usd=float(gross_sale_price_usd)

            if total_gross_value == '':
                total_gross_value=None
            else:
                total_gross_value=float(total_gross_value)

            if deductable_expenses == '':
                deductable_expenses=None
            else:
                deductable_expenses=float(deductable_expenses)

            if total_value == '':
                total_value=0
            else:
                total_value=float(total_value)

            if royalty_percent == '':
                royalty_percent=None
            else:
                royalty_percent=float(royalty_percent)

            if royalty_due == '':
                royalty_due=None
            else:
                royalty_due=float(royalty_due)

            
            partner = Partner.objects.filter(company_name = row['Company'])
            product = Product.objects.filter(product_name = row['Product'])
            
            active_product = ActiveProduct.objects.filter(partner_id=partner[0],product_id=product[0])
            if not active_product.exists():
                active_product = ActiveProduct.objects.create(partner_id=partner[0],product_id=product[0],status='APPROVED',has_last_quarter=None,is_active=True,created_by=1,updated_by=1)
            
            partner_id = partner.values('partner_id')[0]['partner_id']
            if partner_id not in partner_ids:
                partner_ids.append(partner_id)
                
            sales_obj = SalesReport.objects.create(
                sales_report_type=sales_report_type,
                product_id=product[0],
                product_name=row['Product'],
                country_id=country,
                partner_id=partner[0],
                quarter_id_id=1,
                year=year,
                month=month,
                purchaser=purchaser,
                strength=strength,
                formulation_md=formulation_md,
                pack_size=pack_size,
                quantity=quantity,
                currency=currency,
                gross_sale_price_currency=gross_sale_price_currency,
                usd_exchange_rate=usd_exchange_rate,
                gross_sale_price_usd=gross_sale_price_usd,
                total_gross_value=total_gross_value,
                deductable_expenses=deductable_expenses,
                total_value=total_value,
                royalty_percent=royalty_percent,
                royalty_due=royalty_due,
                procurement_end_country=procurement_end_country,
                comments=comments,
                created_by=partner.values('partner_id')[0]['partner_id'],
                updated_by=partner.values('partner_id')[0]['partner_id']
                )
            # print(sales_obj)
            # print(row['Company'])
        for partner_id in partner_ids:
            TemplateMessage.objects.create(partner_id_id=partner_id,is_approved=True,message='Imported from Historical CSV',is_read=False,is_partner_message=False,
            updated_by=partner_id,created_by=partner_id,quarter_id_id=1,quarter_name='Historical Quarter',template_type='sales')

    elif sales_report_type == 'API':
        partner_ids=[]
        for row in data:
            months_dict = {'Jul':'July', 'Apr':'April', 'Sep':'September', 'May':'May', 'Aug':'August', 'Jan':'January', 'Jun':'June', 'Dec':'December', 'Feb':'February', 'Nov':'November', 'Mar':'March', 'Oct':'October'}
            
            country_name=row['Country']
            year=row['Year']
            quarter_name=row['Quarter']
            # quarter_obj = None
            # if quarter_name != None and quarter_name != '':
            #     quarter_name = quarter_months[int(quarter_name[1])]+' '+year
            #     quarter_obj = Quarter.objects.filter(quarter_name=quarter_name)
            #     if quarter_obj.exists():
            #         quarter_obj = quarter_obj[0]
            #     else:                    
            #         quarter_obj = Quarter.objects.create(quarter_name=quarter_name,is_active=True,created_by=0,updated_by=0)
            
            month=row['Month']
            purchaser=row['Purchaser']
            quantity=row['Quantity (kg)']
            total_value=row['Total Value (USD)']
            
            if year == '':
                year=None
            
            if month == '':
                if quarter_name != '' and quarter_name != None: 
                    month=first_month_of_quarter[int(quarter_name[1])]
                else:
                    month=None
            else:
                month = months_dict[month[:3].title()]
            
            if country_name == '':
                country=None
            else:
                country = Country.objects.filter(country_name = row['Country'])[0]    
            
            if quantity == '':
                quantity=0
            else:
                quantity=float(quantity)

            if total_value == '':
                total_value=0
            else:
                total_value=float(total_value)

            
            partner = Partner.objects.filter(company_name = row['Company'])
            product = Product.objects.filter(product_name = row['Name of API'])
            active_product = ActiveProduct.objects.filter(partner_id=partner[0],product_id=product[0])
            if not active_product.exists():
                active_product = ActiveProduct.objects.create(partner_id=partner[0],product_id=product[0],status='APPROVED',has_last_quarter=None,is_active=True,created_by=1,updated_by=1)
            

            partner_id = partner.values('partner_id')[0]['partner_id']
            if partner_id not in partner_ids:
                partner_ids.append(partner_id)
            
            SalesReport.objects.create(
                sales_report_type=sales_report_type,
                product_id=product[0],
                product_name=row['Name of API'],
                country_id=country,
                partner_id=partner[0],
                quarter_id_id=1,
                year=year,
                month=month,
                purchaser=purchaser,
                strength=None,
                formulation_md=None,
                pack_size=None,
                quantity=quantity,
                currency=None,
                gross_sale_price_currency=None,
                usd_exchange_rate=None,
                gross_sale_price_usd=None,
                total_gross_value=None,
                deductable_expenses=None,
                total_value=total_value,
                royalty_percent=None,
                royalty_due=None,
                procurement_end_country=None,
                comments=None,
                created_by=partner.values('partner_id')[0]['partner_id'],
                updated_by=partner.values('partner_id')[0]['partner_id']
                )
        
        for partner_id in partner_ids:
            TemplateMessage.objects.create(partner_id_id=partner_id,is_approved=True,message='Imported from Historical CSV',is_read=False,is_partner_message=False,
            updated_by=partner_id,created_by=partner_id,quarter_id_id=1,quarter_name='Historical Quarter',template_type='sales')    
    else:
        print('Invalid Sales Report Type')

