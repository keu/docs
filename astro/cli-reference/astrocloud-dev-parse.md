---
sidebar_label: "astrocloud dev parse"
title: "astrocloud dev parse"
id: astrocloud-dev-parse
description: Reference documentation for astrocloud dev parse.
---

## Description

Run several tests on your project code. These tests call all declared OS-level variables, Airflow Connections, and Airflow Variables to check whether each of those objects has a value.

Additionally, this command runs prebuilt unit tests on your Astro project using Pytest. These unit tests are the same ones that are included by default with your project as described in [Test DAGs Locally with Pytest](test-and-troubleshoot-locally.md#test-dags-locally-with-pytest).

## Usage

```sh
astrocloud dev parse
```

## Options

| Option              | Description                                                                                   | Possible Values                                 |
| ------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `-e`, `--env`       | The filepath to your environment variables. The default is `.env`)                            | Any valid filepath within your Astro project    |

## Examples

```sh
# Run standard unit tests
astrocloud dev parse

# Specify alternative environment variables
astrocloud dev parse --env=myAlternativeEnvFile.env
```

## Related Commands

- [`astrocloud dev pytest`](cli-reference/astrocloud-dev-pytest.md)
- [`astrocloud dev start`](cli-reference/astrocloud-dev-start.md)
- [`astrocloud deploy`](cli-reference/astrocloud-deploy.md)
