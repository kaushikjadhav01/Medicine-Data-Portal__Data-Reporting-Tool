from api.models import (
    MedspalRecords, MedspalRecordsSummary, MedspalApplications, MedspalLicenses,
    MedspalProductStandardizedName, MedspalProductBrandName, MedspalOriginator,
    MedspalExclusivityDuration, MedspalExclusivityStartedOn, MedspalStatus
)
from django.db.models import F
import csv, os
import pandas as pd  
from datetime import datetime

# Delete Old Statuses
MedspalStatus.objects.all().delete()

# Function that takes Queryset and Creates Status Objects
def create_status(medspal_records,status):
    for medspal_record in medspal_records:
        MedspalStatus.objects.create(status=status,record_id_id=medspal_record['record_id'],application_id_id=medspal_record['medspalapplications'],license_id_id=medspal_record['medspallicenses'],product_standardized_name=medspal_record['medspalproductstandardizedname__product_standardized_name'],country_name=medspal_record['country_name'])

product_standardized_names_list=[]
countries = MedspalRecords.objects.values('country_name').distinct()

####################### SINGLE PRODUCTS ########################
print('############### SINGLE PRODUCTS #################')
product_standardized_names = [i for i in os.getenv('MEDSPAL_STATUS_SINGLE_PRODUCTS').splitlines()] 

for product_name in product_standardized_names:
    print(product_name)
    for country in countries:
        medspal_records_true = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True
        )
        
        medspal_records_false_granted = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")]
        )
        
        medspal_records_false_filed = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")]
        )
        
        medspal_records_false_rejected = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")]
        )
        
        if medspal_records_true.exists():
            medspal_records = medspal_records_true.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Under Licence')
        elif medspal_records_false_granted.exists():
            medspal_records = medspal_records_false_granted.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')
        elif medspal_records_false_filed.exists():
            medspal_records = medspal_records_false_filed.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')
        elif medspal_records_false_rejected.exists():
            medspal_records = medspal_records_false_rejected.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        else:
            medspal_records = [{'country_name':country['country_name'],'medspalproductstandardizedname__product_standardized_name':product_name,'record_id':None,'medspalapplications':None,'medspallicenses':None}]
            create_status(medspal_records,'Not Applicable')
 

############### GROUP PRODUCTS ###############################################################
print('############### GROUP PRODUCTS #################')
####################### Tenofovir alafenamide/Lamivudine/Dolutegravir ########################
product_standardized_names = ['Tenofovir alafenamide/Lamivudine/Dolutegravir']
print(product_standardized_names)
product_standardized_names_list = product_standardized_names_list + product_standardized_names

for product_name in product_standardized_names:
    for country in countries:
        medspal_records_true_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspallicenses__headline='MPP licence on adult formulations of dolutegravir (DTG) and DTG/ABC combinations'
        )

        medspal_records_true_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspallicenses__headline='MPP licence on tenofovir alafenamide (TAF), bictegravir (BIC),  TAF/FTC and TAF/FTC/BIC'
        )

        medspal_records_true = medspal_records_true_query1 | medspal_records_true_query2
        
        # False Granted Case 1
        medspal_records_false_granted_case1_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='MPP licence on adult formulations of dolutegravir (DTG) and DTG/ABC combinations'
        )
        
        medspal_records_false_granted_case1_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        
        medspal_records_false_granted_case1 = medspal_records_false_granted_case1_query1 | medspal_records_false_granted_case1_query2
        
        # False Filed Case 1
        medspal_records_false_filed_case1_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='MPP licence on adult formulations of dolutegravir (DTG) and DTG/ABC combinations'
        )
        
        medspal_records_false_filed_case1_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        
        medspal_records_false_filed_case1 = medspal_records_false_filed_case1_query1 | medspal_records_false_filed_case1_query2
        
        # False Rejected Case 1
        medspal_records_false_rejected_case1_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='MPP licence on adult formulations of dolutegravir (DTG) and DTG/ABC combinations'
        )
        
        medspal_records_false_rejected_case1_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        
        medspal_records_false_rejected_case1 = medspal_records_false_rejected_case1_query1 | medspal_records_false_rejected_case1_query2
        
        # False Granted Case 2
        medspal_records_false_granted_case2_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='MPP licence on tenofovir alafenamide (TAF), bictegravir (BIC),  TAF/FTC and TAF/FTC/BIC'
        )
        
        medspal_records_false_granted_case2_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_granted_case2 = medspal_records_false_granted_case2_query1 | medspal_records_false_granted_case2_query2
        
        # False Filed Case 2
        medspal_records_false_filed_case2_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='MPP licence on tenofovir alafenamide (TAF), bictegravir (BIC),  TAF/FTC and TAF/FTC/BIC'
        )
        
        medspal_records_false_filed_case2_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_filed_case2 = medspal_records_false_filed_case2_query1 | medspal_records_false_filed_case2_query2
        
        # False Rejected Case 2
        medspal_records_false_rejected_case2_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='MPP licence on tenofovir alafenamide (TAF), bictegravir (BIC),  TAF/FTC and TAF/FTC/BIC'
        )
        
        medspal_records_false_rejected_case2_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_rejected_case2 = medspal_records_false_rejected_case2_query1 | medspal_records_false_rejected_case2_query2

        # False Granted Case 3
        medspal_records_false_granted_case3_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        
        medspal_records_false_granted_case3_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_granted_case3 = medspal_records_false_granted_case3_query1 | medspal_records_false_granted_case3_query2
        
        # False Filed Case 3
        medspal_records_false_filed_case3_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        
        medspal_records_false_filed_case3_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_filed_case3 = medspal_records_false_filed_case3_query1 | medspal_records_false_filed_case3_query2
        
        # False Rejected Case 3
        medspal_records_false_rejected_case3_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        
        medspal_records_false_rejected_case3_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_rejected_case3 = medspal_records_false_rejected_case3_query1 | medspal_records_false_rejected_case3_query2
        
        if medspal_records_true_query1.exists() and medspal_records_true_query2.exists():
            
            medspal_records = medspal_records_true.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Under Licence')
        elif medspal_records_false_granted_case1_query1.exists() and medspal_records_false_granted_case1_query2.exists():
            
            medspal_records = medspal_records_false_granted_case1.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')
        elif medspal_records_false_granted_case2_query1.exists() and medspal_records_false_granted_case2_query2.exists():
            
            medspal_records = medspal_records_false_granted_case2.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')

        elif medspal_records_false_filed_case1_query1.exists() and medspal_records_false_filed_case1_query2.exists():
            
            medspal_records = medspal_records_false_filed_case1.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')
        elif medspal_records_false_filed_case2_query1.exists() and medspal_records_false_filed_case2_query2.exists():
            
            medspal_records = medspal_records_false_filed_case2.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')

        elif medspal_records_false_rejected_case1_query1.exists() and medspal_records_false_rejected_case1_query2.exists():
            
            medspal_records = medspal_records_false_rejected_case1.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        elif medspal_records_false_rejected_case2_query1.exists() and medspal_records_false_rejected_case2_query2.exists():
            
            medspal_records = medspal_records_false_rejected_case2.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')

        elif medspal_records_false_granted_case3_query1.exists() and medspal_records_false_granted_case3_query2.exists():
            
            medspal_records = medspal_records_false_granted_case3.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')

        elif medspal_records_false_filed_case3_query1.exists() and medspal_records_false_filed_case3_query2.exists():
            
            medspal_records = medspal_records_false_filed_case3.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')

        elif medspal_records_false_rejected_case3_query1.exists() and medspal_records_false_rejected_case3_query2.exists():
            
            medspal_records = medspal_records_false_rejected_case3.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        
        else:
            
            medspal_records = [{'country_name':country['country_name'],'medspalproductstandardizedname__product_standardized_name':product_name,'record_id':None,'medspalapplications':None,'medspallicenses':None}]
            create_status(medspal_records,'Not Applicable')

####################### Tenofovir alafenamide/Emtricitabine/Dolutegravir 25/200/50 mg ########################
product_standardized_names = ['Tenofovir alafenamide/Emtricitabine/Dolutegravir 25/200/50 mg']
print(product_standardized_names)
product_standardized_names_list = product_standardized_names_list + product_standardized_names

for product_name in product_standardized_names:
    for country in countries:
        medspal_records_true_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspallicenses__headline='MPP licence on adult formulations of dolutegravir (DTG) and DTG/ABC combinations'
        )

        medspal_records_true_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspallicenses__headline='MPP licence on tenofovir alafenamide (TAF), bictegravir (BIC),  TAF/FTC and TAF/FTC/BIC'
        )

        medspal_records_true = medspal_records_true_query1 | medspal_records_true_query2
        
        # False Granted Case 1
        medspal_records_false_granted_case1_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','TAF/FTC combinations'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='MPP licence on adult formulations of dolutegravir (DTG) and DTG/ABC combinations'
        )
        
        medspal_records_false_granted_case1_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','TAF/FTC combinations'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        
        medspal_records_false_granted_case1 = medspal_records_false_granted_case1_query1 | medspal_records_false_granted_case1_query2
        
        # False Filed Case 1
        medspal_records_false_filed_case1_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','TAF/FTC combinations'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='MPP licence on adult formulations of dolutegravir (DTG) and DTG/ABC combinations'
        )
        
        medspal_records_false_filed_case1_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','TAF/FTC combinations'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        
        medspal_records_false_filed_case1 = medspal_records_false_filed_case1_query1 | medspal_records_false_filed_case1_query2
        
        # False Rejected Case 1
        medspal_records_false_rejected_case1_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','TAF/FTC combinations'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='MPP licence on adult formulations of dolutegravir (DTG) and DTG/ABC combinations'
        )
        
        medspal_records_false_rejected_case1_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide hemifumarate (TAF)','Tenofovir alafenamide fumarate (TAF)','TAF manufacturing process','TAF/FTC combinations'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        
        medspal_records_false_rejected_case1 = medspal_records_false_rejected_case1_query1 | medspal_records_false_rejected_case1_query2
        
        # False Granted Case 2
        medspal_records_false_granted_case2_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='MPP licence on tenofovir alafenamide (TAF), bictegravir (BIC),  TAF/FTC and TAF/FTC/BIC'
        )
        
        medspal_records_false_granted_case2_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_granted_case2 = medspal_records_false_granted_case2_query1 | medspal_records_false_granted_case2_query2
        
        # False Filed Case 2
        medspal_records_false_filed_case2_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='MPP licence on tenofovir alafenamide (TAF), bictegravir (BIC),  TAF/FTC and TAF/FTC/BIC'
        )
        
        medspal_records_false_filed_case2_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_filed_case2 = medspal_records_false_filed_case2_query1 | medspal_records_false_filed_case2_query2
        
        # False Rejected Case 2
        medspal_records_false_rejected_case2_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='MPP licence on tenofovir alafenamide (TAF), bictegravir (BIC),  TAF/FTC and TAF/FTC/BIC'
        )
        medspal_records_false_rejected_case2_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Cabotegravir prodrugs & Cabotegravir and Dolutegravir intermediates  and processes','Dolutegravir and Cabotegravir compounds','Dolutegravir salts, their crystals & process','Dolutegravir/Cabotegravir intermediates production processes & Intermediates','Emtricitabine and lamivudine compounds'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_rejected_case2 = medspal_records_false_rejected_case2_query1 | medspal_records_false_rejected_case2_query2
        # False Granted Case 3
        medspal_records_false_granted_case3_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        
        medspal_records_false_granted_case3_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_granted_case3 = medspal_records_false_granted_case3_query1 | medspal_records_false_granted_case3_query2
        
        # False Filed Case 3
        medspal_records_false_filed_case3_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        
        medspal_records_false_filed_case3_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_filed_case3 = medspal_records_false_filed_case3_query1 | medspal_records_false_filed_case3_query2
        
        # False Rejected Case 3
        medspal_records_false_rejected_case3_query1 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='Country not included in TAF licence. See Licence Summary for sales outside the licence territory.'
        )
        medspal_records_false_rejected_case3_query2 = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__description__in=['Tenofovir alafenamide fumarate (TAF)','Dolutegravir and Cabotegravir compounds','Tenofovir alafenamide hemifumarate (TAF)','TAF manufacturing process'],
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_rejected_case3 = medspal_records_false_rejected_case3_query1 | medspal_records_false_rejected_case3_query2

        if medspal_records_true_query1.exists() and medspal_records_true_query2.exists():
            
            medspal_records = medspal_records_true.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Under Licence')
        elif medspal_records_false_granted_case1_query1.exists() and medspal_records_false_granted_case1_query2.exists():
            
            medspal_records = medspal_records_false_granted_case1.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')
        elif medspal_records_false_granted_case2_query1.exists() and medspal_records_false_granted_case2_query2.exists():
            
            medspal_records = medspal_records_false_granted_case2.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')

        elif medspal_records_false_filed_case1_query1.exists() and medspal_records_false_filed_case1_query2.exists():
            
            medspal_records = medspal_records_false_filed_case1.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')
        elif medspal_records_false_filed_case2_query1.exists() and medspal_records_false_filed_case2_query2.exists():
            
            medspal_records = medspal_records_false_filed_case2.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')

        elif medspal_records_false_rejected_case1_query1.exists() and medspal_records_false_rejected_case1_query2.exists():
            
            medspal_records = medspal_records_false_rejected_case1.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        elif medspal_records_false_rejected_case2_query1.exists() and medspal_records_false_rejected_case2_query2.exists():
            
            medspal_records = medspal_records_false_rejected_case2.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        
        elif medspal_records_false_granted_case3_query1.exists() and medspal_records_false_granted_case3_query2.exists():
            
            medspal_records = medspal_records_false_granted_case3.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')

        elif medspal_records_false_filed_case3_query1.exists() and medspal_records_false_filed_case3_query2.exists():
            
            medspal_records = medspal_records_false_filed_case3.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')
        elif medspal_records_false_rejected_case3_query1.exists() and medspal_records_false_rejected_case3_query2.exists():
            
            medspal_records = medspal_records_false_rejected_case3.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        else:
            
            medspal_records = [{'country_name':country['country_name'],'medspalproductstandardizedname__product_standardized_name':product_name,'record_id':None,'medspalapplications':None,'medspallicenses':None}]
            create_status(medspal_records,'Not Applicable')




####################### Daclatasvir 30mg/60 mg ########################
product_standardized_names = ['Daclatasvir 30 mg', 'Daclatasvir 60 mg']
print(product_standardized_names)
product_standardized_names_list = product_standardized_names_list + product_standardized_names


for product_name in product_standardized_names:
    for country in countries:
        medspal_records_true = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspallicenses__headline__in=['MPP licence on daclatasvir (DCV)','BMS commitment not to enforce  patents on Daclatasvir and discontinuation of Daklinza']
        )
        
        medspal_records_false_granted = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline='Country not included in DCV licence.  However, supply by MPP licensees permitted if no patent is being infringed and licensee not relying on BMS technology.'
        )
        
        medspal_records_false_filed = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline='Country not included in DCV licence.  However, supply by MPP licensees permitted if no patent is being infringed and licensee not relying on BMS technology.'
        )
        
        medspal_records_false_rejected = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline='Country not included in DCV licence.  However, supply by MPP licensees permitted if no patent is being infringed and licensee not relying on BMS technology.'
        )
        
        if medspal_records_true.exists():
            
            medspal_records = medspal_records_true.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Under Licence')
        elif medspal_records_false_granted.exists():
            
            medspal_records = medspal_records_false_granted.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')
        elif medspal_records_false_filed.exists():
            
            medspal_records = medspal_records_false_filed.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')
        elif medspal_records_false_rejected.exists():
            
            medspal_records = medspal_records_false_rejected.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        else:
            
            medspal_records = [{'country_name':country['country_name'],'medspalproductstandardizedname__product_standardized_name':product_name,'record_id':None,'medspalapplications':None,'medspallicenses':None}]
            create_status(medspal_records,'Not Applicable')

####################### Daclatasvir/Sofosbuvir ########################
product_standardized_names = ['Sofosbuvir/Daclatasvir 400/60 mg', 'Sofosbuvir+Daclatasvir 400+60 mg']
print(product_standardized_names)
product_standardized_names_list = product_standardized_names_list + product_standardized_names


for product_name in product_standardized_names:
    for country in countries:
        medspal_records_true = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspallicenses__headline__in=['MPP licence on daclatasvir (DCV)','BMS commitment not to enforce  patents on Daclatasvir and discontinuation of Daklinza']
        )
        
        medspal_records_false_granted = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_GRANTED').split(", ")],
            medspallicenses__headline__in=['Country not included in DCV licence.  However, supply by MPP licensees permitted if no patent is being infringed and licensee not relying on BMS technology.']
        )
        
        medspal_records_false_filed = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_FILED').split(", ")],
            medspallicenses__headline__in=['Country not included in DCV licence.  However, supply by MPP licensees permitted if no patent is being infringed and licensee not relying on BMS technology.']
        )
        
        medspal_records_false_rejected = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=[i for i in os.getenv('MEDSPAL_STATUS_REJECTED').split(", ")],
            medspallicenses__headline__in=['Country not included in DCV licence.  However, supply by MPP licensees permitted if no patent is being infringed and licensee not relying on BMS technology.']
        )
        
        if medspal_records_true.exists():
            
            medspal_records = medspal_records_true.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Under Licence')
        elif medspal_records_false_granted.exists():
            
            medspal_records = medspal_records_false_granted.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')
        elif medspal_records_false_filed.exists():
            
            medspal_records = medspal_records_false_filed.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')
        elif medspal_records_false_rejected.exists():
            
            medspal_records = medspal_records_false_rejected.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        else:
            
            medspal_records = [{'country_name':country['country_name'],'medspalproductstandardizedname__product_standardized_name':product_name,'record_id':None,'medspalapplications':None,'medspallicenses':None}]
            create_status(medspal_records,'Not Applicable')

####################### Dolutegravir 5 mg, Dolutegravir 25 mg ########################
product_standardized_names = ['Dolutegravir 5 mg','Dolutegravir 25 mg']
print(product_standardized_names)
product_standardized_names_list = product_standardized_names_list + product_standardized_names

for product_name in product_standardized_names:
    for country in countries:
        medspal_records_true = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspallicenses__headline='MPP licence on paediatric formulations of dolutegravir (DTG)'
        )
        
        medspal_records_false_granted = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=["Granted","Granted (opposed)","Patent restored","Term extended"],
            medspallicenses__headline='Country not included in 2014 DTG paediatric licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_filed = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=['Filed','Filed (opposed)'],
            medspallicenses__headline='Country not included in 2014 DTG paediatric licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_rejected = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=["Not Filed","Expired","Rejected","Rejected - under appeal","Revoked","Withdrawn"],
            medspallicenses__headline='Country not included in 2014 DTG paediatric licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )

        if medspal_records_true.exists():
            
            medspal_records = medspal_records_true.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Under Licence')
        elif medspal_records_false_granted.exists():
            
            medspal_records = medspal_records_false_granted.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')
        elif medspal_records_false_filed.exists():
            
            medspal_records = medspal_records_false_filed.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')
        elif medspal_records_false_rejected.exists():
            
            medspal_records = medspal_records_false_rejected.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        else:
            
            medspal_records = [{'country_name':country['country_name'],'medspalproductstandardizedname__product_standardized_name':product_name,'record_id':None,'medspalapplications':None,'medspallicenses':None}]
            create_status(medspal_records,'Not Applicable')

####################### 'Abacavir 20 mg/ml','Abacavir/Lamivudine 120/60 mg','Abacavir/Lamivudine 60/30 mg','Abacavir/Lamivudine 600/300 mg' ########################
product_standardized_names = ['Abacavir 20 mg/ml','Abacavir/Lamivudine 120/60 mg','Abacavir/Lamivudine 60/30 mg','Abacavir/Lamivudine 600/300 mg']
print(product_standardized_names)
product_standardized_names_list = product_standardized_names_list + product_standardized_names

for product_name in product_standardized_names:
    for country in countries:
        medspal_records_true = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspallicenses__headline='MPP licence on paediatric formulations of abacavir (ABC)'
        )
        
        medspal_records_false_granted = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=["Granted","Granted (opposed)","Patent restored","Term extended"],
            medspallicenses__headline='Country not included in ABC paediatric licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_filed = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=['Filed','Filed (opposed)'],
            medspallicenses__headline='Country not included in ABC paediatric licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_rejected = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=["Not Filed","Expired","Rejected","Rejected - under appeal","Revoked","Withdrawn"],
            medspallicenses__headline='Country not included in ABC paediatric licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )

        if medspal_records_true.exists():
            
            medspal_records = medspal_records_true.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Under Licence')
        elif medspal_records_false_granted.exists():
            
            medspal_records = medspal_records_false_granted.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')
        elif medspal_records_false_filed.exists():
            
            medspal_records = medspal_records_false_filed.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')
        elif medspal_records_false_rejected.exists():
            
            medspal_records = medspal_records_false_rejected.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        else:
            
            medspal_records = [{'country_name':country['country_name'],'medspalproductstandardizedname__product_standardized_name':product_name,'record_id':None,'medspalapplications':None,'medspallicenses':None}]
            create_status(medspal_records,'Not Applicable')
######################## After feedback #########################################################################
####################### ABC/3TC/DTG Adult, Dolutegravir 50mg, TDF/3TC/DTG, LD count same ########################
product_standardized_names = ['Abacavir/Lamivudine/Dolutegravir 600/300/50 mg','Tenofovir/Lamivudine/Dolutegravir 300/300/50 mg','Dolutegravir 50 mg']
print(product_standardized_names)
product_standardized_names_list = product_standardized_names_list + product_standardized_names

for product_name in product_standardized_names:
    for country in countries:
        medspal_records_true = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspallicenses__headline__in=['MPP licence on adult formulations of dolutegravir (DTG) and DTG/ABC combinations']
        )
        
        medspal_records_false_granted = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.',
            medspalapplications__status__in=["Granted","Granted (opposed)","Patent restored","Term extended"]
        )
        
        medspal_records_false_filed = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.',
            medspalapplications__status__in=['Filed','Filed (opposed)']
        )
        
        medspal_records_false_rejected = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.',
            medspalapplications__status__in=["Not Filed","Expired","Rejected","Rejected - under appeal","Revoked","Withdrawn"]
        )
        
        if medspal_records_true.exists():
            medspal_records = medspal_records_true.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Under Licence')
        elif medspal_records_false_granted.exists():
            medspal_records = medspal_records_false_granted.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')
        elif medspal_records_false_filed.exists():
            medspal_records = medspal_records_false_filed.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')
        elif medspal_records_false_rejected.exists():
            medspal_records = medspal_records_false_rejected.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        else:
            medspal_records = [{'country_name':country['country_name'],'medspalproductstandardizedname__product_standardized_name':product_name,'record_id':None,'medspalapplications':None,'medspallicenses':None}]
            create_status(medspal_records,'Not Applicable')

####################### Dolutegravir/Lamivudine 50/300 mg ########################
product_standardized_names = ['Dolutegravir/Lamivudine 50/300 mg']
print(product_standardized_names)
product_standardized_names_list = product_standardized_names_list + product_standardized_names

for product_name in product_standardized_names:
    for country in countries:
        medspal_records_true = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=True,
            medspallicenses__headline='MPP licence on adult formulations of dolutegravir (DTG) and DTG/ABC combinations'
        )
        
        medspal_records_false_granted = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=["Granted","Granted (opposed)","Patent restored","Term extended"],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_filed = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=['Filed','Filed (opposed)'],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        medspal_records_false_rejected = MedspalRecords.objects.filter(
            country_name=country['country_name'],
            medspalproductstandardizedname__product_standardized_name=product_name,
            medspallicenses__type='MPP Licence',
            medspallicenses__covered=False,
            medspalapplications__status__in=["Not Filed","Expired","Rejected","Rejected - under appeal","Revoked","Withdrawn"],
            medspallicenses__headline='Country not included in 2014 DTG adult licence.  However, supply by MPP licensees permitted if no patent is being infringed in that country.'
        )
        
        if medspal_records_true.exists():
            medspal_records = medspal_records_true.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Under Licence')
        elif medspal_records_false_granted.exists():
            medspal_records = medspal_records_false_granted.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Valid Patent')
        elif medspal_records_false_filed.exists():
            medspal_records = medspal_records_false_filed.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'Filed')
        elif medspal_records_false_rejected.exists():
            medspal_records = medspal_records_false_rejected.values('record_id','medspalapplications','medspallicenses','medspalproductstandardizedname__product_standardized_name','country_name')
            create_status(medspal_records,'No Patent')
        else:
            medspal_records = [{'country_name':country['country_name'],'medspalproductstandardizedname__product_standardized_name':product_name,'record_id':None,'medspalapplications':None,'medspallicenses':None}]
            create_status(medspal_records,'Not Applicable')

#################### RECORDS NOT IN MEDSPAL #######################
product_acronyms = pd.read_csv('scripts/Medspal_Product_Name_Acronyms.csv')
product_acronyms.index = product_acronyms['acronym']
product_acronyms_dict = product_acronyms.to_dict()['product_standardized_name']
not_in_medspal_grid = pd.read_csv('scripts/countries_not_in_medspal.csv')
products = not_in_medspal_grid.columns[3:]
countries = not_in_medspal_grid['Country']
not_in_medspal_grid.index = not_in_medspal_grid['Country']
for country in countries:
    for product in products:
        status = not_in_medspal_grid.loc[country][product]
        if status == 'UL':
            if product in product_acronyms_dict.keys():
                product_standardized_name = product_acronyms_dict[product]
                medspal_statuses = MedspalStatus.objects.filter(country_name=country,product_standardized_name=product_standardized_name)
                for obj in medspal_statuses:
                    obj.status = 'Under Licence'
                    obj.save()
existing_countries = list(MedspalStatus.objects.values_list('country_name',flat=True).distinct())                
new_countries = []
for country in countries:
    if country not in existing_countries:
        new_countries.append(country)

for country in new_countries:
    for product in products:
        status = not_in_medspal_grid.loc[country][product]
        if status == 'UL':
            if product in product_acronyms_dict.keys():
                product_standardized_name = product_acronyms_dict[product]
                MedspalStatus.objects.create(country_name=country,product_standardized_name=product_standardized_name,status='Under Licence',application_id=None,record_id=None,license_id=None)

# Assign Not Applicable if no status in New Countries in Grid
existing_products = list(MedspalStatus.objects.values_list('product_standardized_name',flat=True).distinct())
for country in new_countries:
    for product_standardized_name in existing_products:
        status_obj = MedspalStatus.objects.filter(country_name=country,product_standardized_name=product_standardized_name,status='Under Licence',application_id=None,record_id=None,license_id=None)
        if not status_obj.exists():
            MedspalStatus.objects.create(country_name=country,product_standardized_name=product_standardized_name,status='Not Applicable',application_id=None,record_id=None,license_id=None)
#### Export CSV
medspal_status = MedspalStatus.objects.values('country_name','product_standardized_name','status').distinct().order_by('country_name','product_standardized_name')
column_names = ['country_name','product_standardized_name','status']  
with open('scripts/Medspal_Status_Columns.csv', 'w', encoding='utf-8',newline='')  as output_file:
    dict_writer = csv.DictWriter(output_file, column_names)
    dict_writer.writeheader()
    dict_writer.writerows(medspal_status)

### Convert to Grid using Dataframe
product_name_map = pd.read_csv('scripts/Medspal_Product_Name_Acronyms.csv')
df = pd.DataFrame(medspal_status)
merged_df = product_name_map.merge(df, how = 'inner', on = ['product_standardized_name'])

grid = merged_df.pivot_table(columns='acronym', index='country_name', values='status',aggfunc=lambda x: ''.join(str(v) for v in x))
timestamp = datetime.today().strftime('%Y-%m-%d-%I-%M-%p')
file_path = 'scripts/Medspal_Country_Product_Status_Grid-'+timestamp+'.csv'
grid.to_csv(file_path)