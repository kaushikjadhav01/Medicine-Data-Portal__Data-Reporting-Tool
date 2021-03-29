import pytest

from mixer.backend.django import mixer
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken
from MPP_API.settings import quarter_list
from api.models import (
    User,Quarter
)

#For Accessing Endpoints
@pytest.fixture(scope='module')
def api_client():
    return APIClient()

#First Admin User in system
@pytest.fixture
def admin_user(db):
    obj = User()
    obj.set_password('samplepass')

    return mixer.blend(User,
        email='admin@mpp.com',
        password=obj.password,
        is_active=True,
        role='ADMIN',
        is_staff=True
    )

#Adds three quarters in the system
@pytest.fixture
def add_init_quarters(api_client,admin_user):

    access = AccessToken.for_user(User.objects.get(email='admin@mpp.com'))
    api_client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(access))

    for i in range(2):
        api_client.post('/api/clock/')
    
    api_client.credentials()
    
    return

#Adds three quarters in the system
@pytest.fixture
def client(api_client,add_init_quarters):
    return api_client