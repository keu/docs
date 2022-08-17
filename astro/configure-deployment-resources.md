---
sidebar_label: 'Configure Deployment resources'
title: 'Configure Deployment resources'
id: configure-deployment-resources
description: Learn how to create and configure Astro Deployment resources.
---

After you create an Astro Deployment, you can modify its resource settings to make sure that your tasks have the CPU and memory required to complete successfully.

## Worker resources

A worker is responsible for executing tasks, which are first scheduled and queued by the scheduler. On Astro, task execution is powered by the [Celery executor](https://airflow.apache.org/docs/apache-airflow/stable/executor/celery.html) with [KEDA](https://www.astronomer.io/blog/the-keda-autoscaler). Each worker is a Kubernetes Pod that is hosted within a Kubernetes node in your Astro cluster.

The resources and concurrency behavior of a worker are defined in its worker queue, which is a set of configurations that apply to a group of workers. All tasks run in at least one default worker queue, but you can assign tasks to different worker queues that you configure. To change the configuration of a worker, including its instance type, you can either update the worker's current worker queue or create a new worker queue with the desired configuration.

See the following sections for more details on configuring worker queues. For a list of supported worker node instance types and their corresponding worker size limits, see the [AWS](resource-reference-aws.md#deployment-worker-size-limits), [GCP](resource-reference-gcp.md#deployment-worker-size-limits), and [Azure](resource-reference-azure.md#deployment-worker-size-limits) resource references. To request make a supported instance type available to use in your cluster's worker queues, reach out to [Astronomer support](https://support.astronomer.io).

### Worker queues

A worker queue is a set of configurations that apply to a group of workers in your Deployment. They allow you to create optimized execution environments for different tasks. You can assign tasks to worker queues in your DAG code or run all tasks on a default worker queue.

By configuring multiple worker queues and assigning tasks to these queues based on the work they’re completing, you can fine-tune your Deployment to run tasks without wasting resources. For example, consider the following scenario:

- You are running Task A and Task B in a Deployment on AWS.
- Task A and Task B are dependent on each other, so they need to run in the same Deployment.
- Task A uses a lot of memory and very little CPU, while Task B uses equal amounts of CPU and memory.

You can assign Task A to a worker queue of `r6i.xlarge` instances that’s optimized for memory usage, and you can assign Task B to a worker queue of `m5.large` instances that’s optimized for general usage.

#### Worker queue settings

Worker queues support the following settings:

- **Name:** The name of your worker queue. Use this name to assign tasks to the worker queue in your DAG code.
- **Worker Type:** The instance type of workers in the worker queue. A worker’s total available CPU, memory, storage, and GPU is defined by the instance type that it runs on. Actual worker size is equivalent to the total capacity of the instance type minus Astro’s system overhead. For a list of total available worker resources for each instance type, see see the [AWS](resource-reference-aws.md#deployment-worker-size-limits) and [GCP](resource-reference-gcp.md#deployment-worker-size-limits), and , and [Azure](resource-reference-azure.md#deployment-worker-size-limits) resource references.
- **Concurrency:** The maximum number of tasks that a worker can run at a time. If the number of queued and running tasks exceeds this number, a new worker spins up to run the remaining tasks. This is equivalent to [worker concurrency](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#worker-concurrency) in Airflow.
- **Min/max** worker: The minimum and maximum number of workers that can run in the pool.  The number of running workers changes regularly based on Maximum Tasks per Worker and the current number of queued and running tasks.

#### Default worker queue

Each Deployment requires a default worker queue to run tasks. If you don’t change any settings in the default worker queue:

- All tasks in the Deployment run in the `default` worker queue.
- A maximum of 16 tasks can run at once per worker. If more than 16 tasks are queued or running at once, then a new worker spins up to run the remaining tasks.
- A maximum of 10 workers can run at once, meaning that your Deployment can process 160 queued or running tasks at a time. Any queued or running tasks beyond 160 can cause scheduling or execution errors.

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

## Next steps

- [Set environment variables on Astro](environment-variables.md).

- [Manage Deployment API keys](api-keys.md).
