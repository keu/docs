---
title: "Creating the Microsoft SQL Server Connection"
id: ms-sql-server
sidebar_label: Microsoft SQL Server
---

<head>
  <meta name="description" content="Learn how to create a Microsoft SQL Server Connection." />
  <meta name="og:description" content="Learn how to create a Microsfot SQL Server  Connection." />
</head>

Microsoft SQL Server is a cloud-based data integration and transformation service.

## Prerequisites
- Local Airflow environment using [Astro CLI](https://docs.astronomer.io/astro/cli/overview)
- A Microsoft SQL Server database 
- Access to MS SQL Server from your Airflow environment
- Python requirement `apache-airflow-providers-microsoft-mssql` should be added to `requirements.txt`

## Get Connection details
1. Go to your Microsoft SQL Server database
2. Copy the Host or the Endpoint URL and the port (default port is 1433). 
3. Optional: Schema you want to connect to in your database
4. Get the username and password for your database. See [create a database user](https://learn.microsoft.com/en-us/sql/relational-databases/security/authentication-access/create-a-database-user?view=sql-server-ver16) for creating a new user.

## Create your connection

To create a connection, follow the below steps:

1. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as Microsft SQL Server.
2. Paste the value of endpoint URL or host in **Host** field, username in **Login** and password in **Password**
3. If port is other than 1433, paste in the **Port** field.
4. Click on **Test** connection to test and then **Save** the connection.

![azure-connection-ms-sqlserver](/img/guides/connection-ms-sql-server.png)

## How it works
Airlfow uses [PyMSSQL](https://pypi.org/project/pymssql/) to connect to Microsoft SQL Server.

## References
- [OSS Airflow docs](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-mssql/stable/index.html)
- Create SQL Server in Azure using [Azure VM](https://learn.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/create-sql-vm-portal?view=azuresql) or a [single database](https://learn.microsoft.com/en-us/azure/azure-sql/database/single-database-create-quickstart?view=azuresql&tabs=azure-portal)