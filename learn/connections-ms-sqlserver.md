---
title: "Creating a Microsoft SQL Server Connection"
id: ms-sql-server
sidebar_label: Microsoft SQL Server
description: Learn how to create a Microsoft SQL Server connection in Airflow.
---

[Microsoft SQL Server](https://www.microsoft.com/en-in/sql-server/sql-server-downloads) is a proprietary relational database management system developed by Microsoft. Integrating SQL Server with Airflow allows users to interact with the database or export the data from SQL server to an external system.


## Prerequisites

- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- A locally running [Astro project](https://docs.astronomer.io/astro/cli/get-started-cli).
- A Microsoft SQL Server database hosted in cloud or on-premises.
- Ensure the SQL Server database is reachable from your local Airflow environment.

## Get Connection details

A connection from Airflow to Microsoft SQL Server requires the following information:

- Host (endpoint URL or server name)
- Port (default is 1433)
- Username
- Password
- Optional. Schema

You can retrieve these values by going to the database console and copying the Host or endpoint URL or server name from your cloud console or database manager. For this example, let's assume you have a Relational Data Store (RDS) running Microsoft SQL Server in AWS. In the AWS console, follow the below steps to retrieve these values:

1. Go to the [RDS service](https://us-east-2.console.aws.amazon.com/rds/home?region=us-east-2) in your region and select your database.
2. From the **Connectivity & security** tab, copy the **Endpoint** and **Port**.
3. Follow the instructions for Microsoft SQL server to [create a new database user](https://learn.microsoft.com/en-us/sql/relational-databases/security/authentication-access/create-a-database-user?view=sql-server-ver16).


## Create your connection

To create a SQL Server connection, follow the below mentioned steps:

1. Add the following line to your Astro project's `requirement.txt` file:
    ```
    apache-airflow-providers-microsoft-mssql
    ```
2. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection and select the connection type as **Microsft SQL Server**.
4. Paste the value of URI copied in step #2 of [Get connections details](#get-connection-details) in the **Host** field.
5. If port is other than 1433, paste in the **Port** field.
6. Paste the values of username in **Login** and password in **Password** copied in step #3 of [Get connections details](#get-connection-details).
7. Click on **Test** connection to test and then **Save** the connection.

![azure-connection-ms-sqlserver](/img/guides/connection-ms-sql-server.png)

:::tip Important
For installing `apache-airflow-providers-microsoft-mssql` to Airflow version 2.6+, add the following to `packages.txt`.
```
build-essential
freetds-dev
libkrb5-dev
default-libmysqlclient-dev
```
:::

## How it works

Airflow uses [PyMSSQL](https://pypi.org/project/pymssql/) to connect to Microsoft SQL Server.

## See also

- [Apache Airflow Microsoft provider OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-mssql/stable/index.html)
- [Create an Microsoft SQL Server DB instance in AWS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.SQLServer.html)
- MS SQL Server [Modules](https://registry.astronomer.io/modules?query=mssql) in Astronomer Registry