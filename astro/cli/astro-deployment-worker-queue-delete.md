---
sidebar_label: "astro deployment worker-queue delete"
title: "astro deployment worker-queue delete"
id: astro-deployment-worker-queue-delete
description: Reference documentation for astro deployment worker-queue delete.
---

Update the settings for an existing [worker queue](configure-deployment-resources.md#worker-queues).

## Usage

```sh
astro deployment worker-queue delete
```

## Options

| Option                         | Description                                                                            | Possible Values                                                                |
| ------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `-d`,`--deployment-id`           |      The ID of the Deployment whose worker queue you want to delete                           | Any valid Deployment ID |
| `--deployment-name` | The name of the Deployment whose worker queue you want to delete. Use as an alternative to `<deployment-id>` | Any valid Deployment name                                            |
| `-f` `--force` | Skip prompting the user to confirm the deletion | `` |
| `-n`,`--name`    | The name of the worker queue to delete     |Any string |

