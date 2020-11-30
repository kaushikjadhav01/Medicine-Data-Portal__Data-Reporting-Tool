# Medicine Data Portal
This repository contains source code of a **prototype version** of an official project I have been working on. It is a Content Management System for a large sized pharma company which has multiple partner pharma companies. 
<br><br>
The prototype is **hosted live** on my personal free tier azure instance at: http://mpp-prototype.centralindia.cloudapp.azure.com/ Instance might be slow due to free tier limits. Use following credentails to log in and try out the prototype:
<br><br>
**Admin Credentails:**<br>
Email: admin@mpp.com Password: samplepass123
<br><br>
**Partner Credentials:**<br>
Email: abbvie@labs.com Password: samplepass123
<br><br>
## System Description and Functions
Medicine Data Portal is a data reporting tool designed by me and my team for our client – a large sized pharmaceutical company. Our client has several other pharmaceutical companies as their partners. The data portal helps communicate information and maintain records between our client company and their partners. It maintains records regarding three business reports used by the companies, namely: ***Product Development Timeline (PDT)**, **Filing Plans** and **Sales Report**. The Software Backend has two user roles, namely **Admin** and **Partner**.<br> 
Our main client can login to the portal as an Admin and add user accounts for respective partner companies. Partner companies are notified via email regarding their account creation with a link to Set Password for their account. Admin then adds a list of products and countries to the system and can assign different products and countries to their respective Partners. Product and Country List can also be imported from a csv file. Partners can then login to their newly created accounts, enter respective data for Product Development Timeline, Filing Plans and Sales Report and submit the report to Admin. Partners can also optionally send a personal message or comment to the Admin during report submission.<br> 
Admin gets notified regarding every partner’s report submission via email. Admin can then choose to Edit, Approve or Reject the reports submitted by admin and optionally send a personal message to the Partner. Partners are notified of the Admin decision via email.<br>
Admin has the privilege of viewing and downloading Consolidated PDT, Filing Plan and Sales Report of all the Approved Partners at once. Admin is also given access to a customized dashboard which shows different summaries regarding all the partners and their reports and provides business insights regarding the sales of each Product by each Partner.<br>

## Technologies Used
•	Frontend of the Data Portal is based on **ReactJS** and **NodeJS** and **Redux** has been used for consistent state behaviour.<br>
•	Backend of the Data Portal is based on **Django REST Framework** APIs.<br>
•	**PostgresSQL** has been used for database and **AWS RDS** has been used to create a cloud database server.<br>
•	**Celery** and **Rabbitmq** have been used for Task Scheduling and automating tasks like sending emails or addition of a new quarter.<br>
•	**Nginx** and **Gunicorn** have been used for load balancing of the application and the application has been dockerized using **Docker-Compose** for easy, consistent and cross platform deployment on Cloud Virtual Machine instances.<br>
•	**SendGrid** has been used for sending out official emails and **Jenkins** was used for CI/CD of the software.<br>
•	**Pytest** was also used in the initial phases for unit testing and functional testing of different software modules.<br>
•	Official version of the application has been hosted on **AWS EC2** and my personal prototype has been hosted on my personal free tier Azure instance.<br>

## Screenshots
![alt text](https://github.com/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool/blob/master/mpp-frontend/src/assets/images/dashboard_ss.png)
For Screenshots of the system, check out the Sample Use Case Documentation.pdf in this repo or <a href="https://github.com/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool/blob/master/Sample%20Use%20Case%20Documentation.pdf">click here</a>


## Authors
### Kaushik Jadhav
<ul>
<li>Github:https://github.com/kaushikjadhav01</li>
<li>Medium:https://medium.com/@kaushikjadhav01</li>
<li>LinkedIn:https://www.linkedin.com/in/kaushikjadhav01/</li>
<li>Portfolio:http://kaushikjadhav01.github.io/</li>
</ul>
