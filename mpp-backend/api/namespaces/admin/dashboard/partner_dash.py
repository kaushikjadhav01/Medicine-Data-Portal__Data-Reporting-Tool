from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.helpers.custom_permissions import IsAdmin
from django.db.models import F
from MPP_API.settings import quarter_list,quarter_mapping
from api.models import (
    ActiveProduct,Product,OngoingQuarter,
    Country,FilingPlan, Partner,
    TemplateMessage, Quarter
)
from datetime import datetime
import os
class PartnerDashboard(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):
        partner_id = request.user.id
        template_data_list=[]
#        template_types = TemplateMessage.objects.filter(is_partner_message=True).values('template_type').distinct()
#        template_types=[entry for entry in template_types]
        template_types=[{'template_type':'pdt'},{'template_type':'filing plan'},{'template_type':'sales'}]
            
        for template_type in template_types:
            template_data = TemplateMessage.objects.filter(partner_id=partner_id,template_type=template_type['template_type'],is_partner_message=True).values('template_type','is_read','is_approved','quarter_id','quarter_name','created_at','updated_at').last()
                    
            q_1 = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[1]
            # last_month_of_quarter = Quarter.objects.filter(is_active=True).order_by('-quarter_id')[0].quarter_name[4:]
            approval_time = None
            submission_time = None
            # if last_month_of_quarter == "Dec 2020":
            #     last_day_of_quarter = "31 "+last_month_of_quarter
            # else:
            #     last_day_of_quarter="30 "+last_month_of_quarter
            # last_day_of_quarter = datetime.strptime(last_day_of_quarter, '%d %b %Y')
            # cut_off_date = os.getenv('CUT_OFF_DATE')
            # cut_off_date=datetime.strptime(cut_off_date,'%d %b %Y')
            cut_off_date = q_1.cut_off_date
            today= datetime.today()
            # no_of_days_to_submit = cut_off_date - today
            # no_of_days_to_submit = no_of_days_to_submit.days + 1
            no_of_days_to_submit=cut_off_date
            last_msg = TemplateMessage.objects.filter(
                partner_id=partner_id,
                quarter_id=q_1,
                template_type=template_type['template_type']).last()
            report_status = 'Not Submitted'
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
                    template_data['no_of_days_to_submit']=no_of_days_to_submit    
            else:
                report_status = 'Not Submitted'
                template_data={}
                template_data['no_of_days_to_submit']=no_of_days_to_submit
                template_data['template_type']=template_type['template_type']
                

            if template_data:
                if last_msg and last_msg.is_partner_message == True and template_data['is_read']==True:
                    report_status = 'Viewed'
                if last_msg:    
                    message=last_msg.message
                elif report_status == 'Not Submitted':
                    message=None
                template_data['report_status']=report_status
                template_data['approval_time']=approval_time
                template_data['submission_time']=submission_time
                template_data['last_message']=message
            else:
                template_data['template_type']=template_type['template_type']
                template_data['quarter_id']=q_1.quarter_id
                template_data['quarter_name']=q_1.quarter_name
                template_data['report_status']=report_status
                template_data['approval_time']=approval_time
                template_data['submission_time']=submission_time
                template_data['last_message']=None
            template_data_list.append(template_data)
                
        return Response(template_data_list,status=status.HTTP_200_OK)
