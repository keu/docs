---
sidebar_label: 'Troubleshooting FAQ'
title: 'Astro Troubleshooting FAQ'
id: troubleshoot-astro
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## Why does my Deployment have zombie tasks? 

Zombie tasks are tasks that Airflow assumes are running but have somehow died. Zombie tasks often occur when a process running a task is killed killed or the node running a task worker is terminated. The Celery executor occasionally attempts to retry zombie tasks.

There are a few reasons why your Deployment could have zombie tasks:

- You are receiving `FailedScheduling` errors due to insufficient scheduler CPU and memory.
- DAG parsing issues.
- You are encountering a known Airflow bug in versions 2.0.0 - 2.3.2.
- (AWS only) T2 and T3 instance types are being throttled due to lack of credits.

### Symptoms of zombie tasks

Use the following methods to find zombie tasks on a Deployment:

- Search for missing log errors in your task logs. For example, the following log might indicate a zombie task run because there was no evidence of it running to completion:

    ```
    *** Falling back to local log 
    *** Log file does not exist: /usr/local/airflow/logs/dag_id=<dag>/run_id=<run>/task_id=<task>/attempt=1.log 
    *** Fetching from: http://<ip>/log/dag_id=<dag>/run_id=<run>/task_id=<task>/attempt=1.log 
    *** Failed to fetch log file from worker. Client error '404 NOT FOUND' for url 'http://<ip>/log/dag_id=<dag>/run_id=<run>/task_id=<task>/attempt=1.log' For more information check: https://httpstatuses.com/404
    ```

- Search for zombie logs in your task logs. For example:

    ```text
    ERROR - Detected zombie job
    ```

    Because Airflow occasionally creates these logs with irregular spacing, search only for "zombie" to find all available zombie logs. 
    
### Solution: Prevent zombie tasks

Implement the following practices to limit zombie tasks on your Deployment:

- Ensure that you run at least 2 retries for all tasks by setting `retries=2` in your task parameters. 
- Whenever possible, use deferrable operators and sensors. These operators can mitigate zombie tasks because their execution often occurs outside of Airflow, meaning that the Airflow task itself won't be killed by the loss of a worker node.

### Solution: Upgrade to the latest patch of Astro Runtime 5 or validate DAGs

In Runtime 5.0.7 and earlier, it's possible for Airflow to produce zombie tasks by attempting to run a DAG with syntax errors. When you push breaking changes to an existing DAG on Astro:

- Airflow attempts to run a task that it detected from an earlier version of the DAG.
- The task fails and triggers `on_failure_callback` logic.
- Airflow doesn't know how to handle the `on_failure_callback` logic because it can't parse the broken DAG, and after 5 minutes produces a zombie task. 

If your DAG failed to parse, you might have one of the following logs in your task logs:

- `Broken DAG`
- `Failed to parse`
- `airflow.exceptions.AirflowTaskTimeout: DagBag import timeout`

If your Deployment has a DAG with syntax errors, complete one of the following actions to stop zombie tasks:

- Upgrade to the latest patch version Astro Runtime 5 or later. See [Upgrade Runtime](upgrade-runtime.md).
- Upgrade to Astro CLI 1.0 or later. Later versions of the Astro CLI parse your DAGs by default and prevent your from deploying DAGs if they contain syntax errors. See [Install the CLI](cli/install-cli.md).

### Troubleshoot step 1

Text

### Troubleshoot step 2

Text

### Troubleshoot step 3

Text

## Frequently asked questions

Text

### My code Deploys aren't working 

:::info

We can also use info boxes to communicate versions, required permissions, etc

:::

Text

### Why can't I use X with Y?

<Tabs
    defaultValue="runtime5"
    groupId= "install-the-astro-cli"
    values={[
        {label: 'Runtime 5 and earlier', value: 'runtime5'},
        {label: 'Runtime 5 and later', value: 'runtime6'},
    ]}>
<TabItem value="runtime5">

Info for <5

</TabItem>

<TabItem value="runtime6">

Info for >=6


</TabItem>
</Tabs>

### Error X when updating Runtime version X.XX


