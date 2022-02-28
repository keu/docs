---
sidebar_label: "astrocloud deployment delete"
title: "astrocloud deployment delete"
id: astrocloud-deployment-delete
description: Reference documentation for astrocloud deployment delete.
---

## Description

Delete a Deployment on Astro. This command is functionally identical to deleting a Deployment via the Cloud UI.

To complete this action, [Workspace Admin](user-permissions.md#workspace-roles) permissions are required.

## Usage

```sh
astrocloud deployment delete
```

## Options

| Option            | Description                                                         | Possible Values         |
| ----------------- | ------------------------------------------------------------------- | ----------------------- |
| `<deployment-id>` | The ID of the Deployment to delete         | Any valid Deployment ID |
| `-f`,`--force`    | Do not include a confirmation prompt before deleting the Deployment | ``                      |

## Examples

```sh
$ astrocloud deployment delete
# CLI prompts you for a Deployment to delete
$ astrocloud deployment delete ckvvfp9tf509941drl4vela81n -f
# Force delete a Deployment without a confirmation prompt
```

## Related Commands

- [`astrocloud deployment create`](cli-reference/astrocloud-deployment-create.md)
- [`astrocloud deployment list`](cli-reference/astrocloud-deployment-list.md)
