---
title: "Creating a BigQuery connection"
id: bigquery
sidebar_label: BigQuery
description: Learn how to create a BigQuery connection.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[BigQuery](https://cloud.google.com/bigquery) is Google's fully managed and serverless data warehouse. Integrating BigQuery with Airflow allows users to execute and monitor their jobs in BigQuery. 

There are multiple ways to connect Airflow and BigQuery, all relying a [GCP Service Account](https://cloud.google.com/docs/authentication#service-accounts). You can choose one depending on your use-case or security settings:

1. Use the contents of a service account key file directly in an Airflow Connection.
2. Mount the service account key file to Airflow containers.
3. Store the contents of a service account key file in a secrets backend.
4. Use Kubernetes service account to integrate Airflow and BigQuery. This is only possible if you are using Astro or running Airflow on Google Kubernetes Engine.

Astronomer recommends to use Kubernetes service account, if possible, as it is the most secure method which does not require any secret to be saved either in Airflow's metadata database or on disk or in a secrets backend. If not, you can configure a secrets backend to store contents of your service account key file.

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

<Tabs
    defaultValue="key-file-value"
    groupId= "bigquery-connection"
    values={[
        {label: 'Key file value', value: 'key-file-value'},
        {label: 'Key file in container', value: 'key-file-in-container'},
        {label: 'Key file in secrets backend', value: 'key-file-in-secrets-backend'},
        {label: 'Kubernetes service account', value: 'kubernetes-service-account'}
    ]}>

<TabItem value="key-file-value">

This method requires you to save the contents of your service account key file in your Airflow connection. 

In your Google Cloud console, follow the below steps to retrieve the required values:

1. Select your Google Cloud project and copy it's **ID**.
2. Go to the IAM page, click the **Service Accounts** tab, and follow Google's documentation to [create a new service account](https://console.cloud.google.com/iam-admin/serviceaccounts/create). 
3. Follow Google's documentation to [grant roles](https://cloud.google.com/iam/docs/grant-role-console) to your service account to access BigQuery. See [BigQuery roles](https://cloud.google.com/bigquery/docs/access-control#bigquery) for list of available roles and the permissions.
4. Follow Google's documentation to [add a new key file](https://cloud.google.com/iam/docs/keys-create-delete#iam-service-account-keys-create-console) to the service account in JSON format.
5. Copy the contents of the new key file to [create an Airflow connection](#create-your-connection).

</TabItem>

<TabItem value="key-file-in-container">

This method requires you to mount your service account key file to your Airflow containers.

In your Google Cloud console, follow the below steps to retrieve the required values:

1. Select your Google Cloud project and copy it's **ID**.
2. Go to the IAM page, click the **Service Accounts** tab, and follow Google's documentation to [create a new service account](https://console.cloud.google.com/iam-admin/serviceaccounts/create). 
3. Follow Google's documentation [to grant roles](https://cloud.google.com/iam/docs/grant-role-console) to your service account to access BigQuery. See [BigQuery roles](https://cloud.google.com/bigquery/docs/access-control#bigquery) for list of available roles and the permissions.
4. Follow Google's documentation [to add a new key file](https://cloud.google.com/iam/docs/keys-create-delete#iam-service-account-keys-create-console) to the service account in JSON format.
5. Download the key file to your local computer to mount it to Airflow containers for [creating a connection](#create-your-connection).

</TabItem>

<TabItem value="key-file-in-secrets-backend">

This method requires you to save the contents of your service account key file to a secrets backend of your choice. For this example, let's assume Google Secret Manager as the secrets backend for our local Airflow. See [configure a secrets backend](https://docs.astronomer.io/astro/secrets-backend) for detailed instructions.

In your Google Cloud console, follow the below steps to retrieve all of these values:

1. Select your Google Cloud project and copy it's **ID**.
2. Go to the IAM page, click the **Service Accounts** tab, and follow Google's documentation to [create a new service account](https://console.cloud.google.com/iam-admin/serviceaccounts/create). 
3. Follow Google's documentation [to grant roles](https://cloud.google.com/iam/docs/grant-role-console) to your service account to access BigQuery. See [BigQuery roles](https://cloud.google.com/bigquery/docs/access-control#bigquery) for list of available roles and the permissions.
4. Follow Google's documentation [to add a new key file](https://cloud.google.com/iam/docs/keys-create-delete#iam-service-account-keys-create-console) to the service account in JSON format.
5. Download the key file to your local computer to use it in Google's Secret Manager in the next step.
6. Follow the steps in [Google's documentation to create a secret](https://cloud.google.com/secret-manager/docs/create-secret-quickstart) in Google Secret Manager and upload the key file from step #5 as a secret value. Then, copy the ID of your secret name.
7. Then, use the instructions in [Setup Google Cloud Secret Manager](https://docs.astronomer.io/astro/secrets-backend?tab=gcp#setup) to configure Google Secret Manager as an external secrets backend for your Astro project.

:::tip

Please note in this method we use a secrets backend not just to store Airflow connections and variables, but also the other secrets like a service account key file. This key file secret can in turn can be used in an Airflow connection. 

This method is very useful if you do not want to store multiple copies of the same service account key file.

:::


</TabItem>

<TabItem value="kubernetes-service-account">

[Kubernetes service account](https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/) provides an identity to the processes running in a Pod. The process running inside a Pod can use this identity of its associated service account to authenticate cluster's API server. This is also referred to as Workload identity in [GCP](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity) and [Azure](https://learn.microsoft.com/en-us/azure/aks/learn/tutorial-kubernetes-workload-identity).

This method cannot be used in local Airflow environment. It is available to use with Airflow on Astro or OSS Airflow running on Kubernetes clusters. 

When using [Airflow on Astro](https://docs.astronomer.io/astro/trial), Workload Identity is enabled by default and no additional setup is required. Please follow the instructions for [GCP](https://docs.astronomer.io/astro/connect-gcp?tab=Workload%20Identity#authentication-options) or [AWS](https://docs.astronomer.io/astro/connect-aws#authorization-options) to grant access to your Airflow Deployment to connect to BigQuery on Astro. 

For this example, let's assume, you are running Airflow in a GKE cluster. In your Google Cloud console, follow the below steps to get the required information:

1. Select your Google Cloud project where you are running BigQuery and copy it's **ID**.
2. Follow Google's documentation to [enable workload identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity) and [to configure Airflow to use workload identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#authenticating_to). Copy the Kubernetes service account based on these steps. 
3. Then, go to the IAM page, click the **Service Accounts** tab, and search the service account created in step #2 above. If you do not see your service account, go to **IAM**, then click on **+ADD** to add your service principal to this project.
4. Now, follow Google's documentation [to grant roles](https://cloud.google.com/iam/docs/grant-role-console) to your service account to access BigQuery. See [BigQuery roles](https://cloud.google.com/bigquery/docs/access-control#bigquery) for list of available roles and the permissions.

</TabItem>

</Tabs>

## Create your connection

<Tabs
    defaultValue="key-file-value"
    groupId= "bigquery-connection"
    values={[
        {label: 'Key file value', value: 'key-file-value'},
        {label: 'Key file in container', value: 'key-file-in-container'},
        {label: 'Key file in secrets backend', value: 'key-file-in-secrets-backend'},
        {label: 'Kubernetes service account', value: 'kubernetes-service-account'}
    ]}>

<TabItem value="key-file-value">

Follow the below steps to create a connection:

1. Open your Astro project and add the following line to your `requirement.txt` file to install and use the package for Google Cloud in Airflow:

    ```
    apache-airflow-providers-google
    ```

2. Restart your local Airflow using `astro dev restart`. If you're not currently running Airflow locally, you can also run `astro dev start`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Google Cloud** and give it a name in the **Connection Id** field.
4. Paste the value of the key file copied in step #4 of [Get connection details](#get-connection-details) in the connection fields:
    - **Keyfile JSON**: `<mykeyfile-json>`
5. Click on **Test** connection to test and then **Save** your connection.

    ![gcp-connection-key-in-ui](/img/guides/connection-gcp-key-in-ui.png)

</TabItem>

<TabItem value="key-file-in-container">

Follow the below steps to create a connection:

1. Open your Astro project and add the following line to your `requirement.txt` file to install and use the package for Google Cloud in Airflow:
    ```
    apache-airflow-providers-google
    ```
2. Copy the key file downloaded in Step #5 in [Get Connection Details](bigquery#get-connection-details) to the `include` directory of your Astro project. This will make it available to your Airflow at `/usr/local/airflow/include/<my-key-file.json>`.
3. Restart your local Airflow using `astro dev restart`. If you're not currently running Airflow locally, you can also run `astro dev start`.
4. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Google Cloud** and give it a name in the **Connection Id** field.
5. Paste the path of the service account key file in the Airflow container in the connection field:
    - **Keyfile Path**: `/usr/local/airflow/include/<my-key-file.json>`
6. Click on **Test** connection to test and then **Save** your connection.

    ![gcp-connection-key-in-airflow-container](/img/guides/connection-gcp-key-in-airflow-container.png)

</TabItem>

<TabItem value="key-file-in-secrets-backend">

Follow the below steps to create a connection:

1. Open your Astro project and add the following line to your `requirement.txt` file to install and use the package for Google Cloud in Airflow:
    ```
    apache-airflow-providers-google
    ```
2. Restart your local Airflow using `astro dev restart`. If you're not currently running Airflow locally, you can also run `astro dev start`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Google Cloud** and give it a name in the **Connection Id** field.
4. Paste the GCP project ID copied in step #1 and secret name from step #6 of [Get connection details](#get-connection-details) in the connection fields:
    - **Keyfile Secret Project Id**: `<gcp-project-id>`
    - **Keyfile Secret Name**: `<keyfile-secret-name>`
5. Click on **Test** connection to test and then **Save** your connection.

    ![gcp-connection-key-in-secret-manager](/img/guides/connection-gcp-key-in-secret-manager.png)

:::info
To configure a Secrets Backend on Astro, see [How to configure external secrets backend on Astro](https://docs.astronomer.io/astro/secrets-backend).
:::

</TabItem>

<TabItem value="kubernetes-service-account">

To create a connection using workfload identity, follow the below steps:

1. Login to your Airflow UI
2. Go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Google Cloud** and give it a name in the **Connection Id** field.
3. Paste the GCP project ID copied in step #1 of [Get connection details](#get-connection-details) to the connection field:
    - **Project Id**: `<project-id>`
4. Click on **Save** to save your connection.

    ![gcp-connection-using-workload-identity](/img/guides/connection-gcp-workload-identity.png)


</TabItem>

</Tabs>

## How it works

- Airflow uses [`python-bigquery`](https://github.com/googleapis/python-bigquery) library to connect to GCP BigQuery using [BigQueryHook](https://airflow.apache.org/docs/apache-airflow-providers-google/stable/_api/airflow/providers/google/cloud/hooks/bigquery/index.html).
- When no Key details in connection are provided, Google defaults to using [Application Default Credentials (ADC)](https://cloud.google.com/docs/authentication/application-default-credentials). This means when you use Workload Identity to connect to BigQuery, Airflow relies on ADC to authenticate.

## See also

- [Apache Airflow Google provider OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-google/stable/connections/gcp.html)
- BigQuery [Modules](https://registry.astronomer.io/modules?query=bigquery) and [Example DAGs](https://registry.astronomer.io/dags?limit=24&sorts=updatedAt%3Adesc&query=bigquery) in Astronomer Registry
- [Configure a secrets backend](https://docs.astronomer.io/astro/secrets-backend) to store your Airflow connections.