---
sidebar_label: "Configure clusters"
title: "Configure Astro clusters"
id: view-clusters
description: View information about clusters in the Cloud UI.
---

import PremiumBadge from '@site/src/components/PremiumBadge';

Use the Cloud UI to get an overview of your Organization's clusters and retrieve cluster information that may be required by Astronomer support.

Some cluster changes can be made only by Astronomer. See [Request a cluster change](modify-cluster.md).

## View all clusters

In the Cloud UI, click the **Clusters** tab to view information about the clusters in your Organization. The following table provides descriptions for each cluster value.

| Value              | Description                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Name               | The name of the cluster                                                                                                     |
| Provider           | The cloud provider that hosts the cluster                                                                            |
| Account ID         | The ID of the cloud provider account that hosts the cluster. This is either an AWS account ID or a Google Cloud project ID |
| Region             | The cloud provider region where the cluster is hosted                                                                       |
| VPC subnet         | The range of IP addresses that can be used to connect to the cluster's VPC                                                  |
| Pod subnet         | GCP only. The range of IP addresses that can be used to connect to the cluster's Pods                                       |
| Service subnet     | GCP only. The range of IP addresses that can be used to connect to the cluster's GCP services                               |
| Service peering    | GCP only. The range of IP addresses that can be used to peer with the cluster's VPC                                         |
| DB instance type   | The type of instance used for the cluster's primary database                                                                |
| Node instance type | The instance type used for the cluster's worker nodes                                                                       |
| Max node count     | The maximum number of worker nodes supported across all Deployments in the cluster                                          |
| External IPs       | The public IP addresses for connecting the cluster to external services                                                         |
| Updated            | The date and time the cluster's settings were last updated                                                                  |
| Created            | The date and time the cluster was created                                                                          |

All users in your Organization have access to this view. For more information about each value, see [Cluster settings reference](https://docs.astronomer.io/astro/category/cluster-settings).

## Configure a cluster

To view and update settings for a specific cluster, click the cluster's name in the **Clusters** tab. A cluster's configuration menu includes the following pages:

- **Worker Types**: Shows all available worker types on the cluster. To add or remove a worker type on a cluster, see [Request a cluster change](modify-cluster.md).
- **Workspace Authorization**: Shows which Workspaces are allowed to create Deployments on the cluster.
- **Details**: Shows the same information available from the  **Clusters** tab. See [View all clusters](#view-all-clusters).

### Limit Deployment creation on a cluster 

<PremiumBadge />

You can configure a cluster so that it contains Deployments only from specific Workspaces that are mapped to the cluster. Use this feature to establish fine-grained control over who can use your cluster resources and how.

1. In the Cloud UI, go to the **Clusters** tab, select a cluster, and then go to **Workspace Authorization**.
2. Check each Workspace that you want to map to the cluster. 
3. Click **Save**.

:::info 

A cluster with mapped Workspaces can't host Deployments from any Workspaces that aren't mapped to the cluster. To map Workspaces to a cluster, you must first transfer any existing Deployments on the cluster to one of these Workspace.

Similarly, to unmap a Workspace but keep its Deployments in the cluster, you must transfer your Deployments to a new cluster which is still mapped to the Workspace. See [Transfer a Deployment to another Workspace](configure-deployment-resources.md#transfer-a-deployment-to-another-workspace).

:::