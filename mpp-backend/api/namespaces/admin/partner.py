from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework.views import APIView

from api.helpers.custom_permissions import IsAdmin
from api.models import (
    User,UserNestedSerializer,
    Partner,PartnerNestedSerializer,
    TemplateMessage, Quarter,
    Country
)

class PartnerViewSet(viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin
):
    
    permission_classes = [IsAdmin]

    queryset = User.objects.all()
    serializer_class = UserNestedSerializer

    def list(self,request):
        partners = User.objects.filter(is_active=True,role='PARTNER').order_by('-updated_at')

        if not partners:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            serializer = UserNestedSerializer(data=partners,many=True)
            serializer.is_valid()
            response ={}
            
            template_data_list=[]
            template_types = TemplateMessage.objects.filter(is_partner_message=True).values('template_type').distinct()
            template_types=[entry for entry in template_types]
            # for template_type in template_types:
            #     template_data = TemplateMessage.objects.filter(template_type=template_type['template_type'],is_partner_message=True).values('template_type','is_read','is_approved','created_at','quarter_id','quarter_name','updated_at').last()
            #     template_data_list.append(template_data)
            
            for index in range(len(serializer.data)):
                template_data_list=[]
                if serializer.data[index].get('partner',None) != None:
                    partner_id = serializer.data[index]['partner']['partner_id']
                    for template_type in template_types:
                        
                        q_1 = Quarter.objects.filter(is_active=True).order_by('-quarter_year', '-quarter_index')[1]
                        template_data = TemplateMessage.objects.filter(partner_id=partner_id,quarter_id=q_1,template_type=template_type['template_type']).values('template_type','is_read','is_approved','quarter_id','quarter_name','created_at','updated_at').last()
                        approval_time = None
                        submission_time = None

                        last_msg = TemplateMessage.objects.filter(
                            partner_id=partner_id,
                            quarter_id=q_1,
                            template_type=template_type['template_type']).last()
        
                        if last_msg:
                            if last_msg.is_partner_message == True:
                                report_status = 'Submitted'
                                submission_time = last_msg.updated_at
                            elif last_msg.is_partner_message == False and last_msg.is_approved == True:
                                report_status = 'Approved'
                                approval_time = last_msg.updated_at
                            elif last_msg.is_partner_message == False and last_msg.is_approved == False:
                                report_status = 'Rejected'
                                approval_time = last_msg.updated_at
                        else:
                            report_status = 'Not Submitted'
                        if template_data:
                            template_data['report_status']=report_status
                            template_data['approval_time']=approval_time
                            template_data['submission_time']=submission_time
                        template_data_list.append(template_data)
                    serializer.data[index]['partner']['template_data'] = template_data_list
            return Response(serializer.data,status=status.HTTP_200_OK)

    def destroy(self,request,pk):

        user = User.objects.get(pk=pk)
        user.is_active = False
        user.save()

        partner = Partner.objects.get(pk=pk)
        partner.is_active = False
        partner.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class CountryListView(APIView):

    permission_classes = [IsAdmin]

    def get(self,request):
        
        country_list = []
        country = Country.objects.filter(is_active=True).order_by('country_name')

        for each in country:
            country_list.append(each.country_name)

        return Response(data=country_list,status=status.HTTP_200_OK)
