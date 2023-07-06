---
title: "Creating a BigQuery connection"
id: bigquery
sidebar_label: BigQuery
description: Learn how to create a BigQuery connection.
---

[BigQuery](https://cloud.google.com/bigquery) is Google's fully managed and serverless data warehouse. Integrating BigQuery with Airflow allows users to execute and monitor their jobs in BigQuery.

## Prerequisites
- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- A locally running [Astro project](https://docs.astronomer.io/astro/cli/get-started-cli).
- A Google Cloud Project with [BigQuery API](https://cloud.google.com/bigquery/docs/enable-transfer-service#enable-api) enabled.
- [Access](https://cloud.google.com/iam/docs/manage-access-service-accounts) to create or use IAM Service Account.

## Get Connection details

A connection from Airflow to Google BigQuery requires the following information:

- Service account name
- Service account key file
- Google Cloud Project ID

In your Google Cloud console, follow the below steps to retrieve all of these values:

1. Select your Google Cloud project and copy it's **ID**.
2. Go to the IAM page, click the **Service Accounts** tab, and create a new [service account](https://console.cloud.google.com/iam-admin/serviceaccounts/create). 
3. Follow [Google's documentation](https://cloud.google.com/iam/docs/grant-role-console) to grant [roles](https://cloud.google.com/bigquery/docs/access-control#bigquery) to your service account to access BigQuery.
4. Optional. If you are not using an external secrets manager, you can skip this step. Otherwise, configure your Astro project to use the instructions in [Setup GCP Secret Manager locally](https://docs.astronomer.io/astro/secrets-backend#set-up-gcp-secret-manager-locally) to setup Google Secret Manager for this example.
5. Optional. If you are using Workload identity to authenticate, you can skip this step. Otherwise, follow [Google's documentation](https://cloud.google.com/iam/docs/keys-create-delete#iam-service-account-keys-create-console) to add a new key file in JSON format. You should keep the service account key file secure for creating the connection.

## Create your connection

To create a GCP connection, you either need to use service account key or Workload Identity. Use any of the below methods to integrate GCP with Airflow:

1. [Use the key file contents directly in an Airflow Connection](#using-the-key-file-contents-in-airflow-ui).
2. [Mount the key key file in the Airflow container](#mounting-the-key-file-in-an-airflow-container).
3. [Store the key file contents in a secrets backend](#storing-the-key-file-in-a-secrets-backend).
4. [Use Workload Identity](#using-workload-identity). This is only possible if you are using Astro or running Airflow on Google Kubernetes Engine.

### Using the key file contents in Airflow UI

1. Add the following line to your Astro project's `requirement.txt` file:
    ```
    apache-airflow-providers-google
    ```
2. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection and select the connection type as **Google Cloud**.
3. Copy the contents of the key file downloaded in Step #4 in [Get Connection Details](#get-connection-details) and paste in the **Keyfile JSON** field. 
4. Click on **Test** connection to test and then **Save** the connection.

    ![gcp-connection-key-in-ui](/img/guides/connection-gcp-key-in-ui.png)

### Mounting the key file in an Airflow container

1. Add the following line to your Astro project's `requirement.txt` file:
    ```
    apache-airflow-providers-google
    ```
2. Copy the key file downloaded in Step #3 in [Get Connection Details](bigquery#get-connection-details) to the `include` directory of your Astro project. This will make it available to your Airflow at `/usr/local/airflow/include/my-key-file.json`.
3. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.
4. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection and select the connection type as **Google Cloud**.
5. Enter the path of the SA key file in the Airflow container to the **Keyfile Path** field. 
6. Click on **Test** connection to test and then **Save** the connection.

    ![gcp-connection-key-in-airflow-container](/img/guides/connection-gcp-key-in-airflow-container.png)

### Storing the key file in a secrets backend

You can configure an external [secrets backend in Airflow](https://airflow.apache.org/docs/apache-airflow/2.6.1/administration-and-deployment/security/secrets/secrets-backend/index.html) to store your connections and variables. For example, if you are using Google Secret Manager, you can save the contents of key file as a secret that Airflow can access. Then follow the below steps to create a connection:

1. In your Google cloud console, go to the [Secret Manager](https://console.cloud.google.com/security/secret-manager) configured in step #4 of [Get connection details](#get-connection-details). Follow the steps to [create a secret](https://cloud.google.com/secret-manager/docs/create-secret-quickstart) and upload the key file from step #3 of [Get connection details](#get-connection-details). Then, copy the ID of your GCP project and the secret name.
2. Add the following line to your Astro project's `requirement.txt` file:
    ```
    apache-airflow-providers-google
    ```
3. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.
4. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection and select the connection type as **Google Cloud**.
5. Enter the GCP project id in **Keyfile Secret Project Id** and the secret name in **Keyfile Secret Name**.
6. Click on **Test** connection to test and then **Save** the connection.

    ![gcp-connection-key-in-secret-manager](/img/guides/connection-gcp-key-in-secret-manager.png)

:::info
To configure a Secrets Backend on Astro, see [How to configure external secrets backend on Astro](https://docs.astronomer.io/astro/secrets-backend).
:::

### Using Workload identity

[Workload Identity](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity) is a GKE feature used to access Google Cloud Services. To enable workload identity for GKE clusters running OSS Airflow see [Enable Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity). 

When using Astro, Workload Identity is enabled by default. To create a connection using workfload identity, follow the below steps:

1. Add the following line to your Astro project's `requirement.txt` file:
    ```
    apache-airflow-providers-google
    ```
2. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection and select the connection type as **Google Cloud**.
4. Enter the GCP project id in the **Project Id** field and click on save.

    ![gcp-connection-using-workload-identity](/img/guides/connection-gcp-workload-identity.png)

## How it works

- Airflow uses [`python-bigquery`](https://github.com/googleapis/python-bigquery) library to connect to GCP BigQuery using [BigQueryHook](https://airflow.apache.org/docs/apache-airflow-providers-google/stable/_api/airflow/providers/google/cloud/hooks/bigquery/index.html).
- When no Key details in connection are provided, Google defaults to using [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials).

## See also

- [Apache Airflow Google provider OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-google/stable/connections/gcp.html)
- BigQuery [Modules](https://registry.astronomer.io/modules?query=bigquery) and [Example DAGs](https://registry.astronomer.io/dags?limit=24&sorts=updatedAt%3Adesc&query=bigquery) in Astronomer Registry
- What are [Service accounts](https://cloud.google.com/docs/authentication#service-accounts)?