---
title: "Creating the Azure Data Factory Connection"
id: azure-data-factory
sidebar_label: Azure Data Factory
---

<head>
  <meta name="description" content="Learn how to create the Azure Data Factory Connection." />
  <meta name="og:description" content="Learn how to create the Azure Data Factory Connection." />
</head>

Azure Data Factory is a cloud-based data integration and transformation service.

## Prerequisites
- Local Airflow environment using [Astro CLI](https://docs.astronomer.io/astro/cli/overview)
- Azure Data Factory in Azure 
- Python requirement `apache-airflow-providers-microsoft` should be added to `requirements.txt`

## Get connection details
1. In your Azure portal, go to the subscription where your Data Factory is created, and copy the `subscription id`.
2. Get the `application client id`, `tenant id` and `client secret` by [creating an application service principal using app registration](https://learn.microsoft.com/en-us/azure/developer/python/sdk/authentication-local-development-service-principal?tabs=azure-portal) in Azure portal.
3. After app creation, you can [assign permissions](https://learn.microsoft.com/en-us/azure/data-factory/concepts-roles-permissions#set-up-permissions) to access Data Factory.
4. Copy the name of the Data Factory and the Resource group as well.

## Create your connection

To create a connection, follow the below steps:

1. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as Azure Data Factory.
2. Paste the value of `application client id`, `tenant id` and `client secret` copied in step #2 of [Get Connection details](azure-data-factory#get-connection-details) in fields **Client ID**, **Tenant ID** and **Secret** respectively.
3. Paste the `subscription id`, resource group and data factory name in the respective fields.
4. Click on **Test** connection to test and then **Save** the connection.

![azure-connection-data-factory](/img/guides/connection-azure-data-factory.png)

:::tip
If you wish to use the same connection for multiple data factories or multiple resource groups, you can skip the Resource Group and Factory Name fields in the connection and pass it in the `default_args` of a DAG or as a parameter to the AzureDataFactory Operators. For example:

```json
default_args={
    "azure_data_factory_conn_id": "adf",
    "factory_name": "mk-test1", 
    "resource_group_name": "mk",
}
```
:::

## How it works

Airflow uses from [`azure-mgmt-datafactory`](https://pypi.org/project/azure-mgmt-datafactory/) library from [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python) to connect to Azure Data Factory.

## References

- [Airflow OSS docs](https://airflow.apache.org/docs/apache-airflow-providers-microsoft-azure/6.1.1/connections/adf.html)
- [Run Azure Data Factory pipelines in Airflow](https://docs.astronomer.io/learn/airflow-azure-data-factory-integration)
- [Create your first pipeline an Azure Data Factory](https://learn.microsoft.com/en-us/azure/data-factory/v1/data-factory-build-your-first-pipeline-using-editor)