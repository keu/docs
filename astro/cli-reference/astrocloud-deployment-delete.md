---
sidebar_label: "astrocloud deployment delete"
title: "astrocloud deployment delete"
id: astrocloud-deployment-delete
description: Reference documentation for astrocloud deployment delete.
---

## Description

Delete a Deployment on Astro.

## Usage

```sh
astrocloud deployment delete
```

## Options

| Option                   | Description                                                         | Possible Values                     |
| ------------------------ | ------------------------------------------------------------------- | ----------------------------------- |
| `<deployment-namespace>` | The namespace of the Deployment to delete.                          | Any existing Deployment's namespace |
| `-f`,`--force`           | Do not include a confirmation prompt before deleting the Deployment | ``                                  |

## Examples

```sh
$ astrocloud deployment delete
# CLI prompts you for a Deployment to delete
$ astrocloud deployment delete quasarian-photon-9326 -f
# Force delete a Deployment without any prompts
```

## Related Commands

- [`astrocloud deployment create`](cli-reference/astrocloud-deployment-create.md)
- [`astrocloud deployment list`](cli-reference/astrocloud-deployment-list.md)
