from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest

from api.models import (
    Product, SalesReport, Country, User, Partner, Quarter
)
from api.tests.unit_tests.initial_fixtures import *

@pytest.fixture
def make_partner(db):

    obj = User()
    obj.set_password('1234')
    user = mixer.blend(User,email='a@example.com',password=obj.password,
        is_active=True,is_staff=True,is_superuser=False,role='PARTNER')

    if user.role == 'PARTNER':
        partner = mixer.blend(Partner,partner_id=user,is_active=True)
        
    
    return user,partner

@pytest.fixture
def make_partner_api_data(db,make_partner):
    product_id=mixer.blend(Product,is_active=True)
    country_id=mixer.blend(Country,is_active=True)
    partner_id=make_partner[1]
    quarter_id=mixer.blend(Quarter,is_active=True)
    sales_report_api = SalesReport.objects.create(
        sales_report_type='API',
        year=2019,
        month="January",
        country_id= country_id,
        product_id= product_id,
        quarter_id=quarter_id,
        purchaser= "cipla",
        quantity= 900,
        product_name= product_id.product_name,
        partner_id = partner_id,
        total_value= 99900
      )
    return sales_report_api

@pytest.fixture
def make_partner_fdf_data(db,make_partner):
    product_id=mixer.blend(Product,is_active=True)
    country_id=mixer.blend(Country,is_active=True)
    partner_id=make_partner[1]
    quarter_id=mixer.blend(Quarter,is_active=True)
    
    sales_report_fdf = SalesReport.objects.create(
        sales_report_type='FDF',
        year= 2020,
        month= "January",
        country_id= country_id,
        product_id= product_id,
        quarter_id=quarter_id,
        purchaser= "Cipla",
        strength= "100",
        formulation_md= "Tablet",
        pack_size= 100,
        quantity= 100,
        currency= "INR",
        gross_sale_price_currency= 10000,
        usd_exchange_rate= 10,
        gross_sale_price_usd= 1000,
        total_gross_value= 100000,
        deductable_expenses= 100,
        total_value= 99900,
        royalty_percent= 2,
        royalty_due= 1,
        procurement_end_country= "agency",
        comments= "all okay",
        partner_id=partner_id,
        product_name= product_id.product_name
      )
    return sales_report_fdf


def test_sales(client,make_partner,make_partner_api_data,make_partner_fdf_data):

    partner = User.objects.get(email="a@example.com")

    # Login as PArtner
    access = AccessToken.for_user(partner)
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    #Get Sales Report for API
    response = client.get('/api/template/sales/api')
    row_len = len(response.json().get('rows'))
    assert response.status_code == status.HTTP_200_OK

    #Post Sales Report API Data
    product_id=mixer.blend(Product,is_active=True).product_id
    product_name_api=mixer.blend(Product,is_active=True).product_name
    country_id=mixer.blend(Country,is_active=True).country_id
    partner_id=partner.id
    quarter_id=mixer.blend(Quarter,is_active=True).quarter_id
    response = client.post('/api/template/sales/api', [{
    "year": 2020,
    "month": "January",
    "country_id": country_id,
    "product_id": product_id,
    "partner_id":partner_id,
    "quarter_id":quarter_id,
    "purchaser": "Cipla Updated",
    "strength": None,
    "formulation_md": None,
    "pack_size": None,
    "quantity": 100,
    "currency": None,
    "gross_sale_price_currency": None,
    "usd_exchange_rate": None,
    "gross_sale_price_usd": None,
    "total_gross_value": None,
    "deductable_expenses": None,
    "total_value": 1000,
    "royalty_percent": None,
    "royalty_due": None,
    "procurement_end_country": None,
    "comments": None
    },
    {
    "year": 2020,
    "month": "January",
    "partner_id":partner_id,
    "quarter_id":quarter_id,
    "purchaser": "Cipla",
    "quantity": 100,
    "total_value": 1000,
    "product_name":product_name_api
    }], format='json')

    assert response.status_code == status.HTTP_200_OK

    #Get Sales Report for FDF
    response = client.get('/api/template/sales/fdf')
    row_len = len(response.json().get('rows'))
    assert response.status_code == status.HTTP_200_OK 

    # POST Sales Report FDF Data
    response = client.post('/api/template/sales/fdf', [{
    "year": 2020,
    "month": "January",
    "country_id": country_id,
    "product_id": product_id,
    "partner_id":partner_id,
    "quarter_id":quarter_id,
    "purchaser": "Cipla Updated",
    "strength": "100/100 mg",
    "formulation_md": "Tablet",
    "pack_size": 100,
    "quantity": 100,
    "currency": "INR",
    "gross_sale_price_currency": 1000,
    "usd_exchange_rate": 71,
    "gross_sale_price_usd": 10000,
    "total_gross_value": 100010,
    "deductable_expenses": 10,
    "total_value": 1000,
    "royalty_percent": 10,
    "royalty_due": 2,
    "procurement_end_country": "India",
    "comments": "None"
    },
    {
    "partner_id":partner_id,
    "quarter_id":quarter_id,
    "product_name":"Custom Product FDF",
    "purchaser": "Cipla",
    "strength": "100/100 mg",
    "formulation_md": "Tablet",
    "pack_size": 100,
    "quantity": 100,
    "currency": "INR"
    }], format='json')

    assert response.status_code == status.HTTP_200_OK 
    
    # Clear Credentials, logout partner
    client.credentials()

    # Login as Admin
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    # Get Sales Report for API
    response = client.get('/api/template/sales/api/'+str(partner_id))
    row_len = len(response.json().get('rows'))
    purchaser = response.json().get('rows')[0]['purchaser']
    pending_product_count = response.json().get('pending_product_count')

    assert response.status_code == status.HTTP_200_OK
    assert row_len == 2
    assert purchaser == "Cipla Updated"
    assert pending_product_count == 2
    

    # Get Product Verification List
    response = client.get('/api/template/product_verification/'+str(partner_id))
    assert response.status_code == status.HTTP_200_OK
    pending_products = response.json().get('pending_products')
    assert pending_products[0]['product_name'] == product_name_api
    assert pending_products[1]['product_name'] == "Custom Product FDF"

    # Verify Products using POST
    product_verification_ids=[]
    for pending_product in pending_products:
        product_verification_ids.append(pending_product['product_verification_id'])

    response = client.post('/api/template/product_verification/'+str(partner_id),[
    {
    "product_verification_id":product_verification_ids[0],
    "is_approved": True,
    "product_name": product_name_api,
    "category": "API",
    "therapy_area": "HIV",
    "product_status": "UNDER_DEVELOPMENT"
    },
    {
    "product_verification_id":product_verification_ids[0],
    "is_approved": True,
    "product_name": "Custom Product FDF",
    "category": "FDF",
    "therapy_area": "HIV",
    "product_status": "UNDER_DEVELOPMENT"
    }], format='json')

    assert response.status_code == status.HTTP_200_OK

    # Check if products added to product list
    response = client.get('/api/admin/product/?recent=true')
    assert response.status_code == status.HTTP_200_OK
    products = response.json()
    assert products[0]['product_name'] == "Custom Product FDF"
    assert products[1]['product_name'] == product_name_api

    # Check if products assigned to partner
    response = client.get('/api/admin/partner/'+str(partner_id)+'/')
    active_products = response.json().get('partner')['active_products']
    assert active_products[0]['product_name'] == product_name_api
    assert active_products[1]['product_name'] == "Custom Product FDF"