---
sidebar_label: "Runtime executor"
title: "Run tasks with the Runtime executor"
id: runtime-executor
description: Learn how to your Airflow environment and tasks to take advantage of the Runtime executor, available exclusively in Astro Runtime.
---

The Runtime executor is Runtime's component for executing Airflow tasks. It provides the same functionality as the Celery executor, as well as new features and configurations which make task execution more reliable and observable. See [Runtime image architecture](runtime-architecture.md#runtime-executor) for more information about the benefits of the Runtime executor and how it works.

The Runtime executor can work as a direct replacement for the Celery executor without any additional configuration. You can also use Runtime executor to control task execution to a greater degree than with the Celery executor. For example, you can:

- Specify resource requests for CPU, memory, and concurrency slots within your tasks.
- Set environment-level strategies how resources should be allocated between tasks that don't have specific resource requests.
- View metrics for task completion states and resource usage.

:::info

This functionality is early access and under active development. If you have any questions or feedback about this feature, contact [Astronomer support](https://support.astronomer.io/).

:::

## Enable the Runtime executor in a Deployment

To enable the Runtime executor in a Deployment, set an environment variable with a key of `ASTRO_RUNTIME_EXECUTOR` and a value of `True`. See [Environment variables](environment-variables.md).

After you set this variable, all tasks in the Deployment will run with the Runtime executor. To revert back to using the Celery executor, delete the environment variable from your Deployment. 

## Set task-level resource requests

You can set task-level requests for the following resources:

- `cpu`: The number of CPU cores to reserve (for example, `1.5`).
- `memory`: The number of megabytes of RAM to reserve (for example, `1024MB`).
- `slots`: The mechanisms for limiting concurrency within a runner. You can request up to 16 slots for a task.

The Runtime allocator uses these requests to determine the best runner for a task to run on. After a task is assigned to a runner, the runner reserves the requested resource for the entire duration of the task. 

You should set these resource requests to be the maximum amount of resources that a task should use at any given time. A task can use some, all, or none of its requested resources. Runners can't scale down the requested resources once the task starts running.

Set task-level resource requests in the task definition. In the following example, a task is configured with a resource request of 1.5 CPU cores and 1024MB.

```python
my_task = BranchPythonOperator(
            task_id="my_task",
            python_callable=_get_activity, # Python function called when task executes
            resources= {"cpu": "1.5", "memory": "1024MB", "slots": "2"},
        )

```

When this task is assigned to the runner, the runner reserves 1.5 CPU cores and 1024MB for the entirety of the task, even if the task only uses 512MB of memory.

### How slot requests work

Slots are a mechanism for limiting the amount of tasks that can run concurrently on a single runner. By default, runners have 16 slots and tasks request 1 slot.

You might want to request more slots for large tasks that you don't want limited by specific resource requests for CPU and memory. Running a task in multiple slots ensures that the task doesn't compete for resources with other tasks in the same runner.

## Set environment-level allocation strategies

Set the `ALLOCATOR_STRATEGY` [environment variable](environment-variables.md) to configure how the Runtime executor allocates tasks across your runners. This environment variable has two possible values:

- `EvenSpreadStrategy`: The allocator attempts to assign tasks evenly across all available runners.
- `MaxPackingStrategy`: The allocator attempts to assign as many tasks as possible to a single runner before using another runner.