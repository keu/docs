---
title: "Creating an Azure Data Factory connection"
id: azure-data-factory
sidebar_label: Azure Data Factory
description: Learn how to create an Azure Data Factory connection in Airflow.
---

[Azure Data Factory](https://azure.microsoft.com/en-in/products/data-factory#overview) is a cloud-based data integration and transformation service used to build data pipelines and jobs. Integrating ADF with Airflow allows users to run their ADF pipelines and check their status from an Airflow DAG.

## Prerequisites
- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- A locally running [Astro project](https://docs.astronomer.io/astro/cli/get-started-cli).
- [Access](https://learn.microsoft.com/en-us/azure/data-factory/concepts-roles-permissions#roles-and-requirements) to your Azure Data Factory.
- [Azure AD application](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal).

## Get connection details

A connection from Airflow to Azure data factory requires the following information:

- Subscription ID
- Data factory name
- Resource group name
- Application Client ID
- Tenant ID
- Client secret

In your Azure portal, follow the below steps to retrieve all of these values:

1. Go to your [data factory](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.DataFactory%2FdataFactories) service and select the subscription that contains your data factory.
2. Copy the **Name** of your data factory and the **Resource group**.
3. Click on the subscription for your data factory, copy the **Subscription ID** from the subscription window.
4. Select your [Azure AD application](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade). Then, from the **Overview** tab, copy the **Application (client) ID** and **Directory (tenant) ID**.
5. Follow the Azure documentation to [create a new client secret](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#option-3-create-a-new-application-secret) for your application to be used in Airflow connection. Copy the **VALUE** of the client secret displayed.
6. Follow the Azure documentation to [assign](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) the [Data Factory Contributor](https://learn.microsoft.com/en-us/azure/data-factory/concepts-roles-permissions#set-up-permissions) role to your app in order to access Data Factory from Airflow.

## Create your connection

To create a connection, follow the below steps:

1. Add the following line to your Astro project's `requirement.txt` file:
    ```
    apache-airflow-providers-microsoft-azure
    ```
2. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection and select the connection type as **Azure Data Factory**.
4. Paste the values copied in [Get Connection details](azure-data-factory#get-connection-details) to the respective fields as shown in the screenshot.
4. Click on **Test** connection to test and then **Save** the connection.

![azure-connection-data-factory](/img/guides/connection-azure-data-factory.png)

:::tip
If you want to use the same connection for multiple data factories or multiple resource groups, you can skip the **Resource Group** and **Factory Name** fields in the connection condiguration. Instead, you can pass these values to the `default_args` of a DAG or as parameters to the AzureDataFactoryOperator. For example:

```json
  "azure_data_factory_conn_id": "adf",
  "factory_name": "my-factory", 
  "resource_group_name": "my-resource-group",
```

:::

## How it works

Airflow uses the [`azure-mgmt-datafactory`](https://pypi.org/project/azure-mgmt-datafactory/) library from [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python) to connect to Azure Data Factory using [AzureDataFactoryHook](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-azure/stable/_api/airflow/providers/microsoft/azure/hooks/data_factory/index.html).

## See also

- [Apache Airflow Microsoft Azure OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-azure/6.1.1/connections/adf.html)
- [Run Azure Data Factory pipelines in Airflow](airflow-azure-data-factory-integration.md)
- [Create your first pipeline in Azure Data Factory](https://learn.microsoft.com/en-us/azure/data-factory/v1/data-factory-build-your-first-pipeline-using-editor)
- [Example DAGs](https://registry.astronomer.io/dags?limit=24&sorts=updatedAt%3Adesc&query=azure+data+factory) and [modules](https://registry.astronomer.io/modules?query=azuredatafactory) in Astronomer Registry