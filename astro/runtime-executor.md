---
sidebar_label: "Astro Runtime executor"
title: "Specify task-level resources with the Astro Runtime executor"
id: runtime-executor
description: Learn how to enable the Astro Runtime executor for Apache Airflow and specify task-level resources.
---

The Astro Runtime executor is an executor for Apache Airflow that is maintained by Astronomer and available exclusively on Astro.

In Airflow, the executor component is responsible for determining what resources or worker process will complete a task once that task is scheduled. The Celery and Kubernetes executors are most common for use cases in production and both rely on software that is maintained outside of the open source project. 

The Astro Runtime executor is built primarily as an alternative to the Celery executor. It includes features and configurations that make task execution more reliable. Using the Astro Runtime executor, you can:

- Specify CPU and memory resource requests per task, which ensures that a task isn't assigned to a worker that doesn't have enough resources to complete it.
- Specify task slots to control task concurrency and isolation.
- View a page in the Airflow UI that shows the real-time status of each worker for improved troubleshooting.

Astronomer recommends using the Astro Runtime executor in all instances in which Celery is preferred, including short-running tasks that cannot withstand latency to start and finish. To learn more about Airflow executors, see [Airflow Executors](learn/airflow-executors-explained). To learn more about the Astro Runtime executor, see [Astro Runtime architecture](runtime-architecture.md#runtime-executor).  

:::info

This functionality is early access and under active development. If you have any questions or feedback about this feature, contact [Astronomer support](https://support.astronomer.io/).

:::

## Executor architecture and execution flow

The Astro Runtime executor has a similar execution framework to the Celery executor, but it relies on a few new and existing Airflow components to run tasks:

- The **scheduler** creates task instances with their allocation requests for newly scheduled tasks in the **Airflow metadata DB**.
- An **allocation** is a wrapper around a task instance that indicates its resource requirements. It’s created alongside the task instance as a new object in the database.
- The **Airflow metadata DB** stores both assigned and unassigned allocation requests. The Runtime executor’s DB tables are created alongside, but in complete isolation from, existing Airflow tables. This means that no open source tables in Airflow need to be modified in order for the executor to work.
- The **allocator** queries the metadata DB for unassigned allocation requests. It then determines how the allocation requests should be handled and submits assignments for the runners back to the DB.
- **Runners** run tasks. To start running a task, a runner queries the metadata DB to look for a new assignment. If it’s been assigned a task, the runner starts completing the work. Currently, there is only one type of runner named **SubprocessRunner**, which runs tasks within the same cluster as your Airflow environment.

![Astro Runtime executor architecture](/img/docs/runtime-executor-architecture.png)

After a task is scheduled:

- The scheduler logs information about the task and its configured resource requests in the Airflow metadata database. The task's allocation status is "Unassigned".
- The allocator looks for any unassigned tasks in the Airflow metadata database. When it finds an unassigned task, the allocator determines how to best run the task by reviewing existing task resource requests and configured system-level allocation strategies.
- The allocator chooses a runner and assigns the task to the runner for execution. After the task is assigned, its allocation status in the Airflow metadata database updates to "Assigned".
- The task runs to completion and marks itself as succeeded or failed. Its allocation status in the Airflow metadata database updates to "Completed".

## Enable the Astro Runtime executor

Today, all Deployments on Astro run the Celery executor by default. To use the Astro Runtime executor, you must manually enable it as an environment variable for any Deployment on Astro that you would like to test it with.

1. In the Cloud UI, select a Workspace and then select a Deployment.
2. Click the **Variables** tab.
3. Click **Edit Variables**
4. Create an environment variable. See [Environment variables](environment-variables.md).
   
     - Key:`ASTRONOMER_RUNTIME_EXECUTOR`
     - Value: `True`. 
  
5. Click **Save Variables**.

After you set this variable, all tasks in the Deployment will run with the Astro Runtime executor. To switch back to the Celery executor, set the `ASTRONOMER_RUNTIME_EXECUTOR` variable to `False`. After you set the environment variable,deleting it from your Deployment will not work.

## Resource requests

The Runtime allocator uses resource requests to determine the best runner for a task to run on. After a task is assigned to a runner, the runner reserves the requested resource for the entire duration of the task. 

If no resource requests are set, the Astro Runtime executor assigns tasks to a runner until there are 16 tasks running at once, which is the default concurrency limit on Astro.

### CPU and Memory 

A task can request CPU and memory to be reserved for the entirety of the task's duration. The Runtime executor will assign the task to a runner only if a runner has the requested CPU and memory available.

You should set CPU and Memory resource requests to be the maximum amount of resources that a task should use at any given time. A task can use some, all, or none of its requested resources. Runners can't scale down the requested resources once the task starts running.

### Slots

Slots are a mechanism for limiting the amount of tasks that can run concurrently on a single runner. By default, runners have 16 slots and tasks request 1 slot.

You might want to request more slots for large tasks that you don't want limited by specific resource requests for CPU and memory. Running a task in multiple slots ensures that the task doesn't compete for resources with other tasks in the same runner.

### Set task-level resource requests

You can set task-level requests for the following resources in your task definitions:

- `cpu`: The number of CPU cores to reserve. For example, `1.5`.
- `memory`: The number of megabytes of RAM to reserve. For example, `1024 MB`.
- `slots`: The number of slots that the task takes up to limit concurrency on a single runner. You can request up to 64 slots for a single task, which is the concurrency limit for a worker queue on Astro. For example, `16`.

#### Resource request example

The following task is configured with a resource request of 1.5 CPU cores and 1024MB.

```python
my_task = BranchPythonOperator(
            task_id="my_task",
            python_callable=_get_activity, # Python function called when task executes
            resources= {"cpu": "1.5", "memory": "1024MB", "slots": "2"},
        )

```

When this task is assigned to the runner, the runner reserves 1.5 CPU cores and 1024MB for the entirety of the task, even if the task only uses 512MB of memory.

## View runner status

The Astro Runtime executor includes includes a page in the Airflow UI to track the status of runners and their task allocations. To view the page:

1. In the Cloud UI, select a Workspace and then select a Deployment.
2. Click **Open Airflow**.
3. In the **Admin** menu, click **Executor Status**.

The **Executor Status** page includes three trackers:

- The **Unassigned Allocations** tracker shows all task instances which are queued but not currently assigned to a runner. 
- The **Resources** tracker lists all resources available to the entire Deployment. This number scales up and down based on your configured [worker queues](worker-queues.md).
- The **Runners** tracker lists all active runners and what worker queues they belong to.
    - The **Allocations** tracker shows each currently running task instance in a specific runner.

## Advanced configuration 

The following Astro Runtime executor configurations are for advanced use cases or otherwise experimental. Astronomer does not recommend setting these configurations for most use cases. 

## Set an allocation strategy

Set the `ALLOCATOR_STRATEGY` [environment variable](environment-variables.md) to configure how the Astro Runtime executor allocates tasks across your runners. This environment variable has two possible values:

- `EvenSpreadStrategy`: The allocator attempts to assign tasks evenly across all available runners.
- `MaxPackingStrategy`: The allocator attempts to assign as many tasks as possible to a single runner before using another runner.