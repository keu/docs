---
sidebar_label: 'Astro SDK'
title: "Install the Astro SDK"
id: install-astro-sdk
description: Learn how to set up your environment to begin using the Astro SDK.
---

## Overview

This document explains how to set up your environment to begin using the Astro SDK.

The Astro SDK is a suite of tools for writing ETL and ELT workflows in Airflow. By simplifying data transformations between different environments, the library enables you to focus on data engineering instead of configuration. By design, `astro` modules automatically pass database contexts to your tasks, meaning that you can focus on writing code and leave metadata definitions for load time.

## Prerequisites

While not an explicit requirement for using the Astro SDK, we recommend downloading the [Astro CLI](install-cli.md) and [creating an Astro project](create-project.md) for use with this documentation. These tools make it easier to configure your environment and deploy code that utilizes the SDK. The following setup assumes that you are using an Astro project structure.

## Setup

To start using the Astro SDK:

1. Install the library in one of the following ways:

    - Run `pip install astro-projects`.
    - Add `astro-projects` to the `requirements.txt` file of an Astro project.

2. Set the following environment variable in a way that's accessible to your project:  

    ```
    AIRFLOW__CORE__ENABLE_XCOM_PICKLING=True
    ```

### Set a Temporary Schema

When processing SQL-based DAGs, Astro creates temporary tables so that SQL table outputs can be inherited by other tasks and inspected for data quality.

To better manage the cleanup of these tables, Astro stores all of these tables in a temporary schema that a database admin can delete with a single command. By default, the name of the temporary schema is “tmp_astro”.

You can change the name of this schema to match the needs of your Airflow application. To do so, set the following environment variable:

```text
AIRFLOW__ASTRO__SQL_SCHEMA="<schema-name>"
```

## Next Steps

Once your environment is fully configured to use the Astro library, you can start writing DAGs using the [Python SDK](python-sdk.md).
