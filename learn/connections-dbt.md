---
title: "Creating a dbt Cloud Connection"
id: dbt-cloud
sidebar_label: dbt Cloud
description: Learn how to create a Databricks connection in Airflow.
---

[dbt Cloud](https://www.getdbt.com/product/what-is-dbt/) is a SaaS product that provides SQL-first transformation workflow. Integrating dbt Cloud with Airflow allows users to trigger their dbt cloud jobs, check the status of the jobs, get the artifacts of a job.

To start running your dbt jobs on dbt Cloud using Airflow see [Integrate Airflow and dbt Cloud](airflow-dbt-cloud.md). For running your dbt core jobs using Airflow, see [Orchestrate dbt-core Jobs with Airflow](https://docs.astronomer.io/learn/airflow-dbt).

## Prerequisites

- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- A locally running [Astro project](https://docs.astronomer.io/astro/cli/get-started-cli).
- A [dbt Cloud Account](https://cloud.getdbt.com/)

## Get connection details

A connection from Airflow to dbt Cloud requires the following information:

- dbt Cloud URL
- API token
- Optional: Account ID

In your dbt Cloud UI, follow the below steps to retrieve these values:

1. Copy the URL of your dbt Cloud account. For example, it might look like 'https://cloud.getdbt.com'. It might be different based on the hosted region. See [dbt Cloud URIs](https://docs.getdbt.com/docs/cloud/manage-access/sso-overview#auth0-multi-tenant-uris) for more details.
2. If you are using a dbt Developer account, follow the [dbt documentation](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens#user-api-tokens) to get the API key of your account. Otherwise, if you are using a service account (only available in dbt Cloud Enterprise or Team Plans), follow [dbt documentation](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens#generating-service-account-tokens) to generate a new token.
3. Optional. Go to your dbt Account's settings page, then from the URL copy the account ID, which is an integer appearing after **accounts**. For example, in the URL https://cloud.getdbt.com/settings/accounts/88348, 88348 is your account ID. Please note that if you do not include this in the connection, you will still need it for passing to your dbt operator or hook.

## Create your connection

To create a dbt Cloud connection, follow the below mentioned steps:

1. Add the following line to your Astro project's `requirement.txt` file to install and use the package for Databricks in Airflow:
    ```
    apache-airflow-providers-dbt-cloud
    ```
2. Restart your local Airflow using `astro dev restart`. If you're not currently running Airflow locally, you can also run `astro dev start`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **dbt Cloud** and give it a name in the **Connection Id** field.
4. Paste the values copied from step #1 and #2 of [Get connection details](#get-connection-details) to the connection fields:
    - **Tenant**: `<my-dbt-url>`
    - **API Token**: `<my-api-token>`
5. Optional. You can use the **Account ID** field to add the ID of your dbt Account copied from step #3 of [Get connection details](#get-connection-details). If you leave this blank, you must pass the account ID to the dbt cloud operator or hook.
4. Click on **Test** connection to test and then **Save** the connection.

    ![dbtcloud](/img/guides/connection-dbt-cloud.png)

:::tip important

Please note that the dbt Connection will get successfully tested based on the **Tenant** and **API Token** only, it will not validate the Account ID. 

:::

## How it works

Airflow leverages Python's `requests` library to connect to dbt Cloud using [dbtHook](https://airflow.apache.org/docs/apache-airflow-providers-dbt-cloud/stable/_api/airflow/providers/dbt/cloud/hooks/dbt/index.html).

## See also
- [Apache Airflow dbt cloud provider OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-dbt-cloud/stable/connections.html)
- dbt Cloud [modules](https://registry.astronomer.io/modules?limit=24&sorts=updatedAt%3Adesc&query=dbt) and [example DAGs](https://registry.astronomer.io/dags?limit=24&sorts=updatedAt%3Adesc&query=dbt+cloud) in Astronomer Registry
- [Integrate Airflow and dbt Cloud](airflow-dbt-cloud.md)
- [dbt Cloud API reference](https://docs.getdbt.com/docs/dbt-cloud-apis/overview)
- [Orchestrate dbt-core Jobs with Airflow](airflow-dbt.md)