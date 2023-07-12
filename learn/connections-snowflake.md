---
title: "Creating a Snowflake Connection"
id: snowflake
sidebar_label: Snowflake
description: Learn how to create a Snowflake connection in Airflow.
---

[Snowflake](https://www.snowflake.com/en/) is a cloud data warehouse to store and analyze your data. Integrating Snowflake with Airflow allows users to interact with Snowflake by running SQL, monitoring the status of a SQL, running a SnowPark python function. It will allow the users to export or load the data to/from Snowflake.

To run Snowflake queries using Airflow see [Orchestrate Snowflake Queries with Airflow](airflow-snowflake.md).

## Prerequisites

- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- A locally running [Astro project](https://docs.astronomer.io/astro/cli/get-started-cli).
- [Snowflake account](https://signup.snowflake.com/).

## Get Connection details

A connection from Airflow to Snowflake requires the following information:

- Host
- Account
- Region
- Role
- Database
- Warehouse
- Username
- Password

In your Snowflake console, follow the below instructions to retrieve these values:

1. If you are in the new Snowsight console (Snowsight's URL begins with `https://app.snowflake.com`), you will see your alphanumeric account ID in the bottom left corner. You can click on the account id, and hover over it's name to see the details and then click on the link icon to copy the account URL. Otherwise, if you are in Snowflake classic console, you can copy your URL. Your copied URL will look like `https://<account-ID>.<region>.snowflakecomputing.com/`. 
2. From the URL, copied in step #1, copy your `account-id` and `region`. 
3. Select and copy the role you want to use in the Airflow connection.
4. Copy the name of the warehouse, database and schema you want to use for the connection.
5. If you do not want to use an existing user, follow the Snowflake documentation, to [create a user](https://docs.snowflake.com/en/sql-reference/sql/create-user) for Airflow to connect to Snowflake. Copy the username and password to use in Airflow connection.

## Create your connection

To create a Snowflake connection, follow the below mentioned steps to create the connection:

1. Open your Astro project and add the following line to your `requirement.txt` file to install and use the package for Amazon Redshift in Airflow:
    ```
    apache-airflow-providers-snowflake
    ```
2. Restart your local Airflow using `astro dev restart`. If you're not currently running Airflow locally, you can also run `astro dev start`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Snowflake** and give it a name in the **Connection Id** field.
4. Paste the values copied in [Get connection details](#get-connection-details) for your Snowflake account to the connection fields:
    - **Schema**: `<my-schema>`
    - **Login**: `<my-user>`
    - **Password**: `<my-password>`
    - **Account**: `<my-account>`
    - **Warehouse**: `<my-warehouse>`
    - **Database**: `<my-database>`
    - **Region**: `<my-region>`
    - **Role**: `<my-role>`

5. Click on **Test** connection to test and then **Save** the connection.

    ![snowflake-connection-extra](/img/guides/connection-snowflake-extra.png)

For GCP, Snowflake connection region might look different as shown in screenshot below:

![snowflake-connection-extra](/img/guides/connection-snowflake-gcp.png)

## How it works

Airflow uses the python package [Snowflake connector](https://github.com/snowflakedb/snowflake-connector-python) to connect to Snowflake via the [SnowflakeHook](https://airflow.apache.org/docs/apache-airflow-providers-snowflake/stable/_api/airflow/providers/snowflake/hooks/snowflake/index.html).

## See also

- [Apache Airflow Snowflake provider OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-snowflake/stable/connections/snowflake.html).
- [Modules](https://registry.astronomer.io/modules?limit=24&sorts=updatedAt%3Adesc&query=snowflake) and [Example DAGs](https://registry.astronomer.io/dags?query=snowflake) in Astronomer Registry.
- [Orchestrate Snowflake Queries with Airflow](airflow-snowflake.md).
- [Run Snowpark queries with the ExternalPythonOperator in Apache Airflow](external-python-operator.md)