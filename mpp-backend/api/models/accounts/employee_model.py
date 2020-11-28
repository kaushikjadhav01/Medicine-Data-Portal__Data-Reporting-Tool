from django.db import models
from rest_framework import serializers

class Employee(models.Model):

    class Meta:
        db_table = "employee"

    employee_id = models.AutoField(primary_key=True)
    partner_id = models.ForeignKey("api.Partner",on_delete=models.CASCADE,db_column='partner_id')

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    contact_number = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True)
    updated_by = models.IntegerField(null=True)

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('employee_id','partner_id','first_name','last_name','contact_number')
        
    def create(self,validated_data):

        curr_user = self.context['request'].user.id

        validated_data['created_by'] = curr_user
        validated_data['updated_by'] = curr_user
        employee = Employee(**validated_data)
        employee.save()

        return employee