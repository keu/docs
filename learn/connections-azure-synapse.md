---
title: "Creating an Azure Synapse connection in Airflow"
id: azure-synapse
sidebar_label: Azure Synapse
description: Learn how to create an Azure Synapse connection.
---

[Azure Synapse](https://azure.microsoft.com/en-us/products/synapse-analytics/#:~:text=Azure%20Synapse%20Analytics%20is%20an,log%20and%20time%20series%20analytics.) is an enterprise analytics service from Microsoft. Integrating Airflow with Synapse allows users to run their Spark jobs on Azure Synapse and run SQL queries in the Synapse SQL pool.

## Prerequisites
- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- A locally running [Astro project](https://docs.astronomer.io/astro/cli/get-started-cli).
- Access to a [Azure Synapse workspace](https://learn.microsoft.com/en-us/azure/synapse-analytics/get-started)
- Access to your Synapse Database from Airflow

## Get Connection details

A connection from Airflow to Azure data factory requires the following information:

- Subscription ID
- Data factory name
- Resource group name
- Application Client ID
- Tenant ID
- Client secret

1. Go to [Synapse Analytics](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Synapse%2Fworkspaces) on Azure Portal
2. Go to your workspace and copy the following
    - SQL Endpoint (Either **Dedicated** or **Serverless** whichever you want to use)
    - SQL Admin username and password
    - SQL Pool name to run queries in


- Python requirement `apache-airflow-providers-odbc` should be added to `requirements.txt`
- Install ODBC Driver to your Docker image:
  - Add the following OS-level packages to your `packages.txt`
    ```bash
      gcc
      g++
      unixodbc
      unixodbc-dev
    ```
  - Add the following to your `Dockerfile`
    ```docker
      USER root
      RUN curl https://packages.microsoft.com/keys/microsoft.asc | tee /etc/apt/trusted.gpg.d/microsoft.asc

      #Debian 11
      RUN curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list

      RUN apt-get update
      RUN ACCEPT_EULA=Y apt-get install -y msodbcsql18
      # optional: for bcp and sqlcmd
      RUN ACCEPT_EULA=Y apt-get install -y mssql-tools18
      # optional: for unixODBC development headers
      RUN apt-get install -y unixodbc-dev
      USER astro
      ## end - odbc driver install
    ```

## Get Connection details
1. Go to [Synapse Analytics](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Synapse%2Fworkspaces) on Azure Portal
2. Go to your workspace and copy the following
    - SQL Endpoint (Either **Dedicated** or **Serverless** whichever you want to use)
    - SQL Admin username and password
    - SQL Pool name to run queries in

## Create your connection

To create a connection, follow the below steps:

1. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as **ODBC**.
2. Copy your Endpoint in **Host**, name of the SQL pool in **Schema**, username in **Login**, password in **Password**.
3. Enter `1433` in **Port** and `{"Driver": "ODBC Driver 18 for SQL Server"}` in **Extra**.
4. Click on **Test** connection to test and then **Save** the connection.

<!-- ![azure-synapse](/img/guides/connection-azure-synapse.png) -->

## How it works
  - Airflow uses [PyODBC](https://github.com/mkleehammer/pyodbc) to connect to Azure Synapse

## References
- [Microsoft Reference](https://learn.microsoft.com/en-us/sql/connect/python/pyodbc/python-sql-driver-pyodbc?view=sql-server-ver16)
- [Adding Python, OS-level packages](https://docs.astronomer.io/astro/develop-project#add-python-os-level-packages-and-airflow-providers) using Astro CLI
- [Install ODBC Driver](https://learn.microsoft.com/en-us/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server?view=sql-server-ver16&tabs=debian18-install%2Calpine17-install%2Cdebian8-install%2Credhat7-13-install%2Crhel7-offline#18)