---
title: "Creating an Azure Storage Account connection"
id: azure-storage-account
sidebar_label: Azure Storage Account
description: Learn how to create an Azure Storage Account connection.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[Azure Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) provides the storage for all of your Azure Storage data objects - blobs, files, queues, tables. Integrating Azure storage with Airflow will allow users to perform different kind of operations on data objects stored in the cloud. For example, users can create or delete a container, upload or read a file, download blobs etc.

:::info

Astronomer recommends to use **Azure Blob Storage** Connection Type which uses `wasb` protocol. This can be used with any Azure Storage Account including Azure Data Lake Gen 1 and Azure Data Lake Gen 2.

:::

## Prerequisites
- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- A locally running [Astro project](https://docs.astronomer.io/astro/cli/get-started-cli).
- An [Azure Storage Account](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts) which is accessible from your local Airflow environment.

## Get connection details

To create an Azure storage connection in Airflow, you can use either of the following methods:

<Tabs
    defaultValue="shared-access-key"
    groupId= "azure-connection"
    values={[
        {label: 'Shared access key', value: 'shared-access-key'},
        {label: 'Connection string', value: 'connection-string'},
        {label: 'SAS token', value: 'sas-token'},
        {label: 'Azure app service principal', value: 'azure-app-service-principal'},
    ]}>

<TabItem value="shared-access-key">

Microsoft generates two [Shared access keys](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal) by default for every storage account. They can be used to authorize access to the data in your storage account. 

An Azure blob storage connection using shared access key requires the following information:

- Name of the storage account
- Shared access key

In you Azure portal, follow the below instructions to get your shared access key:

1. Go to your [Storage account](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts) view and select your subscription. 
2. Copy the name of your storage account.
3. Follow the [Microsoft documentation](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys) until step #4 to get the shared access key.

</TabItem>


<TabItem value="connection-string">

A [connection string](https://learn.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string) for a storage account includes the authorization information required to access data in your storage account. 

An Azure blob storage connection using connection string requires the following information:

- Storage account connection string

In your Azure portal, follow the below instructions to get your connection string:

1. Go to your [Storage account](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts) view and select your subscription. 
2. Copy the name of your storage account.
3. Follow the [Microsoft documentation](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys) until step #5 to get the connection string.

</TabItem>

<TabItem value="sas-token">

A [shared access signature (SAS) token](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview) provides granular access for a storage account. 

An Azure blob storage connection using SAS token requires the following information:

- Storage account name
- SAS token

In your Azure portal, follow the below instructions to retrieve these values:

1. Go to your [Storage account](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts) view and select your subscription. 
2. Copy the name of your storage account.
3. Follow the [Microsoft documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/translator/document-translation/how-to-guides/create-sas-tokens?tabs=Containers#create-sas-tokens-in-the-azure-portal) to generate your SAS token.

</TabItem>

<TabItem value="azure-app-service-principal">

A [service principal for an azure app](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview) provides granular access for a storage account. 

An Azure blob storage connection using a service principal requires the following information:

- Storage account URL
- Application Client ID
- Tenant ID
- Client secret

In your Azure portal, follow the below steps to retrieve all of these values:

1. Go to your [Storage account](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts) view and select your subscription. 
2. Go to the **Settings** in the left pane, and click on **Endpoints**. Copy the Blob Service URL. It looks like `https://mystorageaccount.blob.core.windows.net/`.
3. Go to your [Azure AD application](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade). Then, from the **Overview** tab, copy the **Application (client) ID** and **Directory (tenant) ID**.
4. Follow the Azure documentation to [create a new client secret](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#option-3-create-a-new-application-secret) for your application to be used in Airflow connection. Copy the **VALUE** of the client secret displayed.
5. Follow the Azure documentation to [assign](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) the [Storage Blob Data Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor) role to your app in order to manage objects in your storage account from Airflow.

</TabItem>
</Tabs>

## Create your connection

To create an Azure blob storage connection, you can use any of the following methods to integrate Azure storage account with Airflow:

<Tabs
    defaultValue="shared-access-key"
    groupId= "azure-connection"
    values={[
        {label: 'Shared access key', value: 'shared-access-key'},
        {label: 'Connection string', value: 'connection-string'},
        {label: 'SAS token', value: 'sas-token'},
        {label: 'Azure app service principal', value: 'azure-app-service-principal'},
    ]}>

<TabItem value="shared-access-key">

To create a connection, follow the below steps:

1. Add the following line to your Astro project's `requirement.txt` file to install and use the package for Microsoft Azure in Airflow:

    ```
    apache-airflow-providers-microsoft-azure
    ```

2. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.

3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Azure Blob Storage** and give it a name in the **Connection Id** field.

4. Paste the values copied from [Get connection details](#get-connection-details) in the connection fields:
    - **Blob Storage Login**: `<my-storage-account>`
    - **Blog Storage Key**: `<my-shared-access-key>`

5. Click on **Test** connection to test and then **Save** the connection.

    ![azure-connection-storage-access-key](/img/guides/connection-blob-storage-access-key.png)

</TabItem>

<TabItem value="connection-string">

To create a connection, follow the below steps:

1. Add the following line to your Astro project's `requirement.txt` file to install and use the package for Microsoft Azure in Airflow.:
    ```
    apache-airflow-providers-microsoft-azure
    ```
2. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.

3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Azure Blob Storage** and give it a name in the **Connection Id** field.

4. Paste the value copied from [Get connection details](#get-connection-details) in the connection fields:

    - **Blob Storage Connection String**: `<my-connection-string>`

5. Click on **Test** connection to test and then **Save** the connection.

    ![azure-connection-storage-conn-string](/img/guides/connection-blob-storage-conn-string.png)

:::tip

You can also use this connection string method for SAS token. When you create SAS token to connect to Azure storage account, you can copy it's connection string and then paste its value to the **Blob Storage Connection String** field.
:::

</TabItem>

<TabItem value="sas-token">

To create a connection, follow the below steps:

1. Add the following line to your Astro project's `requirement.txt` file to install and use the package for Microsoft Azure in Airflow:
    ```
    apache-airflow-providers-microsoft-azure
    ```
2. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Azure Blob Storage** and give it a name in the **Connection Id** field.
4. Paste the values copied from [Get connection details](#get-connection-details) in the connection fields:
    - **Blob Storage Login**: `<my-storage-account>`
    - **SAS Token**: `<my-sas-token>`
5. Click on **Test** connection to test and then **Save** the connection.
    ![azure-connection-storage-sas-token](/img/guides/connection-blob-storage-sas-token.png)

</TabItem>

<TabItem value="azure-app-service-principal">

To create a connection, follow the below steps:

1. Add the following line to your Astro project's `requirement.txt` file to install and use the package for Microsoft Azure in Airflow:
    ```
    apache-airflow-providers-microsoft-azure
    ```
2. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.

3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection, select the connection type as **Azure Blob Storage** and give it a name in the **Connection Id** field.

4. Paste the values copied from [Get connection details](#get-connection-details) in the connection fields:

    - **Account Name**: `<my-storage-account-url>`
    - **Blob Storage Login**: `<my-pplication-client-ID>`
    - **Blob Storage Key**: `<my-client-secret>`
    - **Tenant Id**: `<my-tenant-id>`

6. Click on **Save** the connection.

    ![azure-connection-storage-app](/img/guides/connection-blob-storage-app.png)

</TabItem>
</Tabs>

## How it works

Airflow uses [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python) to connect to Azure services via [WasbHook](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-azure/stable/_api/airflow/providers/microsoft/azure/hooks/wasb/index.html).

## See also

- [Apache Airflow Microsoft Azure OSS Docs](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-azure/stable/connections/wasb.html).
- Azure blob storage [modules](https://registry.astronomer.io/modules?query=wasb) and [example DAGs](https://registry.astronomer.io/dags/covid_to_azure_blob/versions/1.2.0) in Astronomer Registry.
- [Import and export Airflow connections using Astro CLI](https://docs.astronomer.io/astro/import-export-connections-variables#from-environment-variables).
- [Create a storage account in Azure](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json).
- [Authorize access to Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/authorize-data-access?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json).