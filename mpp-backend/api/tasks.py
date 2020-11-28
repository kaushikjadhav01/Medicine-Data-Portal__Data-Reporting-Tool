from __future__ import absolute_import

from celery import shared_task

from api.models import (
    Quarter,
    OngoingQuarter,
    ProductQuarter,
    ActiveProduct,
    User,Partner
)

import os
from django.utils.html import strip_tags
from django.template.loader import render_to_string, get_template
from django.core.mail import send_mail, EmailMultiAlternatives
from datetime import datetime

from MPP_API.settings import quarter_list, INIT_QUARTER_INDEX, INIT_YEAR
from MPP_API.settings import FROM_EMAIL_ID

@shared_task
def send_bulk_email(data):

    for each in data:
        email_id = each['email_id']
        not_submitted = each['not_submitted']

        try:
            user = User.objects.get(email=email_id)
            company_name = Partner.objects.get(pk=user.id).company_name
        except:
            continue


        api_link = os.getenv('API_LINK')
        email_subject = str('Reminder: Please submit your report')
        
        template_url = None
        pdt_link = None
        filing_plan_link = None
        sales_link = None

        for template_type in not_submitted:
            if template_type == "pdt":
                template_url = "development-timeline"
                pdt_link = str(api_link + 'partner/' + template_url)

            elif template_type == "filing plan":
                template_url = "filing-plans"
                filing_plan_link = str(api_link + 'partner/' + template_url)

            elif template_type == "sales":
                template_url = "sales-report"
                sales_link = str(api_link + 'partner/' + template_url)

        cut_off_date = os.getenv('CUT_OFF_DATE')
        cut_off_date=datetime.strptime(cut_off_date,'%d %b %Y')
        today= datetime.today()
        no_of_days_to_submit = cut_off_date - today
        no_of_days_to_submit = no_of_days_to_submit.days + 1
        
        html_message = render_to_string('partner_bulk_reminder.html', {'partner_name': company_name.capitalize(), 'no_of_days_to_submit':no_of_days_to_submit,'pdt_link':pdt_link, 'filing_plan_link':filing_plan_link, 'sales_link':sales_link})
        plain_message = strip_tags(html_message)
        send_mail(email_subject, plain_message, FROM_EMAIL_ID, [email_id], html_message=html_message)


@shared_task
def next_quarter():
    ongoing_quarter = OngoingQuarter.objects.all().first()

    if ongoing_quarter == None:
        ongoing_quarter = OngoingQuarter.objects.create(index=INIT_QUARTER_INDEX,year=INIT_YEAR)
    else:
        if (ongoing_quarter.index + 1)%4 == 0:
            ongoing_quarter.index = 0
            ongoing_quarter.year += 1
            ongoing_quarter.save()
        else:
            ongoing_quarter.index += 1
            ongoing_quarter.save()
    
    quarter_name = quarter_list[ongoing_quarter.index] + " " + str(ongoing_quarter.year)
    
    quarter = Quarter.objects.create(
        quarter_name=quarter_name,
        created_by=0,
        updated_by=0
    )
    
    active_products = ActiveProduct.objects.all()    
    for active_product in active_products:
        
        product_quarter = ProductQuarter.objects.create(
            active_product_id=active_product,
            quarter_id=quarter,
            created_by=0,
            updated_by=0
        )
    
    active_quarters = Quarter.objects.filter(is_active=True).order_by('quarter_id')
    if active_quarters.exists() and len(active_quarters) > 3:
        quarter = active_quarters[0]
        quarter.is_active = False
        quarter.save()
    
    api_link = os.getenv('API_LINK')
    link = str(api_link + 'partner/dashboard')
    email_subject = str('New Quarter has Started')
        
    html_message = render_to_string('new_quarter_mail.html', {'link':link})
    plain_message = strip_tags(html_message)

    to_email_list = []
    partners = User.objects.filter(is_active=True,role='PARTNER')
    for each in partners:
        to_email_list.append(each.email)

    msg = EmailMultiAlternatives(email_subject, plain_message, FROM_EMAIL_ID, bcc=to_email_list)
    msg.attach_alternative(html_message, "text/html")
    msg.send()
    
    return "New quarter " + quarter_name + " has been added."