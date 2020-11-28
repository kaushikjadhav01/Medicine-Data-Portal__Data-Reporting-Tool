from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest
from api.models import (
    Product,Stage
)
from api.tests.unit_tests.initial_fixtures import *

def test_add_product_valid_FDF(client):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/admin/product/', {
            "product_name":"string",
            "category":"FDF",
            "therapy_area":"string"
        }, format='json'
    )

    client.credentials()

    assert response.status_code == status.HTTP_201_CREATED
    assert len(Stage.objects.all()) == 12

def test_add_product_valid_API(client):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/admin/product/', {
            "product_name":"string",
            "category":"API",
            "therapy_area":"string"
        }, format='json'
    )

    client.credentials()

    assert response.status_code == status.HTTP_201_CREATED
    assert len(Stage.objects.all()) == 13


def test_add_product_invalid(client):

    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/admin/product/', {
            "product_name":"string",
            "category":"invalid",
            "therapy_area":"string"
        }, format='json'
    )

    client.credentials()

    assert response.status_code == status.HTTP_400_BAD_REQUEST