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

- Host (also known as endpoint URL or server name or Instance ID depending on your Cloud provider)
- Port (default is 1433)
- Username
- Password
- Schema (default is `dbo`)

The method to retrieve these values will depend on the cloud provider where your Microsoft SQL Server database or your on-premises server is hosted. You can see the below links to see how to retrieve these values based on your cloud provider:

- AWS: Connect to SQL Server running [on RDS](https://aws.amazon.com/getting-started/hands-on/create-microsoft-sql-db/)
- GCP: Connect to SQL Server running [on Cloud SQL](https://cloud.google.com/sql/docs/sqlserver/quickstarts)
- Azure: Connect to SQL Server running on [Azure SQL database](https://learn.microsoft.com/en-us/azure/azure-sql/database/connect-query-ssms?view=azuresql-mi) or [on a VM](https://learn.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/ways-to-connect-to-sql?view=azuresql-vm)

For this example, let's assume you have a Relational Data Store (RDS) running Microsoft SQL Server in AWS. In the AWS console, follow the below steps to retrieve these values:

1. Go to the [RDS service](https://console.aws.amazon.com/rds/home) in your region and select your database.
2. From the **Connectivity & security** tab, copy the **Endpoint** and **Port**.
3. Follow the instructions for Microsoft SQL server to [create a new database user](https://learn.microsoft.com/en-us/sql/relational-databases/security/authentication-access/create-a-database-user?view=sql-server-ver16). Copy the username and password somwhere safe to use in an Airflow connection.


## Create your connection

To create a SQL Server connection, follow the below mentioned steps:

1. Add the following line to your Astro project's `requirement.txt` file to install and use the package for MS SQL Server in Airflow:
    ```
    apache-airflow-providers-microsoft-mssql
    ```
2. Restart your local Airflow using `astro dev restart`. If you're not currently running Airflow locally, you can also run `astro dev start`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Microsft SQL Server** and give it a name in the **Connection Id** field.
4. Paste the values copied in [Get connections details](#get-connection-details) to the connection fields:
    - **Host**: `<my-hostname-or-my-server-ip>`
    - **Port**: `<my-port>`
    - **Login**: `<my-user>`
    - **Password**: `<my-password>`
5. Optional. If you want to connect to a specific schema, enter it's name in **Schema** field. If omitted, default schema `dbo` is assumed.
6. Click on **Test** connection to test and then **Save** the connection.

    ![azure-connection-ms-sqlserver](/img/guides/connection-ms-sql-server.png)

:::tip Important
For installing `apache-airflow-providers-microsoft-mssql` to Airflow version 2.6+, add the following to `packages.txt` and restart your Astro project.
```
build-essential
freetds-dev
libkrb5-dev
default-libmysqlclient-dev
```
:::

## How it works

Airflow uses [PyMSSQL](https://pypi.org/project/pymssql/) to connect to Microsoft SQL Server using [MsSqlhook](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-mssql/1.0.0/_api/airflow/providers/microsoft/mssql/hooks/mssql/index.html). You can also directly use the MsSqlhook to create your own custom operators.

## See also

- [Apache Airflow Microsoft provider OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-mssql/stable/index.html)
- MS SQL Server [Modules](https://registry.astronomer.io/modules?query=mssql) in Astronomer Registry
