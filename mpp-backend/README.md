# mpp-backend
Medicine Patent Pool - Reporting System - Backend

### Steps to setup Backend on Local Machine
1. Clone the repository and cd into it
2. Install all required packages using: `pip install -r requirements.txt`
3. Install postressql using link: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
4. Start pgadmin and create a new database
6. Configure the database name, etc. in **MPP_API\settings.py** file inside the DATABASES dictionary in NAME field, etc.
7. Place your environment variables file in MPP_API folder and specify it's name in **load_dotenv** inside **settings.py** file. eg: load_dotenv('MPP_API/.env.dev')
8. Delete all files except **__init__.py** from **api\migrations** folder (if any present) 
9. Run commands: 
- `python manage.py makemigrations api` or `python manage.py makemigrations`
- `python manage.py migrate`
10. Create superuser/admin account and keep **Role=ADMIN** when prompted -> run `python manage.py createsuperuser`
11. Go to api/namespaces/clock.py, comment out permission_classes. Call the **api/clock/** endpoint to add a quarter in the system (entire step yet to be automated). Go back and uncomment the line you just commented. You can change the quarter name to be added by going in the api\namespaces\clock.py file and changing the quarter_name in the Quarter.objects.create() command
12. Import Product List from csv file using command: `python manage.py runscript import_product_list --script-args <path_to_csv>`
13. Import Country List from csv file using command: `python manage.py runscript import_countries --script-args <path_to_csv>`
14. (Optional Step) Import Sales Report, if any, from csv using command `python manage.py runscript import_sales_report --script-args <path_to_csv> <type_of_sales_report = API or FDF>`

### Run BE:
1. Run local server using: `python manage.py runserver`
