---
title: "Creating the Postgres Connection"
id: postgres
sidebar_label: Postgres
---

<head>
  <meta name="description" content="Learn how to create a Postgres Connection." />
  <meta name="og:description" content="Learn how to create a Postgres Connection." />
</head>


[Postgres](https://www.postgresql.org/) is a free and open-source relational database system.

## Prerequisites

- Local Airflow environment using [Astro CLI](https://docs.astronomer.io/astro/cli/overview)
- A Postgres database
- Access to Postgres database from your Airflow environment
- Postgres user with proper authorization
- Python requirement `apache-airflow-providers-postgres` should be added to `requirements.txt`

## Get connection details
- Host (the Endpoint URL for your database)
- Port (default is 5432)
- Optional: Schema you want to connect to by default. If not specified, `public` schema is used.
- Username and password. You can contact your DBA to get you these details. See [create a user](https://www.postgresql.org/docs/8.0/sql-createuser.html) and [grant role to user](https://www.postgresql.org/docs/current/sql-grant.html) for more details.

## Create your connection

1. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as **Postgres**.
2. Paste the `endpoint URL` in **Host**, username in **Login** and password in **Password**. 
3. If the port is different than 5432, then enter the port in **Port**.
4. Click on **Test** connection to test and then **Save** the connection.

![postgres-connection](/img/guides/connection-postgres.png)

## How it works

Airflow uses [psycopg2](https://pypi.org/project/psycopg2/) python library to access Postgres.

## References

- [Airflow OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-postgres/stable/index.html)
- [Airflow PostgresOperator examples | Astronomer Registry](https://registry.astronomer.io/providers/postgres/versions/latest/modules/postgresoperator)