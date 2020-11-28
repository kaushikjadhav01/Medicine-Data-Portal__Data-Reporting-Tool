from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
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

#Change users password
#---------------------------------------------------------------------------

def test_change_password(client,make_user):

    access = AccessToken.for_user(User.objects.get(email=make_user.email))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.post('/api/account/update_password/', {
        'password':'new_password'
        },
    )

    client.credentials()

    assert response.status_code == status.HTTP_201_CREATED

