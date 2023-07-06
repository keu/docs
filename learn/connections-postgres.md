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

- Host (Endpoint URL or server name for your database)
- Port (default is 5432)
- Username 
- Password
- Schema (default is `public`)

You can retrieve these values by going to the database console and copying the Host or endpoint URL or server name from your cloud console or database manager. For this example, let's assume you have a Relational Data Store (RDS) running Postgres in AWS. In the AWS console, follow the below steps to retrieve these values:

1. Go to the [RDS service](https://us-east-2.console.aws.amazon.com/rds/home?region=us-east-2) in your region and select your database.
2. From the **Connectivity & security** tab, copy the **Endpoint** and **Port**.
3. Follow the instructions to [create a user](https://www.postgresql.org/docs/8.0/sql-createuser.html) and [grant a role to the user](https://www.postgresql.org/docs/current/sql-grant.html) that Airflow will use to connect to Postgres. Copy these values for creating the connection in the next section.
4. Optional. If you want to connect to to a specific schema, copy it's name. Otherwise, you can omit this field.

## Create your connection

To create a Postgres connection, follow the below mentioned steps:

1. Add the following line to your Astro project's `requirement.txt` file:
    ```
    apache-airflow-providers-postgres
    ```
2. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection and select the connection type as **Postgres**.
4. Paste the endpoint and port copied in step #2 of [Get connection details](#get-connection-details) in **Host** and **Port** respectively.
5. Paste the username and password copied in step #3 of [Get connection details](#get-connection-details) in **Login** and **Password** fields respectively.
4. Click on **Test** connection to test and then **Save** the connection.

![postgres-connection](/img/guides/connection-postgres.png)

## How it works

Airflow uses [psycopg2](https://pypi.org/project/psycopg2/) python library to connect to Postgres via the [PostgresHook](https://airflow.apache.org/docs/apache-airflow-providers-postgres/stable/_api/airflow/providers/postgres/hooks/postgres/index.html). You can also directly use the PostgresHook to create your own custom operators.

## See also

- [Apache Airflow providers Postgres OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-postgres/stable/index.html)
- Postgres [modules](https://registry.astronomer.io/modules?limit=24&sorts=updatedAt%3Adesc&query=postgres) and [example DAGs](https://registry.astronomer.io/dags?query=postgres) in Astronomer Registry.
