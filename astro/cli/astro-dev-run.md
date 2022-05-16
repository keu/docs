---
sidebar_label: "astro dev run"
title: "astro dev run"
id: astro-dev-run
description: Reference documentation for astro dev run.
---

## Description

Run [Airflow CLI commands](https://airflow.apache.org/docs/apache-airflow/stable/cli-and-env-variables-ref.html) in your local Airflow environment. This command is for local development only and cannot be applied to Deployments running on Astro.

## Usage

```sh
astro dev run <airflow-command>
```

## Examples

```sh
$ astro dev run create_user -r Admin -u admin -e admin@example.com -f admin -l user -p admin
# Run the Airflow CLI's `create_user` command in your local Airflow environment
```

## Related Commands

- [`astro dev logs`](cli/astro-dev-logs.md)
- [`astro dev ps`](cli/astro-dev-ps.md)
