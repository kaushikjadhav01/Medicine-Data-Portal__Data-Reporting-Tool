import json, os
from algoliasearch.search_client import SearchClient 
from api.models import (
    MedspalRecords, MedspalRecordsSummary, MedspalApplications, MedspalLicenses,
    MedspalProductStandardizedName, MedspalProductBrandName, MedspalOriginator,
    MedspalExclusivityDuration, MedspalExclusivityStartedOn
)
from django.utils.timezone import make_aware
from django.db.models import F
from dateutil import parser

app_id = os.getenv('ALGOLIA_APP_ID')
search_api_key = os.getenv('ALGOLIA_SEARCH_API_KEY')
client = SearchClient.create(app_id, search_api_key)
index = client.init_index('production')
# client.get_logs()
# result = index.browse_objects({'attributesToRetrieve': [ 'country_code', 'disease_areas' ],
# 'filters':'country_name:Afghanistan'})
result = index.browse_objects()
# result = index.browse_objects({'attributesToRetrieve': [ 'country_code', 'disease_areas' ],
# 'facetFilters':['country_name:India']})
# print(index.get_settings())
count = 0
flag = 0

total_record_count = 0 
updated_record_count = 0 
unchanged_record_count = 0 
newly_created_record_count = 0

updated_record_ids = [] 
unchanged_record_ids = [] 
newly_created_record_ids = []
record_list = []

for record in result:
    
    record_list.append(record)
    count += 1
    # if count == 1000:
    #     break

    total_record_count +=1

    object_id = record['objectID']
    country_name = record['country_name']
    country_code = record['country_code']
    disease_areas = record['disease_areas']
    product_standardized_name = record['product_standardized_name']
    product_brand_name = record['product_brand_name']
    originator = record['originator']
    exclusivity_duration = record['exclusivity_duration']
    exclusivity_started_on = record['exclusivity_started_on']
    applications = record['applications']
    licenses = record['licenses']
    
    # Create Medspal Record if Not Exists
    medspal_record_obj = MedspalRecords.objects.filter(object_id=object_id)
    if not medspal_record_obj.exists():
        # Create Medspal Record
        medspal_record_obj =MedspalRecords.objects.create(object_id=object_id,country_name=country_name,country_code=country_code,disease_areas=disease_areas)
        newly_created_record_count += 1
        newly_created_record_ids.append(medspal_record_obj.record_id)

        # Create Simple foreign key tables
        if product_standardized_name != None:
            for element in product_standardized_name:
                product_standardized_name = MedspalProductStandardizedName.objects.create(record_id=medspal_record_obj,product_standardized_name=element)
        
        if product_brand_name != None:
            for element in product_brand_name:
                product_brand_name = MedspalProductBrandName.objects.create(record_id=medspal_record_obj,product_brand_name=element)

        if originator != None:
            for element in originator:
                originator = MedspalOriginator.objects.create(record_id=medspal_record_obj,originator=element)
        
        if exclusivity_duration != None:
            for element in exclusivity_duration:
                exclusivity_duration = MedspalExclusivityDuration.objects.create(record_id=medspal_record_obj,exclusivity_duration=element)
        
        if exclusivity_started_on != None:
            for element in exclusivity_started_on:
                exclusivity_started_on = MedspalExclusivityStartedOn.objects.create(record_id=medspal_record_obj,exclusivity_started_on=element)

        # Create Licenses
        if licenses != None:
            for license_element in licenses:
                MedspalLicenses.objects.create(record_id=medspal_record_obj,uuid=license_element['uuid'],country_uuid=license_element['country_uuid'],type=license_element['type'],covered=license_element['covered'],headline=license_element['headline'],url=license_element['url'])

        # Create Applications 
        if applications != None:
            for application_element in applications:
                application_obj = MedspalApplications.objects.create(record_id=medspal_record_obj,uuid=application_element['uuid'],country_uuid=application_element['country_uuid'],simple_family_uuid=application_element['simple_family_uuid'],description=application_element['description'],status=application_element['status'],docdb_number=application_element['docdb_number'],date=application_element['date'],updated_at=application_element['updated_at'],expiration_date=application_element['expiration_date'],publications=application_element['publications'],priorities=application_element['priorities'],pct=application_element['pct'],pcts=application_element['pcts'],)


    
    # Else If record Already Exists Check for Updated and Unchanged Records
    else:
        # Check Record Difference
        medspal_record=record
        medspal_record.pop('applications')
        medspal_record.pop('licenses')
        medspal_record.pop('product_standardized_name')
        medspal_record.pop('product_brand_name')
        medspal_record.pop('originator')
        medspal_record.pop('exclusivity_duration')
        medspal_record.pop('exclusivity_started_on')
        medspal_record_dict = medspal_record_obj.annotate(objectID=F('object_id')).values('objectID','country_name','country_code','disease_areas')[0]        
        record_difference = [i for i in medspal_record_dict.items() if i not in medspal_record.items()]

        medspal_record_obj = medspal_record_obj[0]
        
        # Check License Difference
        licenses_list = list(MedspalLicenses.objects.filter(record_id=medspal_record_obj).values('uuid','country_uuid','type','covered','headline','url'))
        if licenses_list == []:
            licenses_list = None
            licenses_difference = []
        else:
            licenses_difference = [i for i in licenses_list if i not in licenses]
            

        # Check Product Standardized Name difference
        product_standardized_name_difference = []
        product_standardized_name_list = MedspalProductStandardizedName.objects.filter(record_id=medspal_record_obj).values('product_standardized_name')
        product_standardized_name_list = [entry['product_standardized_name'] for entry in product_standardized_name_list]
        
        if product_standardized_name_list == []:
            product_standardized_name_list = None
            product_standardized_name_difference = []
        else:
            product_standardized_name_difference = [i for i in product_standardized_name_list if i not in product_standardized_name]

        # Check Product Brand Difference
        product_brand_name_difference = []
        product_brand_name_list = MedspalProductBrandName.objects.filter(record_id=medspal_record_obj).values('product_brand_name')
        product_brand_name_list = [entry['product_brand_name'] for entry in product_brand_name_list]
        
        if product_brand_name_list == []:
            product_brand_name_list = None
            product_brand_name_difference = []
        else:
            product_brand_name_difference = [i for i in product_brand_name_list if i not in product_brand_name]
        
        # Check Originator Difference
        originator_difference = []
        originator_list = MedspalOriginator.objects.filter(record_id=medspal_record_obj).values('originator')
        originator_list = [entry['originator'] for entry in originator_list]
        
        if originator_list == []:
            originator_list = None
            originator_difference = []
        else:
            originator_difference = [i for i in originator_list if i not in originator]

        # Check Exclusivity Duration Difference
        exclusivity_duration_difference = []
        exclusivity_duration_list = MedspalExclusivityDuration.objects.filter(record_id=medspal_record_obj).values('exclusivity_duration')
        exclusivity_duration_list = [entry['exclusivity_duration'] for entry in exclusivity_duration_list]
        
        if exclusivity_duration_list == []:
            exclusivity_duration_list = None
            exclusivity_duration_difference = []
        else:
            exclusivity_duration_difference = [i for i in exclusivity_duration_list if i not in exclusivity_duration]
        
        # Check Exclusivity Started On Difference
        exclusivity_started_on_difference = []
        exclusivity_started_on_list = MedspalExclusivityStartedOn.objects.filter(record_id=medspal_record_obj).values('exclusivity_started_on')
        exclusivity_started_on_list = [entry['exclusivity_started_on'] for entry in exclusivity_started_on_list]
        
        if exclusivity_started_on_list == []:
            exclusivity_started_on_list = None
            exclusivity_started_on_difference = []
        else:
            exclusivity_started_on_difference = [i for i in exclusivity_started_on_list if i not in exclusivity_started_on]


        applications_objs = MedspalApplications.objects.filter(record_id=medspal_record_obj)
        applications_dict_list=[]
        if applications_objs.exists():
            for applications_obj in applications_objs:                
                applications_obj.__dict__.pop('_state')
                applications_obj.__dict__.pop('application_id')
                applications_obj.__dict__.pop('record_id_id')
                
                applications_dict = applications_obj.__dict__
                applications_dict_list.append(applications_dict)
        else:
            applications_dict_list=None

        applications_difference = [i for i in applications_dict_list if i not in applications]
        
        # if applications_difference != [] or licenses_difference != [] or record_difference != [] or product_standardized_name_difference != [] or product_brand_name_difference !=[] or originator_difference != [] or exclusivity_duration_difference != [] or exclusivity_started_on_difference != []:
            # print(count)
            # print(record_difference, applications_difference, licenses_difference, applications_difference, product_standardized_name_difference, product_brand_name_difference, originator_difference, exclusivity_duration_difference, exclusivity_started_on_difference)
        
        if record_difference == [] and licenses_difference == [] and applications_difference == [] and product_standardized_name_difference == [] and product_brand_name_difference ==[] and originator_difference ==[] and exclusivity_duration_difference == [] and exclusivity_started_on_difference == []:
            unchanged_record_count += 1
            unchanged_record_ids.append(object_id)
        else:
            updated_record_count += 1
            updated_record_ids.append(object_id)

        # Update Records
        if record_difference != []:
            medspal_record_obj.country_name = record['country_name']
            medspal_record_obj.country_code = record['country_code']
            medspal_record_obj.disease_areas = record['disease_areas']
            medspal_record_obj.save()
        
        # Update Licenses
        if licenses_difference != []:
            if licenses != None:
                for license_element in licenses:
                    license_objs = MedspalLicenses.objects.filter(record_id=medspal_record_obj)
                    for license_obj in license_objs:
                        license_obj.uuid=license_element['uuid']
                        license_obj.country_uuid=license_element['country_uuid']
                        license_obj.type=license_element['type']
                        license_obj.covered=license_element['covered']
                        license_obj.headline=license_element['headline']
                        license_obj.url=license_element['url']
                        license_obj.save()
        
        # Update Applications
        if applications_difference != []:
            if applications != None:
                for application_element in applications:
                    application_objs = MedspalApplications.objects.filter(record_id=medspal_record_obj)
                    for application_obj in application_objs:
                        application_obj.uuid=application_element['uuid']
                        application_obj.country_uuid=application_element['country_uuid']
                        application_obj.simple_family_uuid=application_element['simple_family_uuid']
                        application_obj.description=application_element['description']
                        application_obj.status=application_element['status']
                        application_obj.docdb_number=application_element['docdb_number']
                        application_obj.date=application_element['date']
                        application_obj.updated_at=application_element['updated_at']
                        application_obj.expiration_date=application_element['expiration_date']
                        application_obj.publications=application_element['publications']
                        application_obj.priorities=application_element['priorities']
                        application_obj.pct=application_element['pct']
                        application_obj.pcts=application_element['pcts']
                        application_obj.save()

        # Update Other Simple tables
        
        if product_standardized_name_difference != []:
            if product_standardized_name != None:
                for element in product_standardized_name:
                    product_standardized_name_objs = MedspalProductStandardizedName.objects.filter(record_id=medspal_record_obj)
                    for product_standardized_name_obj in product_standardized_name_objs:
                        product_standardized_name_obj.product_standardized_name=element
                        product_standardized_name_obj.save()

        if product_brand_name_difference != []:
            if product_brand_name != None:
                for element in product_brand_name:
                    product_brand_name_objs = MedspalProductBrandName.objects.filter(record_id=medspal_record_obj)
                    for product_brand_name_obj in product_brand_name_objs:
                        product_brand_name_obj.product_brand_name=element
                        product_brand_name_obj.save()

        if originator_difference != []:
            if originator != None:
                for element in originator:
                    originator_objs = MedspalOriginator.objects.filter(record_id=medspal_record_obj)
                    for originator_obj in originator_objs:
                        originator_obj.originator=element
                        originator_obj.save()

        if exclusivity_duration_difference != []:
            if exclusivity_duration != None:
                for element in exclusivity_duration:
                    exclusivity_duration_objs = MedspalExclusivityDuration.objects.filter(record_id=medspal_record_obj)
                    for exclusivity_duration_obj in exclusivity_duration_objs:
                        exclusivity_duration_obj.exclusivity_duration=element
                        exclusivity_duration_obj.save()

        if exclusivity_started_on_difference != []:
            if exclusivity_started_on != None:
                for element in exclusivity_started_on:
                    exclusivity_started_on_objs = MedspalExclusivityStartedOn.objects.filter(record_id=medspal_record_obj)
                    for exclusivity_started_on_obj in exclusivity_started_on_objs:
                        exclusivity_started_on_obj.exclusivity_started_on=element
                        exclusivity_started_on_obj.save() 

print('total_record_count',total_record_count)
print('unchanged_record_count',unchanged_record_count)
print('updated_record_count',updated_record_count)
print('newly_created_record_count',newly_created_record_count)
summary_obj = MedspalRecordsSummary.objects.create(updated_record_ids=updated_record_ids, unchanged_record_ids = unchanged_record_ids, newly_created_record_ids = newly_created_record_ids)
summary_obj.summary_timestamp = summary_obj.summary_timestamp.isoformat()
summary = summary_obj.__dict__
summary.pop('_state')
summary['record'] = record_list
summary['total_record_count'] = total_record_count 
summary['updated_record_count'] = updated_record_count 
summary['newly_created_record_count'] = newly_created_record_count
summary['unchanged_record_count'] = unchanged_record_count

with open('medspal_record_data.json', 'w') as fp:
    json.dump(summary, fp,  indent=4)
print('***************************************************************************************')
print('Respective object ids of above counts stored in summary table in database and json file')
print('***************************************************************************************')