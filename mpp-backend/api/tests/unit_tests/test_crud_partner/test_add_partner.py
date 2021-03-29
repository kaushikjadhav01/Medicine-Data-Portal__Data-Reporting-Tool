from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest

from api.models import (
    User,Partner
)
from api.tests.unit_tests.initial_fixtures import *

def test_add_partner_valid(client):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/admin/partner/', {
            "email": "user1@example.com",
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


def test_add_partner_invalid(client):

    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/admin/partner/', {
            "email": "user1@example.com",
            "partner": {
                "company_name": "string",
                "contact_number": "string",
                "address": "string",
                "region": "string",
            }
        }, format='json'
    )

    client.credentials()

    assert response.status_code == status.HTTP_400_BAD_REQUEST