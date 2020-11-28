from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest
from api.models import (
    User,Partner,Product,ActiveProduct,Employee
)
from api.tests.unit_tests.initial_fixtures import *

@pytest.fixture
def make_products(db):

    product1 = mixer.blend(Product,is_active=True)
    product2 = mixer.blend(Product,is_active=True)
    product3 = mixer.blend(Product,is_active=True)
    product4 = mixer.blend(Product,is_active=True)
    
    return product1,product2,product3,product4


@pytest.fixture
def make_partner_with_products_employees(db,client,make_products):

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
                        "product_id": make_products[2].product_id,
                        "status": "PLANNED"
                    },
                    {
                        "product_id": make_products[3].product_id,
                        "status": "PLANNED"
                    }
                ],
                "employee": [
                    {
                        "employee_id": 0,
                        "first_name": "string",
                        "last_name": "string",
                        "contact_number": "string"
                    }
                ]
            }
        }, format='json'
    )

    client.credentials()

    assert response.status_code == status.HTTP_201_CREATED

    return make_products

def test_update_partner(client,make_partner_with_products_employees):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    partner_id = User.objects.get(email='a@example.com').id

    response = client.put('/api/admin/partner/' + str(partner_id) + '/', {
            "email": "a@example.com",
            "partner": {
                "company_name": "string",
                "contact_number": "string",
                "address": "string",
                "region": "string",
                "active_products": [
                    {
                        "product_id": make_partner_with_products_employees[0].product_id,
                        "status": "PLANNED"
                    },
                    {
                        "product_id": make_partner_with_products_employees[1].product_id,
                        "status": "PLANNED"
                    },
                    {
                        "product_id": make_partner_with_products_employees[3].product_id,
                        "status": "PLANNED"
                    }
                ],
                "employee": [
                ]
            }
        }, format='json'
    )

    client.credentials()

    check_list = [
        make_partner_with_products_employees[0].product_id,
        make_partner_with_products_employees[1].product_id,
        make_partner_with_products_employees[3].product_id
    ]

    for each in response.json()['partner']['active_products']:
        if each['product_id'] in check_list:
            assert True
        else:
            assert False

    assert response.status_code == status.HTTP_200_OK
