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




def test_sales_get_with_both_data(client,make_partner_api_data,make_partner_fdf_data):
    
    access = AccessToken.for_user(User.objects.get(email="a@example.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/template/sales/api')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK

def test_sales_get_with_api_data_only(client,make_partner_api_data):
    
    access = AccessToken.for_user(User.objects.get(email="a@example.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/template/sales/api')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK

def test_sales_get_with_fdf_data_only(client,make_partner_fdf_data):
    
    access = AccessToken.for_user(User.objects.get(email="a@example.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/template/sales/api')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK

def test_sales_get_with_no_data(client,make_partner):
    
    access = AccessToken.for_user(User.objects.get(email="a@example.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/template/sales/api')

    client.credentials()

    assert response.status_code == status.HTTP_204_NO_CONTENT