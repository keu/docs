---
sidebar_label: "astro deployment delete"
title: "astro deployment delete"
id: astro-deployment-delete
description: Reference documentation for astro deployment delete.
---

Delete a Deployment on Astro. This command is functionally identical to deleting a Deployment via the Cloud UI.

When you run `astro deployment delete`, you are prompted to select from a list of Deployments that you have access to across Workspaces. You can bypass this prompt and specify a Deployment name or ID in the command. To retrieve a Deployment ID, go to your Deployment's information page in the Cloud UI and copy the value after the last `/` in the URL. You can also find a Deployment ID or name by running `astro deployment list`.

:::info

To complete this action, [Workspace Admin](user-permissions.md#workspace-roles) permissions are required.

:::

## Usage

```sh
astro deployment delete
```

## Options

| Option            | Description                                                         | Possible Values         |
| ----------------- | ------------------------------------------------------------------- | ----------------------- |
| `<deployment-id>` | The ID of the Deployment to delete         | Any valid Deployment ID |
| `-f`,`--force`    | Do not include a confirmation prompt before deleting the Deployment | ``                      |
| `--workspace-id` | Specify a Workspace to delete a Deployment outside of your current Workspace | Any valid Workspace ID                                            |
| `--deployment-name` | The name of the Deployment to delete. Use as an alternative to `<deployment-id>`. | Any valid Deployment name                                            |

## Examples

```sh
$ astro deployment delete
# CLI prompts you for a Deployment to delete
$ astro deployment delete ckvvfp9tf509941drl4vela81n -f
# Force delete a Deployment without a confirmation prompt
$ astro deployment delete --deployment-name="My deployment"
# Delete a Deployment by specifying its name.
```

## Related Commands

- [`astro deployment create`](cli/astro-deployment-create.md)
- [`astro deployment list`](cli/astro-deployment-list.md)
