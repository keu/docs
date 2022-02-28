---
sidebar_label: "astrocloud deployment create"
title: "astrocloud deployment create"
id: astrocloud-deployment-create
description: Reference documentation for astrocloud deployment create.
---

## Description

Create a Deployment on Astro. This command is functionally identical to [creating a Deployment](configure-deployment.md) via the Cloud UI.

## Usage

```sh
astrocloud deployment create
```

## Options

| Option                      | Description                                                                        | Possible Values                                                          |
| --------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `-c`, `--cluster-id`        | The Cluster to create the Deployment in                                            | The name of any Cluster that you can create Deployments in               |
| `-d`,`--description`        | The Deployment's description                                                       | Any string. Multiple-word descriptions should be specified in quotations |
| `-l`,`--name`        | The Deployment's name                                                       | Any string. Multiple-word descriptions should be specified in quotations |
| `-v`,`--runtime-version`    | The Deployment's Runtime version                                                   | Any supported Runtime version                                            |
| `-s`,`--scheduler-au`       | The number of AU to allocate towards the Deployment's Scheduler (default: `5`)     | Integer between `0` and `30`                                             |
| `-a`,`--worker-au`          | The number of AU to allocate towards the Deployment's workers (default: `10`)      | Integer between `0` and `175`                                            |
| `-r`,`--scheduler-replicas` | The number of Scheduler replicas to allocate towards the Deployment (default: `1`) | Integer between `0` and `4`                                              |

## Examples

```sh
$ astrocloud deployment create
# CLI prompts you for a Deployment name and Cluster
$ astrocloud deployment create -d="My Deployment Description" --name="My Deployment Name" --cluster-id="dev-us-west"
# Create Deployment without CLI prompts
$ astrocloud deployment create -a=50
# Specify 50 AU for the Deployment's workers. CLI still prompts you for required Deployment information
```

## Related Commands

- [`astrocloud deployment delete`](cli-reference/astrocloud-deployment-delete.md)
