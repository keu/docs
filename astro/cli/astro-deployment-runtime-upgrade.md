---
sidebar_label: "astro deployment runtime upgrade"
title: "astro deployment runtime upgrade"
id: astro-deployment-runtime-upgrade
description: Reference documentation for astro deployment runtime upgrade.
---

:::info 

This command is available only if you're authenticated to an Astronomer Software installation. 

:::

Initializes the Runtime version upgrade process on any Deployment on Astronomer.

### Usage

Run `astro deployment runtime upgrade --deployment-id` to initialize the Runtime upgrade process. To finalize the Runtime upgrade process, complete all of the steps as described in [Upgrade Apache Airflow on Astronomer Software](https://docs.astronomer.io/software/manage-airflow-versions).

If you do not specify `--desired-runtime-version`, this command creates a list of available Runtime versions that you can select. The Astro CLI lists only the available Runtime versions that are later than the version currently specified in your `Dockerfile`.


### Flags

| Flag                        | Description                                                                                                                    | Possible values
| --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--cancel` | Cancel the upgrade                                                                | None | 
| `--deployment-id`           | The ID of the Deployment for which you want to upgrade Runtime. To find your Deployment ID, run `astro deployment list`.     | Any Deployment ID |
| `--desired-runtime-version` | The Runtime version you're upgrading to (for example, `2.2.0`).                                                                | Any supported Runtime version | 



### Examples 

```
# Upgrade to Runtime 6.0.0
$ astro deployment runtime --deployment-id telescopic-sky-4599 --desired-runtime-version 6.0.0
```