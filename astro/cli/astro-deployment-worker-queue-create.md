---
sidebar_label: "astro deployment worker-queue create"
title: "astro deployment worker-queue create"
id: astro-deployment-worker-queue-create
description: Reference documentation for astro deployment worker-queue create.
---

Create a [worker queue](../configure-deployment-resources.md#worker-queues).

## Usage

```sh
astro deployment worker-queue create
```

## Options

| Option                         | Description                                                                            | Possible Values                                                                |
| ------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `--concurrency`           |     The maximum number of tasks that each worker can run                          | Any integer from 1 to 64 |
| `-d`,`--deployment-id`           |      The ID of the Deployment where you want to create the worker queue                           | Any valid Deployment ID |
| `--deployment-name` | The name of the Deployment where you want to create the worker queue. Use as an alternative to `<deployment-id>` | Any valid Deployment name                                            |
| `-f` `--force` | Skip prompting the user to confirm the update | `` |
| `--max-count`                  |        The maximum worker count of the worker queue                                                          | Any integer from 0 to 30       |
| `--min-count`                  |        The minimum worker count of the worker queue                                                          | Any integer from 0 to 30       |
| `-n`,`--name`    | The name of the worker queue     |Any string |
| `-t`,`--worker-type`          | The worker type of the worker queue          | Any worker type enabled on the Deployment |


## Examples 

```sh
astro deployment worker-queue create --deployment-id cl03oiq7d80402nwn7fsl3dmv
# Creates a new worker queue in a Deployment, CLI prompts you for all configuration information.

astro deployment worker-queue create --concurrency 20 --max-count 10 --min-count 2 --name "My worker queue" --worker-type "m5d.8xlarge"
# Creates a new worker queue in a Deployment, CLI prompts you for Deployment information.
```