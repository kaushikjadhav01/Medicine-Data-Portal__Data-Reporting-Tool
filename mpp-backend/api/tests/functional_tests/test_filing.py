from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest

from api.models import (
    Product,Country,ActiveProduct
)
from api.tests.unit_tests.initial_fixtures import *

@pytest.fixture
def make_products(db):

    product1 = mixer.blend(Product,is_active=True)
    product2 = mixer.blend(Product,is_active=True)
    product3 = mixer.blend(Product,is_active=True)
    
    return product1,product2,product3

@pytest.fixture
def make_countries(db):

    country1 = mixer.blend(Country,is_active=True)
    country2 = mixer.blend(Country,is_active=True)
    country3 = mixer.blend(Country,is_active=True)

    return country1,country2,country3

@pytest.fixture
def make_partner_with_products_case1(db,client,make_products):

    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/admin/partner/', {
            "email": "a@example.com",
            "partner": {
                "company_name": "string",
                "contact_number": "string",
                "address": "string",
                "region": "string",
                "active_products": [
                    {
                        "product_id": make_products[0].product_id,
                        "status": "PLANNED"
                    },
                    {
                        "product_id": make_products[1].product_id,
                        "status": "APPROVED"
                    },
                    {
                        "product_id": make_products[2].product_id,
                        "status": "UNDER_DEVELOPMENT"
                    }
                ],
                "employee": [
                ]
            }
        }, format='json'
    )

    client.credentials()

    assert response.status_code == status.HTTP_201_CREATED

    return make_products


def test_filing(client,make_partner_with_products_case1,make_countries):

    partner = User.objects.get(email="a@example.com")

    #Get filing Plans
    access = AccessToken.for_user(partner)
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))
    response = client.get('/api/template/filing/')

    assert response.status_code == status.HTTP_200_OK

    #Post filing Plan Data
    response = client.post('/api/template/filing/', {
        make_countries[0].country_id:{
            make_partner_with_products_case1[0].product_id:"Registered",
            make_partner_with_products_case1[1].product_id:"Filed",
            make_partner_with_products_case1[2].product_id:"0",
        }
    }, format='json')

    assert response.status_code == status.HTTP_200_OK

    #Get filing Plans
    response = client.get('/api/template/filing/')
    assert response.status_code == status.HTTP_200_OK

    # rows = response.json().get('rows')
    # for each in rows:
    #     if each['country_id'] == make_countries[0].country_id:
    #         assert len(each) == 4
    
    #Change status of Products such that none appear in filing plans
    active_product1 = ActiveProduct.objects.get(partner_id=partner.id,product_id=make_partner_with_products_case1[1].product_id)
    active_product1.status = 'DROPPED'
    active_product1.save()

    active_product2 = ActiveProduct.objects.get(partner_id=partner.id,product_id=make_partner_with_products_case1[2].product_id)
    active_product2.status = 'ON_HOLD'
    active_product2.save()

    #Get filing Plans
    response = client.get('/api/template/filing/')
    assert response.status_code == status.HTTP_200_OK

    rows = response.json().get('rows')
    for each in rows:
        if each['country_id'] == make_countries[0].country_id:
            assert len(each) == 2

    client.credentials()