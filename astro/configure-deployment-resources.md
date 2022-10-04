---
sidebar_label: 'Configure Deployment resources'
title: 'Configure Deployment resources'
id: configure-deployment-resources
description: Learn how to create and configure Astro Deployment resources.
---

After you create an Astro Deployment, you can modify its resource settings to make sure that your tasks have the CPU and memory required to complete successfully.

## Scheduler resources

The [Airflow scheduler](https://airflow.apache.org/docs/apache-airflow/stable/concepts/scheduler.html) is responsible for monitoring task execution and triggering downstream tasks when the dependencies are met. By adjusting the **Scheduler Count** slider in the **Configuration** tab of the Cloud UI, you can configure up to 4 schedulers, each of which will be provisioned with the AU specified in **Resources**.

For example, if you set scheduler resources to 10 AU and **Scheduler Count** to 2, your Deployment will run with 2 Airflow schedulers using 10 AU each.

If you experience delays in task execution, which you can track via the Gantt Chart view of the Airflow UI, we recommend increasing the AU allocated towards the scheduler. The default resource allocation is 10 AU.

## Edit Deployment resource settings

If you haven't created a Deployment, see [Create a Deployment](create-deployment.md).

## Delete a Deployment

When you delete a Deployment, all infrastructure resources assigned to the Deployment are immediately deleted from your data plane. However, the Kubernetes namespace and metadata database for the Deployment are retained for 30 days. Deleted Deployments can't be restored. If you accidentally delete a Deployment, contact [Astronomer support](https://cloud.astronomer.io/support).

1. Log in to the [Cloud UI](https://cloud.astronomer.io) and select a Workspace.
2. Click the **Options** menu of the Deployment you want to delete, and select **Delete Deployment**.

    ![Options menu](/img/docs/delete-deployment.png)

3. Enter `Delete` and click **Yes, Continue**.

## Next steps

- [Set environment variables on Astro](environment-variables.md).
- [Manage Deployment API keys](api-keys.md).
