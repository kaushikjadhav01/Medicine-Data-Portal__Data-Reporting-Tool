from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers
from api.models.custom_exception import MyCustomException

class User(AbstractUser):

    ROLE_CHOICES = [
        ('ADMIN','ADMIN'),
        ('PARTNER','PARTNER'),
        ('STAFF','STAFF'),
    ]

    class Meta:
        db_table = "user"

    username = models.CharField(blank=True, null=True, max_length=50)
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(max_length=50,choices=ROLE_CHOICES,default="PARTNER")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']

    
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('email','password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self,validated_data):
        
        curr_user = self.context['request'].user.id
        
        password = validated_data.pop('password')

        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user


class UserSerializerOnlyPassword(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('password',)
        extra_kwargs = {'password': {'write_only': True}}

    def is_valid(self, raise_exception=False):
        try:
            return super(UserSerializerOnlyPassword, self).is_valid(raise_exception)
        except serializers.ValidationError as e:
            e = e.detail

            arr = []
            obj = e.get('password',False)
            temp = obj.pop() if obj else None
            arr.append(str(temp))

            raise MyCustomException(detail={"error":arr})


    def create(self,validated_data):
        
        curr_user = self.context['request'].user
        
        instance = curr_user
        instance.updated_by = curr_user.id
        instance.set_password(validated_data.get('password', instance.password))
        instance.save()

        return instance


       

