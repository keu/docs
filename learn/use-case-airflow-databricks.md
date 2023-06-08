---
title: "Short end-to-end pipeline analyzing renewable electricity data with Airflow, Databricks and the Astro Python SDK"
description: "Use Airflow, Databricks, the Astro Databricks provider and the Astro Python SDK in dynamic end-to-end pipeline."
id: use-case-airflow-databricks
sidebar_label: "Short end-to-end Airflow + Databricks pipeline"
sidebar_custom_props: { icon: 'img/integrations/databricks.png' }
---

import CodeBlock from '@theme/CodeBlock';
import uc_databricks_dag from '!!raw-loader!../code-samples/dags/use-case-airflow-databricks/uc_databricks_dag.py';

[Databricks](https://databricks.com/) is a popular unified data and analytics platform built around [Apache Spark](https://spark.apache.org/) that provides users with fully managed Apache Spark clusters and interactive workspaces. The open-source [Astro Databricks provider](https://github.com/astronomer/astro-provider-databricks) provides full observability and control from Airflow so you can manage your Workflows from one place, which enables you to orchestrate your Databricks notebooks from Airflow and execute them as Databricks Workflows.

This example shows a DAG that extracts data from three local CSV files containing the share of solar, hydro and wind electricity in different countries over several years, runs a transformation on each file and loads the results to S3, using [dynamic task mapping](dynamic-tasks.md) over operators from the [Astro Python SDK](https://astro-sdk-python.readthedocs.io/en/stable/index.html). Transformation steps in Databricks are fully integrated into the DAG as a task group via the Astro Databricks provider and filter and aggregate the data to get a combined measure of solar, hydro and wind electricity share for a user selected country. Lastly, a task created with the `@aql.dataframe` decorator from the Astro Python SDK leverages [seaborn](https://seaborn.pydata.org/) and [matplotlib](https://matplotlib.org/) to to create a line chart of the aggregated data.

![My electricity DAG screenshot](/img/examples/uc_databricks_dag_graph_full.png)

:::info

The full Astro project used in this example can be cloned from [this repository](https://github.com/astronomer/learn-airflow-databricks-tutorial). 

:::

## Before you start

Before trying this example, make sure you have:

- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- Access to a Databricks workspace. See [Databricks' documentation](https://docs.databricks.com/getting-started/index.html) for instructions. You can use any workspace that has access to the [Databricks Workflows](https://docs.databricks.com/workflows/index.html) feature. You need a user account with permissions to create notebooks and Databricks jobs. You can use any underlying cloud service, and a [14-day free trial](https://www.databricks.com/try-databricks) is available.
- Access to an [object storage supported by the Astro Python SDK](https://astro-sdk-python.readthedocs.io/en/stable/supported_file.html). This tutorial uses an [AWS S3](https://aws.amazon.com/s3/) bucket.
- Access to a [relational database supported by the Astro Python SDK](https://astro-sdk-python.readthedocs.io/en/stable/supported_databases.html). This tutorial uses [PostgreSQL](https://www.postgresql.org/).

## The Data

This example analyzes the share of solar, wind and hydro electricity for different countries. The full source data including other electricity modalities can be found in this [Kaggle dataset](https://www.kaggle.com/datasets/programmerrdai/renewable-energy) derived from [Our World in Data](https://ourworldindata.org/renewable-energy) (License [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)).

The subset of data used in this example can be found in this [GitHub repository](https://github.com/astronomer/learn-tutorials-data/tree/main/databricks-tutorial), and is read by the DAG from the `include` folder of the Astro project.

## Basic setup

Modify your Astro project with the following instructions.

`requirements.txt`:

```text
apache-airflow-providers-amazon==8.0.0
astro-provider-databricks==0.1.3
astro-sdk-python==1.6.0
seaborn==0.12.2
matplotlib==3.7.1
```

`.env`:

```text
AIRFLOW__CORE__ALLOWED_DESERIALIZATION_CLASSES = airflow\.* astro\.* astro_databricks\.*
```

`/include`:

Add the three CSV files with the electricity share data to the `include` folder in your Astro project.

#### Airflow connections

This example runs transformations in Databricks, stores information in an S3 bucket and utilizes a PostgreSQL database. Set a connection to each tool in the Airflow UI or as an environment variable. See [Manage connections in Apache Airflow](connections.md) for more information. You can use use other blob and database storage providers if they are [supported by the Astro Python SDK](https://astro-sdk-python.readthedocs.io/en/stable/supported_databases.html).

The Databricks connection needs to contain the following:

- **Connection ID**: `databricks_conn`.
- **Connection Type**: `Databricks`.
- **Host**: Your Databricks host address (format: `https://dbc-1234cb56-d7c8.cloud.databricks.com/`).
- **Login**: Your Databricks login username (email).
- **Password**: Your [Databricks personal access token](https://docs.databricks.com/dev-tools/auth.html#databricks-personal-access-tokens).

Connect to S3 by providing your AWS credentials:

- **Connection ID**: `aws_conn`.
- **Connection Type**: `Amazon Web Services`.
- **AWS Access Key ID**: Your [AWS Access Key ID](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html). 
- **AWS Secret Access Key**: Your AWS Secret Access Key.

For a connection to a PostgreSQL database, define the following parameters:

- **Connection ID**: `db_conn`.
- **Connection Type**: `Postgres`.
- **Host**: Your Postgres host address.
- **Schema**: Your Postgres database. 
- **Login**: Your Postgres login username.
- **Password**: Your Postgres password.
- **Port**: Your Postgres port.

:::info

If the right connection type for your tool isn't available, you might need to add the [relevant provider package](https://registry.astronomer.io/) to `requirements.txt` and run `astro dev restart`.

:::

## Databricks notebooks

The Astro Databricks provider used in this example can run any Databricks notebook as part of a Databricks workflow. The notebooks used in this example can be found in the accompanying [GitHub repository](https://github.com/astronomer/learn-airflow-databricks-tutorial/tree/main/databricks_notebook_code). 

:::info

If you are using a different object storage than AWS S3 you will need to change parts of the code in the notebooks to connect to your storage solution. S3 specific code is denoted with `# --------- AWS S3 specific --------- #` comments.

:::

## The short end-to-end DAG

Here is the short end-to-end DAG. Make sure to replace relevant variables such as `DATABRICKS_LOGIN_EMAIL` and `S3_BUCKET` to your information. You can also pick which country to analzye by changing the `COUNTRY` variable.

<CodeBlock language="python">{uc_databricks_dag}</CodeBlock>

This DAG uses the Astro Databricks provider to create a Databricks Workflow that runs two notebooks with the following tasks:

- The `in_tables` task uses the Astro Python SDK [`LoadFileOperator`](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/load_file.html) to load CSV files from your local `include` directory to your relational database. This task is [dynamically mapped](dynamic-tasks.md), creating one mapped task instance for each file.
- The `select_countries` task uses the Astro Python SDK [`aql.transform`](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/transform.html) decorator to run a SQL query selecting the relevant rows for `COUNTRY` from each of the temporary tables created by the previous task. The result is stored in another temporary table.
- The `save_files_to_S3` task uses the [ExportToFileOperator](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/export.html) to dynamically map over the country subsets created by the previous task and create one CSV file per table in your S3 bucket. This task uses the [`.map` function](dynamic-tasks.md#transform-outputs-with-map), a utility function that can transform XComArg objects.

- The `databricks_workflow` task group, created using the `DatabricksWorkflowTaskGroup` class, automatically creates a Databricks Workflow that executes the Databricks notebooks you specified in the individual DatabricksNotebookOperators. One of the biggest benefits of this setup is the use of a Databricks job cluster, allowing you to [significantly reduce your Databricks cost](https://www.databricks.com/product/pricing). The task group contains three tasks:
    - The `launch` task, which the task group automatically generates, provisions a Databricks `job_cluster` with the spec defined as `job_cluster_spec` and creates the Databricks job from the tasks within the task group.
    - The `join_data` task runs the `join_data` notebook in this cluster as the first part of the Databricks job. In this notebook the information from the three input CSVs is joined in one file, using Spark.
    - The `transform_data` task runs the `transform_data` notebook as the second part of the Databricks job. This notebook creates a new column in the data called `"SHW%"`, which contains the sum of the percentage of solar, wind, and hydro in your country's electricity supply.

- The `delete_intake_files_S3` task deletes all files from the `country_subset` folder in S3.
- The `load_file` task retrieves the CSV file that the `transform_data` Databricks notebook wrote to S3 and saves the contents in a temporary table in your relational database.
- The `create_graph` task uses the Astro Python SDK `@aql.dataframe` decorator to create a graph of the `"SHW%"` column. The graph is saved as a `.png` file in your `include` directory.
- Finally, the `cleanup` task uses the Astro Python SDK [`aql.cleanup`](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/cleanup.html) operator to clean up any temporary tables created by the Astro Python SDK when they are not needed anymore.

:::info

If you are using a different object storage you need to change the preceding DAG code, specifically the `OBJECT_STORAGE_CONN_ID` and the operator used in the `delete_intake_files_S3` task. To find relevant operators for your object storage see the [Astronomer registry](https://registry.astronomer.io/).

:::

## Results

After the DAG runs, the line graph showing combined share of solar, hydro and wind power in your selected country will appear in the `include` folder.

![SHW CH](/img/examples/uc_databricks_tutorial_shw_graph.png)

## See also

Tutorials:

- [Orchestrate dbt Core jobs with Airflow and Cosmos](airflow-databricks.md).
- [Write a DAG with the Astro Python SDK](astro-python-sdk.md).

Concept guides:

- [Airflow task groups](task-groups.md).
- [Manage connections in Apache Airflow](connections.md).

Documentation:

- [Astro Databricks provider](https://github.com/astronomer/astro-provider-databricks).
- [Astro Python SDK](https://astro-sdk-python.readthedocs.io/en/stable/index.html).
- [Databricks documentation](https://docs.databricks.com/).

Webinar:

- [How to Orchestrate Databricks Jobs Using Airflow](https://www.astronomer.io/events/webinars/how-to-orchestrate-databricks-jobs-using-airflow/).