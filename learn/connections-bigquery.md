---
title: "Creating the BigQuery Connection"
id: bigquery
sidebar_label: BigQuery
---

<head>
  <meta name="description" content="Learn how to create the BigQuery Connection." />
  <meta name="og:description" content="Learn how to create the BigQuery Connection." />
</head>

BigQuery is Google's fully managed and serverless data warehouse.

## Prerequisites
- Local Airflow environment using [Astro CLI](https://docs.astronomer.io/astro/cli/overview)
- A Google Cloud Project with BigQuery API enabled. See [Create a project and enable BigQuery API](https://cloud.google.com/bigquery/docs/enable-transfer-service#enable-api) for details.
- An IAM Service Account. If you do not have a Service Account, see [Create a new Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts/create).
- READ or WRITE access to your Service Account. See [BigQuery Access Control](https://cloud.google.com/bigquery/docs/access-control) and [Grant Role using Console](https://cloud.google.com/iam/docs/grant-role-console) for more details.
- Python requirement `apache-airflow-providers-google` should be added to `requirements.txt`

## Get Connection details
1. In your GCP console, go to **IAM** page and then **Service Accounts**. 
2. Find your Service Account, and create new key pair in JSON format.
3. Your Key file in JSON format will be downloaded. We will copy it to create Google Cloud connection as explained in the steps below.

See [Create Service Account Key](https://cloud.google.com/iam/docs/keys-create-delete#iam-service-account-keys-create-console) for step-by-step process.

## Create your connection

To create a GCP connection, you either need to use Service Account key or Workload Identity. Use any of the below methods to integrate GCP with Airflow:

1. Use the Key file contents directly in the Airflow Connection.
2. Mount the Key key file in the Airflow container.
3. Store the Ky file contents in a Secrets Backend.
4. Use Workload Identity. This is only possible if you are using Astro or Airflow on Google Kubernetes Engine.

### Key file contents in Airflow UI

1. Copy the contents of the SA key file downloaded in Step #3 in [Get Connection Details](bigquery#get-connection-details).
2. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as Google Cloud.
3. Enter the contents of SA in **Keyfile JSON** field. 
4. Click on **Test** connection to test and then **Save** the connection.

![gcp-connection-key-in-ui](/img/guides/connection-gcp-key-in-ui.png)

### Mount Key file in Airflow container

1. Mount the SA key file downloaded in Step #3 in [Get Connection Details](bigquery#get-connection-details) to your Airflow Container.
2. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as Google Cloud.
3. Enter the path of the SA key file in the Airflow container to the **Keyfile Path** field. 
4. Click on **Test** connection to test and then **Save** the connection.

![gcp-connection-key-in-ui](/img/guides/connection-gcp-key-in-ui.png)

### Key file in Secret Manager

:::info
To configure a Secrets Backend, see [Configure Secrets Backend on Airflow](https://airflow.apache.org/docs/apache-airflow/2.6.1/administration-and-deployment/security/secrets/secrets-backend/index.html) and [How to configure external secrets backend on Astro](astro/secrets-backend). 
:::

You can configure an external Secrets Backend in Airflow to store your connections and variables. For example, if you are using Google Secret Manager, you can save the contents of SA key file as a secret that Airflow can access. Then follow the below steps to create a connection:

1. Follow the steps to [create a secret](https://cloud.google.com/secret-manager/docs/create-secret-quickstart) in Google Secret Manager. 
2. Copy the name of your GCP project and the secret name.
3. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as Google Cloud.
4. Enter the GCP project id in **Keyfile Secret Project Id** and the secret name in **Keyfile Secret Name**.
5. Click on **Test** connection to test and then **Save** the connection.

![gcp-connection-key-in-secret-manager](/img/guides/connection-gcp-key-in-secret-manager.png)

### Using Workload Identity

[Workload Identity](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity) is a GKE feature used to access Google Cloud Services. To enable workload identity for GKE clusters running OSS Airflow see [Enable Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity). 

When using Astro, Workload Identity is enabled by default. To allow tasks running on Astro access to BigQuery, follow these steps:

1. Ensure the Service Account associated with the Workload Identity has the permission to use BigQuery. See [Grant role to Service Account](https://cloud.google.com/iam/docs/manage-access-service-accounts#single-role) for details.
2. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as Google Cloud.
3. Enter the GCP project id in the **Project Id** field and click on save.

![gcp-connection-using-workload-identity](/img/guides/connection-gcp-workload-identity.png)

## How it works

- Airflow uses [`python-bigquery`](https://github.com/googleapis/python-bigquery) library to connet to GCP BigQuery.
- When no Key details in connection are provided, Google defaults to using [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials).

## References

- [OSS Airflow docs](https://airflow.apache.org/docs/apache-airflow-providers-google/stable/connections/gcp.html)
- [Python Client for Google BigQuery](https://github.com/googleapis/python-bigquery)
- What are [Service Accounts](https://cloud.google.com/docs/authentication#service-accounts)?