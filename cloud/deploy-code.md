---
sidebar_label: 'Deploy Code'
title: 'Deploy Code to Astronomer'
id: deploy-code
description: Deploy Airflow DAGs to Astronomer Cloud.
---

import {siteVariables} from '@site/src/versions';

## Overview

Astronomer Cloud makes it easy for your team to test Airflow DAGs locally and push them to a Deployment in a Production or Development environment. The following diagram shows how your Astronomer project can be packaged and deployed to Astronomer Cloud via the Astronomer Cloud CLI.

:::info

The process for deploying an Astronomer project via CI/CD varies slightly from this diagram. For more information, refer to [CI/CD: Workflow Overview](ci-cd.md#workflow-overview).

:::

This guide explains how to deploy DAGs to a Deployment on Astronomer Cloud.

## Prerequisites

To deploy DAGs to Astronomer, you must have:

- The [Astronomer Cloud CLI](install-cli.md) installed in an empty directory.
- An Astronomer Workspace with at least one [Deployment](configure-deployment.md).
- An [Astronomer project](create-project.md).
- [Docker](https://www.docker.com/products/docker-desktop).

## Step 1: Authenticate to Astronomer

Once you've tested your DAGs locally, you're ready to push them to Astronomer. To start, authenticate via the Astronomer Cloud CLI by running:

```
astrocloud auth login
```

After running this command, you will be prompted to open your web browser and log in via the Astronomer UI. Once you complete this login, you will be automatically authenticated to the CLI.

## Step 2: Push DAGs to an Astronomer Deployment

To deploy your DAGs, run:

```
astrocloud deploy
```

This command returns a list of Airflow Deployments available in your Workspace and prompts you to pick one. Once this command is executed, all files in your Astronomer project directory are built into a new Docker image and pushed to Astronomer.

## Step 3: Validate Your Changes

If it's your first time deploying, expect to wait a few minutes for the Docker image to build. To confirm that your deploy was successful, open your Deployment in the Astronomer UI and click **Open Airflow** to access the Airflow UI.

Once you log in, you should see the DAGs you just deployed.

## What Happens During a Code Deploy

When you deploy code to Astronomer Cloud, your Astronomer project is built into a Docker image. This includes system-level dependencies, Python-level dependencies, DAGs, and your `Dockerfile`. It does not include any of the metadata associated with your local Airflow environment, including task history and Airflow Connections or Variables that were set locally. This Docker image is then pushed to all containers running the Apache Airflow application on Astronomer Cloud. With the exception of the Airflow Webserver and some workers, Kubernetes gracefully terminates all containers during this process. This forces them to restart and begin running your latest code.

![Deploy Code](/img/docs/deploy-architecture.png)

If you deploy code to a Deployment that is running a previous version of your code, then the following happens:

1. Tasks that are `running` will continue to execute on existing Celery workers and will not be interrupted unless the task does not complete within 24 hours of the code deploy.
2. One or more new worker(s) will spin up alongside your existing workers and immediately start executing scheduled tasks based on your latest code.

    These new workers will execute downstream tasks of DAG runs that are in progress. For example, if you deploy to Astronomer when `Task A` of your DAG is running, `Task A` will continue to run on an old Celery worker. If `Task B` and `Task C` are downstream of `Task A`, they will both be scheduled on new Celery workers running your latest code. This means that DAG runs could fail due to downstream tasks running code from a different source than their upstream tasks. These DAG runs will need to be fully restarted from the Airflow UI so that all tasks are executed based on the same source code.

Astronomer sets a grace period of 24 hours for all workers to allow running tasks to continue executing. This grace period is not configurable. If a task does not complete within 24 hours, its worker will be terminated. Airflow will mark the task as a [zombie](https://airflow.apache.org/docs/apache-airflow/stable/concepts/tasks.html#zombie-undead-tasks) and it will retry according to the task's retry policy. This is to ensure that our team can reliably upgrade and maintain Astronomer as a service.

:::tip

If you want to force long-running tasks to terminate sooner than 24 hours, specify an [`execution_timeout`](https://airflow.apache.org/docs/apache-airflow/stable/concepts/tasks.html#timeouts) in your DAG's task definition.

:::

## Next Steps

Now that you're familiar with deploying DAGs to Astronomer Cloud, consider reading:

- [Develop your Project](develop-project.md)
- [Set Environment Variables](environment-variables.md)

For up-to-date information about product limitations, read [Known Limitations](known-limitations.md).

If you have any questions, reach out to us. We're here to help.
