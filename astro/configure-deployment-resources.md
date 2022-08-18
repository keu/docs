---
sidebar_label: 'Configure Deployment resources'
title: 'Configure Deployment resources'
id: configure-deployment-resources
description: Learn how to create and configure Astro Deployment resources.
---

After you create an Astro Deployment, you can modify its resource settings to make sure that your tasks have the CPU and memory required to complete successfully.

## Worker queues

A worker is responsible for executing tasks, which are first scheduled and queued by the scheduler. On Astro, task execution is powered by the [Celery executor](https://airflow.apache.org/docs/apache-airflow/stable/executor/celery.html) with [KEDA](https://www.astronomer.io/blog/the-keda-autoscaler). Each worker is a Kubernetes Pod that is hosted within a Kubernetes node in your Astro cluster.

Not all tasks have the same requirements. On Astro, you can create optimized execution environments for different types of tasks using worker queues. Worker queues are a set of configurations that apply to a group of workers in your Deployment. For a given worker queue, you can configure the size and type of its workers to determine how much CPU and memory your tasks can consume. You can also use worker queues to configure settings related to worker autoscaling behavior.

By default, all tasks run in a default worker queue that does not require any additional configuration or code. To enable additional worker types or configurations for different group of tasks, you can create additional worker queues in the Cloud UI and assign tasks to queues in your DAG code.

See the following sections for more details on configuring worker queues.

### Example use case

By configuring multiple worker queues and assigning tasks to these queues based on the requirements of the tasks, you can enhance the performance and throughput of your Deployment. For example, consider the following scenario:

- You are running Task A and Task B in a Deployment on an AWS cluster.
- Task A and Task B are dependent on each other, so they need to run in the same Deployment.
- Task A is a long-running task that uses a lot of CPU and little memory, while Task B is a short-running task that uses minimal amounts of CPU and memory.

You can assign Task A to a worker queue that is configured to use the [`c6i.4xlarge`](https://aws.amazon.com/ec2/instance-types/c6i/) worker type that's optimized for compute. Then, you can assign Task B to a worker queue that is configured to use the [`m5.xlarge`](https://aws.amazon.com/ec2/instance-types/m5) worker type that is smaller and optimized for general usage.

### Worker queue settings

Worker queues support the following settings:

- **Name:** The name of your worker queue. Use this name to assign tasks to the worker queue in your DAG code. Worker queue names must consist only of lowercase letters and hyphens. For example, `machine-learning-tasks` or `short-running-tasks`.
- **Worker Type:** The size and type of workers in the worker queue, defined as a node instance type that is supported by the cloud provider of your cluster. For example, `m5.2xlarge` or `c6i.4xlarge` for a Deployment running on an AWS cluster. A worker’s total available CPU, memory, storage, and GPU is defined by its worker type. Actual worker size is equivalent to the total capacity of the worker type minus Astro’s system overhead. For a list of supported worker types, see the [AWS](resource-reference-aws.md#node-instance-type), [GCP](resource-reference-gcp.md#node-instance-type), and [Azure](resource-reference-azure.md#node-instance-type) resource references.
- **Max Tasks per Worker:** The maximum number of tasks that a single worker can run at a time. If the number of queued and running tasks exceeds this number, a new worker is added to run the remaining tasks. This value is equivalent to [worker concurrency](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#worker-concurrency) in Apache Airflow. It is 16 by default.
- **Worker Count**: The minimum and maximum number of workers that can run at a time.  The number of running workers changes regularly based on Maximum Tasks per Worker and the current number of tasks in a `queued` or `running` state. By default, the minimum number of workers is 1 and the maximum is 10.

These settings must be set for each worker queue.

#### Default worker queue

Each Deployment requires a `default` worker queue to run tasks. Tasks that are not assigned to a worker queue in your DAG code are executed by workers in the default worker queue. You do not have to assign tasks to the default worker queue in your DAG code.

If you don’t change any settings in the default worker queue:

- A maximum of 16 tasks can run at one time per worker. If more than 16 tasks are queued or running, a new worker is added to run the remaining tasks.
- A maximum of 10 workers can run at once, meaning that a maximum of 160 tasks can be in a `running` state at a time. Remaining tasks will stay in a `queued` or `scheduled` state until running tasks complete.

You can change all settings of the default worker queue except for its name.

#### Create a Worker Queue

Running multiple worker queues improves resource usage efficiency and enables dependent tasks with different computational requirements to coexist on the same Deployment.

1. Log in to the Cloud UI.
2. Select a Deployment.
3. Click **Create Worker Queue**
4. Configure the worker queue’s settings.
5. Click **Update Queue**.

#### Assign tasks to a worker queue

By default, all tasks run in the default worker queue. To run tasks on a different worker queue, assign the task to the worker queue in your DAG code.

To assign a task to a queue, define `queue` in the task’s operator’s settings. In the following example, all instances of the task run in the `short-running-tasks` queue:

```python
feature_engineering = DatabricksSubmitRunOperator(
	task_id='feature_engineering_notebook_task'
	notebook_task={
		'notebook_path': "/Users/{{ var.value.databricks_user }}/feature-eng_census-pred"
	},
	queue=short-running-tasks,
)
```

### Worker autoscaling logic

While your worker queue settings affect the amount of computing power allocated to each worker, the number of workers running on your Deployment at a given time is based on the number of tasks in a queued or running state.

The maximum number of tasks that a single worker can execute at once is 16. This value is known in Airflow as **worker concurrency**. Worker concurrency is currently a [system-wide setting on Astro](platform-variables.md) that cannot be changed. When there are more than 16 tasks queued or running at a time, one or more new workers is spun up to execute the additional tasks. The number of workers running on a Deployment at a time can be calculated by the following expression, where worker Concurrency is 16:

`[Number of workers]= ([Queued tasks]+[Running tasks])/(Worker concurrency)`

The number of workers subsequently determines the Deployment's [parallelism](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#parallelism), which is the maximum number of tasks which can run concurrently within a single Deployment. To ensure that you can always run as many tasks as your workers allow, parallelism is calculated with the following expression:

`[Parallelism]= [Number of workers] * [Worker concurrency]`

These calculations are computed by KEDA every 10 seconds. For more information on how workers are affected by changes to a Deployment, read [What happens during a code deploy](deploy-code.md#what-happens-during-a-code-deploy).

## Scheduler resources

The [Airflow scheduler](https://airflow.apache.org/docs/apache-airflow/stable/concepts/scheduler.html) is responsible for monitoring task execution and triggering downstream tasks once dependencies have been met. By adjusting the **Scheduler Count** slider in the Cloud UI, you can configure up to 4 schedulers, each of which will be provisioned with the AU specified in **Scheduler Resources**.

For example, if you set scheduler resources to 10 AU and **Scheduler Count** to 2, your Deployment will run with 2 Airflow schedulers using 10 AU each.

If you experience delays in task execution, which you can track via the Gantt Chart view of the Airflow UI, we recommend increasing the AU allocated towards the scheduler. The default resource allocation is 10 AU.

## Edit Deployment resource settings

If you haven't created a Deployment, see [Create a Deployment](create-deployment.md).

1. Log in to the [Cloud UI](https://cloud.astronomer.io) and select a Workspace.
2. Select a Deployment.
3. Click **Edit Configuration**.
4. Edit the Deployment resource settings. For more information about these settings, review the content in this topic.
5. Click **Update Deployment**.

    The Airflow components of your Deployment automatically restart to apply the updated resource allocations. This action is equivalent to deploying code to your Deployment and does not impact running tasks that have 24 hours to complete before running workers are terminated. See [What happens during a code deploy](deploy-code.md#what-happens-during-a-code-deploy).
    
::: caution

If you change the worker type of an existing worker queue, your workers will enter a terminating state. This may interrupt running pipelines and lead to [zombie tasks](https://airflow.apache.org/docs/apache-airflow/stable/concepts/tasks.html#zombie-undead-tasks).

Astronomer recommends changing the worker type of an existing worker queue at a time that is not critical to production pipelines. Astronomer also recommends waiting up to 5 minutes after changing worker type before pushing code to your Deployment.

:::

## Delete a Deployment

When you delete a Deployment, all infrastructure resources assigned to the Deployment are immediately deleted from your data plane. However, the Kubernetes namespace and metadata database for the Deployment are retained for 30 days. Deleted Deployments can't be restored. If you accidentally delete a Deployment, contact [Astronomer support](https://support.astronomer.io).

1. Log in to the [Cloud UI](https://cloud.astronomer.io) and select a Workspace.
2. Click the **Options** menu of the Deployment you want to delete, and select **Delete Deployment**.

    ![Options menu](/img/docs/delete-deployment.png)

3. Enter `Delete` and click **Yes, Continue**.

## Next steps

- [Set environment variables on Astro](environment-variables.md).
- [Manage Deployment API keys](api-keys.md).
