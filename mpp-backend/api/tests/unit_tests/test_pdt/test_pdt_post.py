from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest
from api.models import (
    Product,Stage,Quarter
)
from api.tests.unit_tests.initial_fixtures import *

stages_json = open("static/stages.json").read()
stages_json = json.loads(stages_json)

@pytest.fixture
def make_products(db):

    product1 = mixer.blend(Product,is_active=True)
    Stage.objects.bulk_create([Stage(product_id=product1,description=description,created_by=1,updated_by=1) for description in stages_json[product1.category]])
    
    product2 = mixer.blend(Product,is_active=True)
    Stage.objects.bulk_create([Stage(product_id=product1,description=description,created_by=1,updated_by=1) for description in stages_json[product1.category]])

    product3 = mixer.blend(Product,is_active=True)
    Stage.objects.bulk_create([Stage(product_id=product1,description=description,created_by=1,updated_by=1) for description in stages_json[product1.category]])
    
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

    return make_products


def test_pdt_post(client,make_partner_with_products_case1):
    
    access = AccessToken.for_user(User.objects.get(email="a@example.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    product1_stage1 = Stage.objects.filter(product_id=make_partner_with_products_case1[0].product_id)[0]

    q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]

    response = client.post('/api/template/pdt/', {
        make_partner_with_products_case1[0].product_id:{
            product1_stage1.stage_id:{
                q_1_quarter.quarter_name:{
                    'start_date':'11/06/2020',
                    'end_date': None
                }
            },
            'notes':'some_notes',
            'product_status':'APPROVED'
        }
    }, format='json')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK


def test_pdt_post_admin(client,make_partner_with_products_case1):
    
    partner_id = User.objects.get(email='a@example.com').id

    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    product1_stage1 = Stage.objects.filter(product_id=make_partner_with_products_case1[0].product_id)[0]

    q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]

    response = client.post('/api/template/pdt/' + str(partner_id) + '/', {
        make_partner_with_products_case1[0].product_id:{
            product1_stage1.stage_id:{
                q_1_quarter.quarter_name:{
                    'start_date':'11/06/2020',
                    'end_date': None
                }
            },
            'notes':'some_notes',
            'product_status':'APPROVED'
        }
    }, format='json')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK