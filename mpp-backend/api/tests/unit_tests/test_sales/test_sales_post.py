from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest

from api.models import (
    Product, SalesReport, Country, User, Partner, Quarter
)
from api.tests.unit_tests.initial_fixtures import *

stages_json = open("static/stages.json").read()
stages_json = json.loads(stages_json)
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

def test_sales_api_post_partner(client,make_partner,make_partner_api_data):
    
    access = AccessToken.for_user(User.objects.get(email="a@example.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))
    product_id=mixer.blend(Product,is_active=True).product_id
    country_id=mixer.blend(Country,is_active=True).country_id
    partner_id=make_partner[1].partner_id_id
    quarter_id=mixer.blend(Quarter,is_active=True).quarter_id
    response = client.post('/api/template/sales/api', [{
    "year": 2020,
    "month": "January",
    "country_id": country_id,
    "product_id": product_id,
    "partner_id":partner_id,
    "quarter_id":quarter_id,
    "purchaser": "Cipla",
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
    }], format='json')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK


def test_sales_fdf_post_partner(client,make_partner,make_partner_fdf_data):
    
    access = AccessToken.for_user(User.objects.get(email="a@example.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))
    product_id=mixer.blend(Product,is_active=True).product_id
    country_id=mixer.blend(Country,is_active=True).country_id
    partner_id=make_partner[1].partner_id_id
    quarter_id=mixer.blend(Quarter,is_active=True).quarter_id
    response = client.post('/api/template/sales/fdf', [{
    "year": 2020,
    "month": "January",
    "country_id": country_id,
    "product_id": product_id,
    "partner_id":partner_id,
    "quarter_id":quarter_id,
    "purchaser": "Cipla",
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
    "procurement_end_country": None,
    "comments": None
    }], format='json')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK


def test_sales_api_post_admin(client,make_partner,make_partner_api_data):
    
    partner_id=make_partner[1].partner_id_id
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    product_id=mixer.blend(Product,is_active=True).product_id
    country_id=mixer.blend(Country,is_active=True).country_id
    quarter_id=mixer.blend(Quarter,is_active=True).quarter_id
    response = client.post('/api/template/sales/api/' + str(partner_id), [{
    "year": 2020,
    "month": "January",
    "country_id": country_id,
    "product_id": product_id,
    "partner_id":partner_id,
    "quarter_id":quarter_id,
    "purchaser": "Cipla",
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
    }], format='json')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK


def test_sales_fdf_post_admin(client,make_partner,make_partner_fdf_data):
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))
    product_id=mixer.blend(Product,is_active=True).product_id
    country_id=mixer.blend(Country,is_active=True).country_id
    partner_id=make_partner[1].partner_id_id
    quarter_id=mixer.blend(Quarter,is_active=True).quarter_id
    response = client.post('/api/template/sales/fdf/'+str(partner_id), [{
    "year": 2020,
    "month": "January",
    "country_id": country_id,
    "product_id": product_id,
    "partner_id":partner_id,
    "quarter_id":quarter_id,
    "purchaser": "Cipla",
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
    }], format='json')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK