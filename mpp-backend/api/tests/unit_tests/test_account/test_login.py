from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest

from api.models import (
    User,Partner
)
from api.tests.unit_tests.initial_fixtures import *

@pytest.fixture
def make_partner(db):

    obj = User()
    obj.set_password('1234')
    user = mixer.blend(User,email='a@example.com',password=obj.password,role='PARTNER',
        is_active=True,is_staff=True,is_superuser=False)
    partner = mixer.blend(Partner,partner_id=user,is_active=True)
    
    return user

#Checks invalid login
#---------------------------------------------------------------------------

def test_login_invalid(client):
    response = client.post('/api/login/', {
        'email': 'invalid@mpp.com',
        'password':'invalid'
        },
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


#Checks login of admin (First user in system)
#---------------------------------------------------------------------------

def test_admin_login_valid(client):
    response = client.post('/api/login/', {
        'email': 'admin@mpp.com',
        'password':'samplepass'
        },
    )
    
    assert response.json().get('access',False)
    assert response.status_code == status.HTTP_200_OK


def test_admin_login_invalid_email(client):
    response = client.post('/api/login/', {
        'email': 'invalid@mpp.com',
        'password':'samplepass'
        },
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_admin_login_invalid_password(client):
    response = client.post('/api/login/', {
        'email': 'admin@mpp.com',
        'password':'invalid_password'
        },
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


#Checks login of partner
#---------------------------------------------------------------------------

def test_partner_login_valid(client,make_partner):

    response = client.post('/api/login/', {
        'email': 'a@example.com',
        'password':'1234'
        },
    )
    
    assert response.json().get('access',False)
    assert response.json().get('partner',False)
    assert response.status_code == status.HTTP_200_OK

def test_partner_login_invalid_email(client,make_partner):

    response = client.post('/api/login/', {
        'email': 'invalid@example.com',
        'password':'1234'
        },
    )
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_partner_login_invalid_password(client,make_partner):

    response = client.post('/api/login/', {
        'email': 'a@example.com',
        'password':'invalid_password'
        },
    )
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

#---------------------------------------------------------------------------