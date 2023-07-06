---
title: "Creating a Databricks Connection"
id: databricks
sidebar_label: Databricks
description: Learn how to create a Databricks connection.
---

[Databricks](https://www.databricks.com/) is a SaaS product for data processing using Apache Spark framework. Integrating Databricks with Airflow allows users to manage their Databricks clusters, execute and monitor their databricks jobs. 

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

1. Add the following line to your Astro project's `requirement.txt` file:
    ```
    apache-airflow-providers-databricks
    ```
2. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection and select the connection type as **Databricks**.
4. Paste the value of the URL copied in step #1 of [Get Connection details](#get-your-connection-details) to the **Host** field.
5. Paste the personal access token copied in step #2 of [Get Connection details](#get-your-connection-details) to the **Password** field.
6. Click on **Test** connection to test and then **Save** the connection.

![databricks-connection](/img/guides/connection-databricks.png)

## How it works
Airflow uses Python's `requests` library to connect to Databricks using [BaseDatabricksHook](https://airflow.apache.org/docs/apache-airflow-providers-databricks/stable/_api/airflow/providers/databricks/hooks/databricks/index.html).

## See also
- [Apache Airflow Databricks provider OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-databricks/stable/index.html)
- [Databricks and Airflow integration](https://docs.astronomer.io/learn/airflow-databricks)
- [Databricks modules](https://registry.astronomer.io/modules?query=databricks) and [example DAGs](https://registry.astronomer.io/dags?limit=24&sorts=updatedAt%3Adesc&query=databricks) in Astronomer Registry
- [Orchestrate databricks jobs with Apache Airflow](https://docs.databricks.com/workflows/jobs/how-to/use-airflow-with-jobs.html)
