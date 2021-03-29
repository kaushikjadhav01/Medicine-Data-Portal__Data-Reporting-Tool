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
def make_user(db):

    obj = User()
    obj.set_password('1234')
    user = mixer.blend(User,email='a@example.com',password=obj.password,
        is_active=True,is_staff=True,is_superuser=False)

    if user.role == 'PARTNER':
        partner = mixer.blend(Partner,partner_id=user,is_active=True)
    
    return user

#---------------------------------------------------------------------------

def test_reset_password_valid_email(client,make_user):
    
    response = client.post('/api/password_reset/', {
        'email': make_user.email,
        },
    )
    
    assert response.status_code == status.HTTP_200_OK


def test_reset_password_invalid_email(client,make_user):
    
    response = client.post('/api/password_reset/', {
        'email': 'invalid',
        },
    )
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST


