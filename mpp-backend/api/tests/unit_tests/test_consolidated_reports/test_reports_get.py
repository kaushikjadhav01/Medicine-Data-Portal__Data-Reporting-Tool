from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest

from api.models import (
    Product,Country
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


def test_pdt_report(client,make_partner_with_products_case1):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/report/pdt/',{"page_number":1,"page_size":10})

    client.credentials()

    assert response.status_code == status.HTTP_200_OK


def test_pdt_report_download(client,make_partner_with_products_case1):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/report/pdt/download/',{})

    client.credentials()

    assert response.status_code == status.HTTP_200_OK


def test_filing_report(client,make_partner_with_products_case1,make_countries):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/report/filing/',{"page_number":1,"page_size":10})

    client.credentials()

    assert response.status_code == status.HTTP_200_OK


def test_filing_report_download(client,make_partner_with_products_case1,make_countries):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/report/filing/download/',{})

    client.credentials()

    assert response.status_code == status.HTTP_200_OK

