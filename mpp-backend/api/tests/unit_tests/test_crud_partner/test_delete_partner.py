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

def test_delete_partner_id(client,make_partner):
    
    access = AccessToken.for_user(User.objects.get(email="admin@mpp.com"))
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    response = client.delete('/api/admin/partner/' + str(make_partner.id) + '/')

    client.credentials()

    assert response.status_code == status.HTTP_204_NO_CONTENT