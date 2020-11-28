from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest
from api.models import (
    Product
)
from api.tests.unit_tests.initial_fixtures import *

@pytest.fixture
def make_products(db):

    product1 = mixer.blend(Product,is_active=True)
    product2 = mixer.blend(Product,is_active=True)
    product3 = mixer.blend(Product,is_active=True)
    
    return product1,product2,product3


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


@pytest.fixture
def make_partner_with_products_case2(db,client,make_products):

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
                ],
                "employee": [
                ]
            }
        }, format='json'
    )

    client.credentials()

    assert response.status_code == status.HTTP_201_CREATED


def test_pdt_get_with_data(client,make_partner_with_products_case1):
    
    access = AccessToken.for_user(User.objects.get(email="a@example.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/template/pdt/')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK


def test_pdt_get_without_data(client,make_partner_with_products_case2):
    
    access = AccessToken.for_user(User.objects.get(email="a@example.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/template/pdt/')

    client.credentials()
    
    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_pdt_get_with_data_admin(client,make_partner_with_products_case1):
    
    partner_id = User.objects.get(email="a@example.com").id

    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/template/pdt/' + str(partner_id) + '/')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK
