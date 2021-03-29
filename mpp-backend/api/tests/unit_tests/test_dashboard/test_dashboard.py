from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest

from api.models import (
    Product,Country,SalesReport
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
                        "status": "UNDER_DEVELOPMENT"
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


def test_product_wise(client,make_partner_with_products_case1,make_countries):

    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/admin/dashboard/product/company/')
    assert response.status_code == status.HTTP_200_OK

    response = client.get('/api/admin/dashboard/product/country/?status=Filed')
    assert response.status_code == status.HTTP_204_NO_CONTENT
    response = client.get('/api/admin/dashboard/product/country/?status=Registered')
    assert response.status_code == status.HTTP_204_NO_CONTENT
    response = client.get('/api/admin/dashboard/product/country/?status=Filing-Planned')
    assert response.status_code == status.HTTP_204_NO_CONTENT

    response = client.get('/api/admin/dashboard/product/country/quarter/')
    assert response.status_code == status.HTTP_200_OK

    client.credentials()


def test_project_wise(client,make_partner_with_products_case1,make_countries):

    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/admin/dashboard/project/')
    
    client.credentials()
    assert response.status_code == status.HTTP_200_OK


def test_company_wise(client,make_partner_with_products_case1,make_countries):

    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/admin/dashboard/company/')

    client.credentials()
    assert response.status_code == status.HTTP_200_OK


def test_country_wise(client,make_partner_with_products_case1,make_countries):

    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/admin/dashboard/country/?type=Filed')
    assert response.status_code == status.HTTP_200_OK
    response = client.get('/api/admin/dashboard/country/?type=Registered')
    assert response.status_code == status.HTTP_200_OK
    response = client.get('/api/admin/dashboard/country/?type=status')
    assert response.status_code == status.HTTP_200_OK

    client.credentials()


def test_sales_wise(client,make_partner_with_products_case1,make_countries):

    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    sales = mixer.blend(SalesReport)

    map_with_list = ['product', 'company','country']
    to_list = ['product','company','country','period']

    for map_with in map_with_list:
        for to in to_list:

            if map_with != to:
                response = client.get('/api/admin/dashboard/sales/?map_with=' + map_with + '&for=' + to)
                assert response.status_code == status.HTTP_200_OK


    response = client.get('/api/admin/dashboard/sales/?map_with=price_per_pack&for=period')
    assert response.status_code == status.HTTP_200_OK

    response = client.get('/api/admin/dashboard/sales/?map_with=price_per_treatment&for=period')
    assert response.status_code == status.HTTP_200_OK

    client.credentials()

def test_summary_wise(client,make_partner_with_products_case1,make_countries):

    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/admin/dashboard/?type=all_three_submitted')
    assert response.status_code == status.HTTP_200_OK

    response = client.get('/api/admin/dashboard/?type=not_submitted')
    assert response.status_code == status.HTTP_200_OK

    #response = client.get('/api/admin/dashboard/?type=saved_but_not_submitted')
    #assert response.status_code == status.HTTP_200_OK

    #response = client.get('/api/admin/dashboard/?type=submitted_but_not_approved')
    #assert response.status_code == status.HTTP_200_OK

    client.credentials()



    