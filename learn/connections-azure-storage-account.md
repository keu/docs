---
title: "Creating the Azure Storage Account Connection"
id: azure-storage-account
sidebar_label: Azure Storage Account
---

<head>
  <meta name="description" content="Learn how to create the Azure Storage Account Connection." />
  <meta name="og:description" content="Learn how to create the Azure Storage Account Connection." />
</head>

[Azure Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) contains all of your Azure Storage data objects, blobs, files, queues, tables. 

:::info

Astronomer recommends to use **Azure Blob Storage** Connection Type which uses `wasb` protocol. This can be used with any Azure Storage Account including Azure Data Lake Gen 1 and Azure Data Lake Gen 2. You can use WasbHook to perform file operations.

:::

## Prerequisites
- Local Airflow environment using [Astro CLI](https://docs.astronomer.io/astro/cli/overview)
- An Azure Storage Account which is accessible from your Airflow Server.
- Python requirement `apache-airflow-providers-microsoft` should be added to `requirements.txt`

## Create your connection

To create an Azure Storage connection, you either need to use Shared Access Key or App details or SAS token. Use any of the below methods to integrate Azure Storage Account with Airflow:

1. Use the Shared Access Key.
2. Use the connection string .
2. Use the SAS Token, for granular access to your storage objects.
3. Use the Azure App Service Principal for temporary token.

### Shared Access Key 

1. Follow the instructions [here](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal) to get the keys. Click on **Show** for one of the key (key1 or key2) , then click copy icon to copy the value.
2. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as Azure Blob Storage.
3. Enter the name of the storage account in **Blob Storage Login** field and Key from step #1 to **Blob Storage Key**.
4. Click on **Test** connection to test and then **Save** the connection.

![azure-connection-storage-access-key](/img/guides/connection-blob-storage-access-key.png)

### Using Connection string

1. Follow the instructions [here](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal) to get the keys. Click on **Show** for one of the connection string under (key1 or key2) , then click copy icon to copy the value.
2. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as Azure Blob Storage.
3. Paste the value of the connection string to the **Blob Storage Connection String** field. 
4. Click on **Test** connection to test and then **Save** the connection.

![azure-connection-storage-conn-string](/img/guides/connection-blob-storage-conn-string.png)

### SAS token

1. Follow the instructions in [Create SAS tokens](https://learn.microsoft.com/en-us/azure/cognitive-services/translator/document-translation/how-to-guides/create-sas-tokens?tabs=Containers#create-sas-tokens-in-the-azure-portal) to generate a SAS token. Copy the SAS token or the Connection String for later use.
2. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as Azure Blob Storage.
3. Enter the name of the Storage account to the **Blob Storage login** field and paste the SAS token to **SAS Token** field.
4. Click on **Test** connection to test and then **Save** the connection.

You can also use the SAS token connection string similar to how we used the Shared access key connection string in section [Using connection string](azure-storage-account#using-connection-string).

![azure-connection-storage-sas-token](/img/guides/connection-blob-storage-sas-token.png)

### Service Principal using Azure SDK

If you want to use [Azure SDK for Python](https://learn.microsoft.com/en-us/azure/developer/python/sdk/authentication-overview?tabs=cmd) for authentication, you will need to do the following to generate the temporary token credentials. 
   
1. Get the `application client id`, `tenant id` and `client secret` by [creating an application service principal using app registration](https://learn.microsoft.com/en-us/azure/developer/python/sdk/authentication-local-development-service-principal?tabs=azure-portal) in Azure portal.
2. After app creation, you can [assign permissions to the app](https://learn.microsoft.com/en-us/azure/developer/python/sdk/authentication-local-development-service-principal?tabs=azure-portal) to access Storage Account.
3. Go to your Storage account on Azure Portal, and under **Settings** in the left pane, click on **Endpoints**. Copy the Blob Service URL. It looks like `https://mystorageaccount.blob.core.windows.net/`.
4. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as Azure Blob Storage.
5. Paste the Blob Service URL from Step #3 to **Account Name**.
6. Paste the `application client id` to **Blob Storage Login** field, `tenant id` to **Tenant Id** field and `client secret` to **Blob Storage Key** field from step #1.
6. Click on **Save** the connection.

![azure-connection-storage-app](/img/guides/connection-blob-storage-app.png)

## How it works

Airflow uses [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python) to connect to Azure services.

## References

- [OSS Airflow Docs](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-azure/stable/connections/wasb.html)
- [Create a Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json)
- [Authorize access to Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/authorize-data-access?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json)