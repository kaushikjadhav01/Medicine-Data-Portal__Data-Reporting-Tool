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

def test_get_product_present(client,make_product):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/admin/product/?recent=True')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK

def test_get_product_absent(client):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/admin/product/?recent=True')

    client.credentials()

    assert response.status_code == status.HTTP_204_NO_CONTENT

def test_get_product_id(client,make_product):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.get('/api/admin/product/' + str(make_product.product_id) + '/')

    client.credentials()

    assert response.status_code == status.HTTP_200_OK

