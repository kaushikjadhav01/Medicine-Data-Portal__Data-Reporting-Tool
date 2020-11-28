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
def make_product(db):

    product = mixer.blend(Product,is_active=True)
    return product

def test_update_product(client,make_product):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.put('/api/admin/product/' + str(make_product.product_id) + '/', {
        "product_name":"new_string",
        "category":make_product.category,
        "therapy_area":"string"
    }, format='json')

    client.credentials()

    assert response.json()['product_name'] == 'new_string'
    assert response.json()['category'] == make_product.category

    assert response.status_code == status.HTTP_200_OK
