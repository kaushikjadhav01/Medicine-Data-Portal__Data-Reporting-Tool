[![DOI](https://zenodo.org/badge/316682135.svg)](https://zenodo.org/doi/10.5281/zenodo.10421266)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/Medicine-Data-Portal__Data-Reporting-Tool/blob/master/LICENSE)
[![Code Coverage](https://codecov.io/gh/NCSU-Fall-2022-SE-Project-Team-11/XpensAuditor---Group-11/branch/main/graphs/badge.svg)](https://codecov.io)
![GitHub contributors](https://img.shields.io/badge/Contributors-1-brightgreen)
[![Documentation Status](https://readthedocs.org/projects/ansicolortags/badge/?version=latest)](https://github.com/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool/edit/master/README.md)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool)
![GitHub issues](https://img.shields.io/github/issues/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool)
![GitHub closed issues](https://img.shields.io/github/issues-closed/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool.svg)](https://img.shields.io/github/repo-size/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool.svg)
[![GitHub last commit](https://img.shields.io/github/last-commit/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool)](https://github.com/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool/commits/master)
![GitHub language count](https://img.shields.io/github/languages/count/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool)
[![Commit Acitivity](https://img.shields.io/github/commit-activity/m/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool)](https://github.com/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool)
[![Code Size](https://img.shields.io/github/languages/code-size/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool)](mpp-backend)
![GitHub forks](https://img.shields.io/github/forks/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool?style=social)
![GitHub stars](https://img.shields.io/github/stars/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool?style=social)

# Medicine Data Portal
This repository contains source code of a **prototype version** of an official project I have worked on. It is a Data Reporting Portal for a large sized pharma company which has multiple partner pharma companies.
<br><br>
**URL:** The prototype is **hosted live** on my personal Free Tier AWS instance at: http://mdp.kajadhav.me

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#system-description-and-functions">System Description and Functions</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#authors">Authors</a></li>
    <li><a href="#links">Links</a></li>
  </ol>
</details>

## System Description and Functions
![alt text](https://github.com/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool/blob/master/screenshots/dashboard_ss.png)
For more **Screenshots**, refer to the **Sample Use Case Documentation** of this repo or <a href ="https://github.com/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool/blob/master/Sample%20Use%20Case%20Documentation.pdf">click here</a><br/><br/>
Medicine Data Portal is a data reporting tool designed by me and my team for our client – a large sized pharmaceutical company. Our client has several other pharmaceutical companies as their partners. The data portal helps communicate information and maintain records between our client company and their partners. It maintains records in three business reports used by the companies, namely: **Product Development Timeline (PDT)**, **Filing Plans** and **Sales Report**. The Software Backend has two user roles, namely **Admin** and **Partner**.

1. Thousands of Partner companiess can simultaneously Create, Retrieve, Update and Delete millions of records in three business reports: PDT, Filing Plans and Sales Report.
2. Partners can Create, Retrieve, Update and Delete their profile information.
3. Admins can Create, Retrieve, Update and Delete Partners, Products and Country list and each Partner's PDT, Filing Plans and Sales Report. 
4. Partners can submit their PDT, Filing Plans and Sales Report for approval.
5. Admin can Approve or Reject PDT, Filing Plans and Sales Report.
6. Admins and Partners can talk to each other via real time chat.
7. Admins and Partners get emails about report approvals or rejections and general emails like forgot password, etc.
8. Admins can also see consolidated PDT, Filing Plans and Sales Report of all partners and filter and sort them by different columns.
9. Admins and Partners can download all reports they see to csv files and also copy paste records into the portal from csv files.
10. Admin is also given access to a customized dashboard which shows different summaries regarding all the partners and their reports and provides business insights regarding the sales of each Product by each Partner.<br><br>


## Built With
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![postgresql](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![django](https://img.shields.io/badge/Django-20232A?style=for-the-badge&logo=django&logoColor=white)
![nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![react](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![aws](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![docker](https://img.shields.io/badge/Docker-006699?style=for-the-badge&logo=docker&logoColor=white)
![kubernetes](https://img.shields.io/badge/Kubernetes-0066cc?style=for-the-badge&logo=kubernetes&logoColor=white)
![jenkins](https://img.shields.io/badge/Jenkins-cc6600?style=for-the-badge&logo=jenkins&logoColor=white)
![gunicorn](https://img.shields.io/badge/Gunicorn-ff3399?style=for-the-badge&logo=graphql&logoColor=white)
![nginx](https://img.shields.io/badge/Nginx-009900?style=for-the-badge&logo=nginx&logoColor=white)
![redis](https://img.shields.io/badge/Redis-cc0000?style=for-the-badge&logo=redis&logoColor=white)
![celery](https://img.shields.io/badge/Celery-66ff66?style=for-the-badge&logo=celery&logoColor=white)
![html](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![css](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![jquery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)

## Installation
1. Install ```Git```, ```Docker``` and ```docker-compose```.
2. Clone the repo and ```cd``` into it.
3. Set appropriate AWS EC2 and RDS creds in ```.env``` files.
4. Run ```sudo docker-compose up -d```.

## Authors
### Kaushik Jadhav
<ul>
<li>Github:https://github.com/kaushikjadhav01</li>
<li>Medium:https://medium.com/@kaushikjadhav01</li>
<li>LinkedIn:https://www.linkedin.com/in/kaushikjadhav01/</li>
<li>Portfolio:http://kaushikjadhav01.github.io/</li>
</ul>


## Links

* [Web site](http://mdp.kajadhav.me/)
* [Documentation](https://github.com/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool/blob/master/Sample%20Use%20Case%20Documentation.pdf)
* [Issue tracker](https://github.com/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool/issues)
* [Source code](https://github.com/kaushikjadhav01/Medicine-Data-Portal__Data-Reporting-Tool)
