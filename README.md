# Medicine Data Portal
This repository contains source code of a **prototype version** of an official project I have been working on. It is a Content Management System for a large sized pharma companies which has multiple partner pharma companies. 
<br><br>
The prototype is **hosted live** on my free tier azure instance at: http://mpp-prototype.centralindia.cloudapp.azure.com/ Instance might be slow due to free tier limits. Use following credentails to log in and try out the prototype:
<br><br>
**Admin Credentails:**<br>
Email: admin@mpp.com Password: samplepass123
<br><br>
**Partner Credentials:**<br>
Email: abbvie@labs.com Password: samplepass123
<br><br>

### Technologies Used
•	Frontend of the Data Portal is based on **ReactJS** and **NodeJS** and **Redux** has been used for consistent state behaviour.<br>
•	Backend of the Data Portal is based on **Django REST Framework** APIs.<br>
•	**PostgresSQL** has been used for database and **AWS RDS** has been used to create a cloud database server.<br>
•	**Celery** and **Rabbitmq** have been used for Task Scheduling and automating tasks like sending emails or addition of a new quarter.<br>
•	**Nginx** and **Gunicorn** have been used for load balancing of the application and the application has been dockerized using **Docker-Compose** for easy, consistent and cross platform deployment on Cloud Virtual Machine instances.<br>
•	**SendGrid** has been used for sending out official emails and **Jenkins** was used for CI/CD of the software.<br>
•	**Pytest** was also used in the initial phases for unit testing and functional testing of different software modules.<br>
•	Official version of the application has been hosted on **AWS EC2** and my personal prototype has been hosted on my personal free tier Azure instance.<br>

### Screenshots
For Screenshots of the system, check out the Sample Use Case Documentation.pdf in this repo or <a href="https://github.com/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool/blob/master/Sample%20Use%20Case%20Documentation.pdf">click here</a>


# Authors
## Kaushik Jadhav
<ul>
<li>Github:https://github.com/kaushikjadhav01</li>
<li>Medium:https://medium.com/@kaushikjadhav01</li>
<li>LinkedIn:https://www.linkedin.com/in/kaushikjadhav01/</li>
<li>Portfolio:http://kaushikjadhav01.github.io/</li>
</ul>
