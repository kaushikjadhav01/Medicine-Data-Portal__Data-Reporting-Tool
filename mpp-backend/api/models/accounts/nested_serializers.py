from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response

from api.models.password_email import send_password_email
from api.models.custom_exception import MyCustomException

from api.models.accounts.user_model import User
from api.models.accounts.partner_model import Partner
from api.models.accounts.employee_model import Employee
from api.models.products.product_model import Product
from api.models.products.active_product_model import ActiveProduct,ActiveProductSerializer
from api.models.quarters.product_quarter_model import ProductQuarter
from api.models.quarters.quarter_model import Quarter

from django.conf import settings

class FilteredActiveProductListSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        data = data.filter(is_active=True)
        active_products = super(FilteredActiveProductListSerializer, self).to_representation(data)
        for active_product in active_products:
            active_product['product_name'] = Product.objects.get(
                product_id=active_product['product_id']).product_name
        return active_products
                
class ActiveProductCustomSerializer(serializers.ModelSerializer):
    class Meta:
        list_serializer_class = FilteredActiveProductListSerializer
        model = ActiveProduct
        fields = ('product_id','status')

class EmployeeNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('employee_id','partner_id','first_name','last_name','contact_number')
        extra_kwargs = {'employee_id': {'read_only': False},'partner_id': {'read_only': True}}
        
class PartnerNestedSerializer(serializers.ModelSerializer):

    active_products = ActiveProductCustomSerializer(source='activeproduct_set',many=True)
    employee = EmployeeNestedSerializer(source='employee_set',many=True)

    class Meta:
        model = Partner
        fields = ('partner_id','company_name','contact_number','address','region','active_products','employee')
        extra_kwargs = {'partner_id': {'read_only': True}}

    
class UserNestedSerializer(serializers.ModelSerializer):

    partner = PartnerNestedSerializer()

    class Meta:
        model = User
        fields = ('email','partner')
        extra_kwargs = {'password': {'write_only': True}}

    
    def is_valid(self, raise_exception=False):
        try:
            return super(UserNestedSerializer, self).is_valid(raise_exception)

        except serializers.ValidationError as e:
            e = e.detail
            arr = []

            if e.get('partner',False):

                obj = e.get('partner').get('company_name',False)
                temp = obj.pop() if obj else None
                arr.append(str(temp))

                temp = e.get('email').pop() if e.get('email',False) else None
                arr.append(str(temp))

                obj = e.get('partner').get('contact_number',False)
                temp = obj.pop() if obj else None
                arr.append(str(temp))

                obj = e.get('partner').get('address',False)
                temp = obj.pop() if obj else None
                arr.append(str(temp))

                obj = e.get('partner').get('region',False)
                temp = obj.pop() if obj else None
                arr.append(str(temp))

                obj = e.get('partner').get('active_products',False)
                temp = "Product Not found" if obj else None
                arr.append(str(temp))

                obj = e.get('partner').get('employee',False)
                temp = "Employee Not found" if obj else None
                arr.append(str(temp))

            else:
                arr.append(None)

                temp = e.get('email').pop() if e.get('email',False) else None
                arr.append(str(temp))

                for i in range(5):
                    arr.append(None)

            raise MyCustomException(detail={"error":arr})
    
        
    def create(self,validated_data):
        
        curr_user = self.context['request'].user.id
        
        partner_data = validated_data.pop('partner')
        partner_data['created_by'] = curr_user
        partner_data['updated_by'] = curr_user
        
        active_products = partner_data.pop('activeproduct_set')
        employee_data = partner_data.pop('employee_set')

        #Check if active product list has duplicate product ids
        duplicates = []
        for product in active_products:
            duplicates.append(product['product_id'].product_id)
        if len(duplicates) != len(set(duplicates)):
            raise MyCustomException(detail={"error":["Cannot assign duplicate products to Partner"]})
        
        password = User.objects.make_random_password()
        partner_name = self.context['request'].data['partner']['company_name']
        
        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        partner = Partner.objects.create(partner_id=user, **partner_data)
        send_password_email(partner_name,validated_data['email'],password,self.context['request'])
        
        for product in active_products:
            product['created_by'] = curr_user
            product['updated_by'] = curr_user
            active_product = ActiveProduct.objects.create(partner_id=partner,**product)
            
            product_status = active_product.status
            if product_status == 'APPROVED' or product_status == 'FILED' or product_status == 'DROPPED':
                active_product.has_last_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1].quarter_id
            active_product.save()

            #Assigning the q and q-1 quarter to the newly assigned products
            quarter_ids = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')
            product_quarter = ProductQuarter.objects.create(
                active_product_id=active_product,
                quarter_id=quarter_ids[0],
                created_by=curr_user,
                updated_by=curr_user
            )
            product_quarter = ProductQuarter.objects.create(
                active_product_id=active_product,
                quarter_id=quarter_ids[1],
                created_by=curr_user,
                updated_by=curr_user
            )

        for employee in employee_data:
            employee.pop('employee_id')
            employee['created_by'] = curr_user
            employee['updated_by'] = curr_user
            Employee.objects.create(partner_id=partner,**employee)
        
        return user


    def update(self,instance,validated_data):
        
        curr_user = self.context['request'].user.id

        partner_data = validated_data.pop('partner')
        partner = instance.partner

        #For Email Update
        old_email = instance.email
        new_email = validated_data.get('email')

        instance.email = validated_data.get('email', instance.email)
        instance.save()

        #For Partner Update
        partner.company_name = partner_data.get('company_name', partner.company_name)
        partner.contact_number = partner_data.get('contact_number', partner.contact_number)
        partner.address = partner_data.get('address', partner.address)
        partner.region = partner_data.get('region', partner.region)
        partner.updated_by = curr_user

        #For Active Products Update
        active_products = partner_data.get('activeproduct_set')

        #Check if active product list has duplicate product ids
        duplicates = []
        for product in active_products:
            duplicates.append(product['product_id'].product_id)
        if len(duplicates) != len(set(duplicates)):
            raise MyCustomException(detail={"error":["Cannot assign duplicate products to Partner"]})
        
        not_present = []
        not_present_status = {}

        present = []
        present_status = {}

        for product in active_products:
            obj = ActiveProduct.objects.filter(partner_id=partner,product_id=product['product_id']).first()
            if obj == None:
                not_present.append(product['product_id'])
                not_present_status[product['product_id']] = product['status'] 
            else:
                present.append(product['product_id'])
                present_status[product['product_id']] = product['status']

        temp = ActiveProduct.objects.filter(partner_id=partner)
        for each in temp:
            if each.product_id not in present:
                each.is_active = False
                each.save()
            else:
                old_product_status = each.status
                new_product_status = present_status[each.product_id]

                each.status = new_product_status
                each.is_active = True
                
                if old_product_status != 'APPROVED' and old_product_status != 'FILED' and old_product_status != 'DROPPED': #new_product_status:
                    if new_product_status == 'APPROVED' or new_product_status == 'FILED' or new_product_status == 'DROPPED':
                        each.has_last_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1].quarter_id
                    else:
                        each.has_last_quarter = None

                each.save()


        for each in not_present:
            product_status = not_present_status[each]
            active_product = ActiveProduct.objects.create(partner_id=partner,product_id=each,status=product_status,updated_by=curr_user,created_by=curr_user)

            if product_status == 'APPROVED' or product_status == 'FILED' or product_status == 'DROPPED':
                active_product.has_last_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1].quarter_id
            active_product.save()

            #Assigning the q and q-1 quarter to the newly assigned products
            quarter_ids = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index') 
            product_quarter = ProductQuarter.objects.create(
                active_product_id=active_product,
                quarter_id=quarter_ids[0],
                created_by=curr_user,
                updated_by=curr_user
            )
            product_quarter = ProductQuarter.objects.create(
                active_product_id=active_product,
                quarter_id=quarter_ids[1],
                created_by=curr_user,
                updated_by=curr_user
            )
    
        #For Employee Update
        updated_employee = partner_data.get('employee_set')
        temp = []
        for employee in updated_employee:
            employee_id = employee['employee_id']
            
            first_name = employee['first_name']
            last_name = employee['last_name']
            contact_number = employee['contact_number']
            
            if employee_id != 0:
                temp.append(employee_id)

                obj = Employee.objects.get(pk=employee_id)
                obj.first_name = first_name 
                obj.last_name = last_name
                obj.contact_number = contact_number
                obj.updated_by = curr_user
                obj.save()

            else:
                obj = Employee.objects.create(
                    partner_id=partner,
                    first_name=first_name,
                    last_name=last_name,
                    contact_number=contact_number,
                    created_by=curr_user,
                    updated_by=curr_user
                )
                temp.append(obj.employee_id)

        obj_set = Employee.objects.filter(partner_id=partner)
        for each in obj_set:
            if each.employee_id not in temp:
                each.delete()
        
        partner.save()

        if old_email != new_email:
            password = User.objects.make_random_password()
            instance.set_password(password)
            instance.save()

            partner_name = partner.company_name
            send_password_email(partner_name,instance.email,password,self.context['request'])

        return instance