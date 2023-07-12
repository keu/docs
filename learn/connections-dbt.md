---
title: "Creating the dbt Cloud Connection"
id: dbt-cloud
sidebar_label: dbt Cloud
---

<head>
  <meta name="description" content="Learn how to create a dbt Cloud Connection." />
  <meta name="og:description" content="Learn how to create a dbt Cloud Connection." />
</head>


Databricks provides a web-based platform for working with Spark.

:::tip
If you are using `dbt-core`, you do not need a `dbt` connection. Refer to [Orchestrate dbt-core Jobs with Airflow](https://docs.astronomer.io/learn/airflow-dbt).
:::

## Prerequisites

- Local Airflow environment using [Astro CLI](https://docs.astronomer.io/astro/cli/overview)
- A dbt Cloud Account
- Python requirement `apache-airflow-providers-dbt` should be added to `requirements.txt`

## Get connection details
- You can use one of the following ways to get the API Key:
  - When using a Service Account (only available in **dbt Cloud** Enterprise or Team Plans), go to the Account Settings view of dbt Cloud, click on the Service Account tokens page and generate a new token.
  - When using a Developer Account, go to the Profile Settings view of dbt Cloud → Scroll down to the bottom of the page and copy the API Key.

See [User tokens](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens) or [Service account tokens](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens) for more details.

## Create your connection

1. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as `dbt Cloud`.
2. If your URL is default `cloud.getdbt.com`, then you skip the **Tenant** field, else insert your URL. 
3. Paste the API Key copied from dbt Cloud in the **API Token** field. If you want to use a different Account in dbt other than your default, you can fill it in the Account ID field. 
4. Click on **Test** connection to test and then **Save** the connection.

![dbtcloud](/img/guides/connection-dbt-cloud.png)

:::tip important
Please note that the dbt Connection will get successfully tested based on the Tenant and API Token only, it will not validate the Account ID. 
:::

## How it works

Airflow uses the HttpHook, which leverages Python `requests` library, to connect to dbt Cloud. See [dbtHook](https://github.com/apache/airflow/blob/main/airflow/providers/dbt/cloud/hooks/dbt.py#L160) for reference.

## References
- [Airflow OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-dbt-cloud/stable/connections.html)
- [dbt Cloud API reference](https://docs.getdbt.com/docs/dbt-cloud-apis/overview)
- [Import and export your connections in JSON or URI foramt](https://docs.astronomer.io/learn)