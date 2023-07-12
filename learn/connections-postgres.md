---
title: "Creating a Postgres Connection"
id: postgres
sidebar_label: Postgres
description: Learn how to create a Postgres connection in Airflow.
---

[Postgres](https://www.postgresql.org/) is a free and open-source relational database system. Integrating Postgres with Airflow will allow users to interact with the database, run queries, export the data to and from the database.

## Prerequisites

- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- A locally running [Astro project](https://docs.astronomer.io/astro/cli/get-started-cli).
- A Postgres database running on-premises or in cloud.
- Access to Postgres database from your local Airflow environment

## Get connection details

A connection from Airflow to Postgres requires the following information:

- Host (also known as endpoint URL or server name or instance ID)
- Port (default is 5432)
- Username 
- Password
- Schema (default is `public`)

The method to retrieve these values will depend on the cloud provider where your Postgres database is hosted. You can see the below links to see how to retrieve these values based on your cloud provider:

- AWS: Connect to Postgres running [on RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html)
- GCP: Connect to Postgres running [on Cloud SQL](https://cloud.google.com/sql/docs/postgres/connect-instance-local-computer)
- Azure: Connect to Postgres running on [Azure database](https://learn.microsoft.com/en-us/training/modules/create-connect-to-postgres/4-connect-develop-your-database)

For this example, let's assume you have a Relational Data Store (RDS) running Postgres in AWS. In the AWS console, follow the below steps to retrieve these values:

1. Go to the [RDS service](https://us-east-2.console.aws.amazon.com/rds/home?region=us-east-2) in your region and select your database.
2. From the **Connectivity & security** tab, copy the **Endpoint** and **Port**.
3. Follow the instructions to [create a user](https://www.postgresql.org/docs/8.0/sql-createuser.html) and [grant a role to the user](https://www.postgresql.org/docs/current/sql-grant.html) that Airflow will use to connect to Postgres. Copy these values for creating the connection in the next section.
4. Optional. If you want to connect to to a specific schema, copy it's name. Otherwise, you can omit this field.

## Create your connection

To create a Postgres connection, follow the below mentioned steps:

1. Add the following line to your Astro project's `requirement.txt` file to install and use the package for Postgres in Airflow:
    ```
    apache-airflow-providers-postgres
    ```
2. Restart your local Airflow using `astro dev restart`. If you're not currently running Airflow locally, you can also run `astro dev start`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Postgres** and give it a name in the **Connection Id** field.
4. Paste the values copied in [Get connection details](#get-connection-details) to the connection fields:
    - **Host**: `<my-hostname-or-my-server-ip>`
    - **Port**: `<my-port>`
    - **Login**: `<my-user>`
    - **Password**: `<my-password>`
5. Optional. If you want to connect to a specific schema, enter it's name in **Schema** field. If omitted, default schema `public` is assumed.
6. Click on **Test** connection to test and then **Save** the connection.

    ![postgres-connection](/img/guides/connection-postgres.png)

## How it works

Airflow uses [psycopg2](https://pypi.org/project/psycopg2/) python library to connect to Postgres using the [PostgresHook](https://airflow.apache.org/docs/apache-airflow-providers-postgres/stable/_api/airflow/providers/postgres/hooks/postgres/index.html). You can also directly use the PostgresHook to create your own custom operators.

## See also

- [Apache Airflow providers Postgres OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-postgres/stable/index.html)
- Postgres [modules](https://registry.astronomer.io/modules?limit=24&sorts=updatedAt%3Adesc&query=postgres) and [example DAGs](https://registry.astronomer.io/dags?query=postgres) in Astronomer Registry.
