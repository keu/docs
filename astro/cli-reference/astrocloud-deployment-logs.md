---
sidebar_label: "astrocloud deployment logs"
title: "astrocloud deployment logs"
id: astrocloud-deployment-logs
description: Reference documentation for astrocloud deployment logs.
---

## Description

Show Scheduler logs over the last 24 hours for a given Deployment. These Scheduler logs are the same logs that appear in the **Logs** tab of the Cloud UI.

## Usage

```sh
astrocloud deployment logs
```

## Options

| Option                   | Description                                  | Possible Values                     |
| ------------------------ | -------------------------------------------- | ----------------------------------- |
| `<deployment-namespace>` | The Deployment to show logs for              | Any existing Deployment's namespace |
| `-e`,`--error`           | Show only logs with a log level of `ERROR`   | ``                                  |
| `-w`,`--warn`            | Show only logs with a log level of `WARNING` | ``                                  |
| `-i`,`--info`            | Show only logs with a log level of `INFO`    | ``                                  |
| `-c`,`--log-count`       | The number of logs to show (default: `500`)  | Any integer                         |

## Examples

```sh
$ astrocloud deployment logs
# CLI prompts you for a Deployment to view logs for
$ astrocloud deployment logs quasarian-photon-9326
# View logs for a specific Deployment
$ astrocloud deployment logs quasarian-photon-9326 --error --log-count=25
# Show only the last 25 error-level logs for a specific Deployment
```

## Related Commands

- [`astrocloud dev logs`](cli-reference/astrocloud-dev-logs.md)
- [`astrocloud dev run`](cli-reference/astrocloud-dev-run.md)
- [`astrocloud dev ps`](cli-reference/astrocloud-dev-ps.md)
