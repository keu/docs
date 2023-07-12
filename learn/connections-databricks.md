---
title: "Creating a Databricks Connection"
id: databricks
sidebar_label: Databricks
description: Learn how to create a Databricks connection.
---

[Databricks](https://www.databricks.com/) is a SaaS product for data processing using Apache Spark framework. Integrating Databricks with Airflow allows users to manage their Databricks clusters, execute and monitor their databricks jobs. 

To start running Databricks jobs using Airflow see [Databricks and Airflow integration](airflow-databricks.md).

## Prerequisites
- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- A locally running [Astro project](https://docs.astronomer.io/astro/cli/get-started-cli).
- A [Databricks Account](https://www.databricks.com/try-databricks?itm_data=NavBar-TryDatabricks-Trial#account).

## Get your connection details

A connection from Airflow to Databricks requires the following information:

- Databricks URL
- Personal access token

In your Databricks Cloud UI, follow the below steps to retrieve these values:

1. Copy the URL of your Databricks workspace where you login. For example, it might look like https://dbc-75fc7ab7-96a6.cloud.databricks.com/ or https://myorg.cloud.databricks.com/. 
2. If you want to use a personal access token for a user, follow the [Databricks documentation](https://docs.databricks.com/dev-tools/auth.html#databricks-personal-access-tokens-for-users) to generate a new token. Otherwise, to generate a personal access token for a Service Principal, follow the instructions given [here](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#manage-personal-access-tokens-for-a-service-principal). Copy the generated personal access token for use in the next step to create a connection.

## Create your connection

To create a Databricks connection, follow the below mentioned steps:

1. Open your Astro project and add the following line to your `requirement.txt` file to install and use the package for Databricks in Airflow:
    ```
    apache-airflow-providers-databricks
    ```
2. Restart your local Airflow using `astro dev restart`. If you're not currently running Airflow locally, you can also run `astro dev start`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Databricks** and give it a name in the **Connection Id** field.
4. Paste the values copied from step #1 and step #2 of [Get Connection details](#get-your-connection-details) to the connection fields:
    - **Host**: `<my-databricks-URL>`
    - **Password**: `<my-personal-access-token>`
5. Click on **Test** connection to test and then **Save** the connection.

    ![databricks-connection](/img/guides/connection-databricks.png)

## How it works
Airflow uses Python's `requests` library to connect to Databricks using [BaseDatabricksHook](https://airflow.apache.org/docs/apache-airflow-providers-databricks/stable/_api/airflow/providers/databricks/hooks/databricks/index.html).

## See also
- [Apache Airflow Databricks provider OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-databricks/stable/index.html)
- [Databricks and Airflow integration](airflow-databricks.md)
- [Databricks modules](https://registry.astronomer.io/modules?query=databricks) and [example DAGs](https://registry.astronomer.io/dags?limit=24&sorts=updatedAt%3Adesc&query=databricks) in Astronomer Registry
- [Orchestrate databricks jobs with Apache Airflow](https://docs.databricks.com/workflows/jobs/how-to/use-airflow-with-jobs.html)
