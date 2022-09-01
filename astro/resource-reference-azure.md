---
sidebar_label: "Azure"
title: "Resources required for Astro on Azure"
id: resource-reference-azure
description: Reference information for new Astro on Azure clusters.
sidebar_custom_props: { icon: 'img/azure.png' }
---

Unless otherwise specified, new clusters on Microsoft Azure are created with a set of default resources that are considered appropriate for most use cases.

## Default cluster values

| Resource                                      | Description                                                                                                                                   | Quantity/Default Size                                                                         |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Resource Group                                | A container for cluster resources.                                                                                                            | 1x                                                                                            |
| Azure Virtual Network (VNet)                  | A virtual network that hosts Azure resources.                                                                                                 | 1x /19                                                                                        |
| Subnets                                       | Created in the VNet and used for the backing database, Pod, node, and private endpoints.                                                      | <br />/28 for database <br />/21 for pods <br />/21 for nodes <br />/22 for private endpoints |
| Azure Database for PostgreSQL Flexible Server | A private database instance and the Astro data plane primary database. Hosts a metadata database for each hosted Airflow Deployment.          | Standard_D4ds_v4                                                                              |
| Private DNS Zone for Database                 | Provides access to the private database instance.                                                                                             | 1x                                                                                            |
| Azure Kubernetes Service (AKS) Cluster        | Runs the Astro Data Plane, which hosts the resources and data required to execute Airflow tasks.                                              | 1x                                                                                            |
| Virtual Machines (nodes)                      | Hosts all system and Airflow components on Astro, including workers and schedulers. Auto-scale based on the demand for nodes in your cluster. | Standard_D4d_v5                                                                               |
| Azure Storage Account (Standard)              | Stores Azure Blobs.                                                                                                                           | 1x                                                                                            |
| Azure Blob Storage                            | Stores Airflow task logs.                                                                                                                     | 1x                                                                                            |
| Private Endpoint for Blob Storage             | Provides access to Azure Blob storage task logs.                                                                                              | 1x                                                                                            |
| Private DNS Zone for Blob Storage             | Provides access to Azure Blob storage task logs.                                                                                              | 1x                                                                                            |
| Public IP Address                             | Required for connectivity to the control plane and other services.                                                                            | 1x                                                                                            |

## Supported cluster configurations

Depending on the needs of your organization, you may be interested in modifying certain configurations of a new or existing cluster on Astro.

To create a new cluster on Astro with a specified configuration, see [Install Astro on Azure](install-azure.md) or [Create a cluster](create-cluster.md). To make changes to an existing cluster, see [Modify a cluster](modify-cluster.md).

### Supported regions

Astro supports the following Azure regions:

- Australia East
- Canada Central
- Central US
- East US
- West Europe
- West US 3

Modifying the region of an existing Astro cluster isn't supported. If you're interested in a region that isn't on this list, contact [Astronomer support](https://support.astronomer.io).

### Worker node pools

Node pools are a scalable collection of worker nodes with the same instance type. These nodes are responsible for running the Pods that execute Airflow tasks. If your cluster has a node pool for a specific instance type, you can configure tasks to run on those instance types using [worker queues](configure-deployment-resources.md#worker-queues). To make an instance type available in a cluster, contact [Astronomer support](https://support.astronomer.io) with a request to create a new node pool for the specific instance type. Not all instance types are supported in all AWS regions.

Astronomer monitors your usage and the number of nodes deployed in your cluster. As your usage of Airflow increases, Astronomer support might contact you and provide recommendations for updating your node pools to optimize your infrastructure spend or increase the efficiency of your tasks.

For detailed information on each instance type, see [Virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/). If you're interested in a machine type that isn't on this list, contact [Astronomer support](https://support.astronomer.io/). Not all machine types are supported in all regions.

### Worker node size resource reference

Each worker node in a pool runs a single worker Pod. A worker Pod's actual available size is equivalent to the total capacity of the instance type minus Astro’s system overhead.

The following table lists all available instance types for worker node pools, as well as the Pod size that is supported for each instance type. As the system requirements of Astro change, these values can increase or decrease.

| Node Instance Type               | CPU      | Memory      |
| -------------------------------- | -------- | ----------- |
| Standard_D4_v5 - 4/16            | 2.5 CPUs | 9.3 GiB MEM |
| Standard_D8_v5 - 8/32            | 6.4 CPUs | 24 GiB MEM  |
| Standard_D4d_v5 - 4/16 (Default) | 2.5 CPUs | 9.3 GiB MEM |
| Standard_D8d_v5 - 8/32           | 6.4 CPUs | 24 GiB MEM  |

If your Organization needs an instance type that supports a larger worker size, contact [Astronomer support](https://support.astronomer.io). For more information about configuring worker size on Astro, see [Configure a Deployment](configure-deployment-resources.md#worker-resources).

:::info

The size limits defined here also apply to **Scheduler Resources**, which determines the CPU and memory allocated to the Airflow Scheduler(s) of each Deployment.

For more information about the scheduler, see [Configure a Deployment](configure-deployment-resources.md#scheduler-resources).

:::

### Maximum node count

Each Astro cluster has a limit on how many nodes it can run at a time. This limit includes the worker nodes and system nodes managed by Astronomer.

The default maximum node count for all nodes across your cluster is 20. A cluster's node count is most affected by the number of worker Pods that are executing Airflow tasks. See [Worker autoscaling logic](configure-deployment-resources.md#worker-autoscaling-logic).

If the node count for your cluster reaches the maximum node count, new tasks might not run or get scheduled. Astronomer support monitors the maximum node count and will contact your organization if it is reached. To check your cluster's current node count, contact [Astronomer Support](https://support.astronomer.io).
