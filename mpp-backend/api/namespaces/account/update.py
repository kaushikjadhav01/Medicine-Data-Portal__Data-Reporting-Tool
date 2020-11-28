from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated

from api.models import User,UserSerializerOnlyPassword

class UpdateUserPasswordViewSet(viewsets.GenericViewSet,mixins.CreateModelMixin):

    permission_classes = [IsAuthenticated]

    serializer_class = UserSerializerOnlyPassword
    queryset = User.objects.all()