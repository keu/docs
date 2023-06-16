---
title: "Creating the Databricks Connection"
id: databricks
sidebar_label: Databricks
---

<head>
  <meta name="description" content="Learn how to create a Databricks Connection." />
  <meta name="og:description" content="Learn how to create a Databricks Connection." />
</head>

Databricks provides a web-based platform for working with Spark.

## Prerequisites

- Local Airflow environment using [Astro CLI](https://docs.astronomer.io/astro/cli/overview)
- A Databricks Account
- Python requirement `apache-airflow-providers-databricks` should be added to `requirements.txt`

## Get your connection details
1. Get your Databricks endpoint. This is generally the URL where you login. For example, https://dbc-75fc7ab7-96a6.cloud.databricks.com/.
2. Get your Personal Access Token, by following the instructions in [Databricks personal access token](https://docs.databricks.com/dev-tools/auth.html#databricks-personal-access-tokens-for-users). To generate a personal access token for a Service Principal, follow the instructions [here](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#manage-personal-access-tokens-for-a-service-principal).

## Create your connection
1. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as Databricks.
2. Enter the Databricks endpoint in the **Host** field and the personal access token in the **Password** field.
3. Click on **Test** connection to test and then **Save** the connection.

![databricks-connection](/img/guides/connection-databricks.png)

## How it works
Airflow uses Python `requests` library to [connect to Databricks](https://github.com/apache/airflow/blob/main/airflow/providers/databricks/hooks/databricks_base.py).

## References
- [Airflow OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-databricks/stable/index.html)
- [Orchestrate databricks jobs with Apache Airflow](https://docs.databricks.com/workflows/jobs/how-to/use-airflow-with-jobs.html)
- [Databricks and Airflow integration](https://docs.astronomer.io/learn/airflow-databricks)

