from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from api.models import (
    User,UserSerializer,
    Partner,PartnerSerializer,
    Quarter
)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super(MyTokenObtainPairSerializer, self).validate(attrs)
        
        data.update({'email': self.user.email})
        data.update({'role': self.user.role})

        if self.user.role == 'ADMIN' or self.user.role == 'STAFF':
            data.update({'username': self.user.username})

        if self.user.role == 'PARTNER':
            partner_obj = Partner.objects.get(partner_id=self.user)
            partner = PartnerSerializer(partner_obj)

            data.update({'username': partner.data['company_name']})
            data.update({'partner': partner.data})


        q_1_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')
        data.update({'curr_quarter':q_1_quarter[1].quarter_name})

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
        
