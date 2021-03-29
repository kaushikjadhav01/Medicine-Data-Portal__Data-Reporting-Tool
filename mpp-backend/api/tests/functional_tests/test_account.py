from django.test import TestCase
from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework import status
import json
import pytest

from api.models import (
    User,Partner
)
from api.tests.functional_tests.initial_fixtures import *

@pytest.fixture
def make_user(db):

    obj = User()
    obj.set_password('1234')
    user = mixer.blend(User,email='a@example.com',password=obj.password,
        is_active=True,is_staff=True,is_superuser=False)

    if user.role == 'PARTNER':
        partner = mixer.blend(Partner,partner_id=user,is_active=True)
    
    return user

#Checks valid refresh token
#---------------------------------------------------------------------------

def test_refresh_token_valid(client,make_user):
    
    response = client.post('/api/login/', {
        'email': 'a@example.com',
        'password':'1234'
        },
    )

    assert response.json().get('access',False)
    assert response.json().get('refresh',False)
    assert response.status_code == status.HTTP_200_OK

    refresh_token = response.json().get('refresh')

    response = client.post('/api/login/refresh/', {
        'refresh':refresh_token
        },
    )

    assert response.status_code == status.HTTP_200_OK

#Checks invalid refresh token
#---------------------------------------------------------------------------

def test_refresh_token_invalid(client,make_user):
    
    response = client.post('/api/login/', {
        'email': 'a@example.com',
        'password':'1234'
        },
    )

    assert response.json().get('access',False)
    assert response.json().get('refresh',False)
    assert response.status_code == status.HTTP_200_OK

    refresh_token = response.json().get('refresh')

    response = client.post('/api/login/refresh/', {
        'refresh':'invalid_token'
        },
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


#Checks change password functionality
#---------------------------------------------------------------------------

def test_change_password_functionality(client,make_user):

    response = client.post('/api/login/', {
        'email': 'a@example.com',
        'password':'1234'
        },
    )

    assert response.status_code == status.HTTP_200_OK

    access = response.json().get('access')
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/account/update_password/', {
        'password':'new_password'
        },
    )
    
    assert response.status_code == status.HTTP_201_CREATED

    client.credentials()

    response = client.post('/api/login/', {
        'email': 'a@example.com',
        'password':'new_password'
        },
    )

    assert response.status_code == status.HTTP_200_OK

    response = client.post('/api/login/', {
        'email': 'a@example.com',
        'password':'1234'
        },
    )
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


#---------------------------------------------------------------------------

