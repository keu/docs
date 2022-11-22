---
sidebar_label: 'Data lineage and Snowflake'
title: "Data lineage and Snowflake"
id: data-lineage-and-snowflake
description: Learn about the Snowflake-specific aspects of data lineage in Astro.
---

[Data lineage](https://en.wikipedia.org/wiki/Data_lineage) is the concept of tracking and observing data flowing through a data pipeline. You can use data lineage to understand data sources, troubleshoot run failures, manage  personally identifiable information (PII), and ensure compliance with data regulations.

## How lineage is collected for Snowflake

Astro’s lineage is powered by OpenLineage, the open-source standard for creating and transferring lineage information about your data pipelines. OpenLineage handles more than just the connections between tables in a database, it supplies rich metadata about the tasks that create and transform data, giving data stakeholders the tools needed to trace data’s entire history as well as understand the particularities of tasks. In this document, we’ll understand what all this means in relation to Snowflake.

 Generally, the kinds of lineage information you’ll find for Snowflake matches that of other datasources. OpenLineage has two basic lineage elements: the task and the dataset. The task can be an Airflow task, a Great Expectations run, a Spark execution, or a dbt model run. The dataset corresponds to a table in a database or a dataframe used in task execution.

The OpenLineage integration with Snowflake is different from other SQL databases because OpenLineage gets additional data directly from Snowflake in the form of query tags. When running a supported operator in Airflow that executes a SQL query, the lineage obtained from the operator is the parsed query, input and output datasets, and potentially some database-specific run information. In the case of running a `SnowflakeOperator` in Airflow, the database-specific run information is the Snowflake query tag, which allows each task to be directly matched with the query or queries run in Snowflake by that task. The additional information obtained from the query tag provides a level of detail into task execution that other databases do not have, allowing engineers to pinpoint specific queries that can be investigated in Snowflake in the case of failure, lowering mean time to resolution.

## What lineage is collected for Snowflake

Different lineage data is collected for different backends and when using different OpenLineage integrations. All lineage data is collected in facets, and different facets are generated for different backends. Additionally, different facets are created if using Airflow, Great Expectations, dbt, Spark, or another integration. In this section, you will learn about which facets and what lineage information is collected for Snowflake.

The lineage information for an Airflow task running a `SnowflakeOperator` collected includes task and query durations. These are logged and can be compared in the Lineage UI, so data stakeholders can see not just the average execution times, but any outliers as well, which can set off alerts. For Snowflake, the query a task runs is also logged and displayed in the `Info` tab. Additionally, upstream and downstream datasets are visible when a task is selected in the UI.

The dataset lineage includes the table schema, with type information and descriptions where given, which forms a local data dictionary. Quality metrics are also aggregated on data, based on dataset- and column-level checks. These checks show success and failures over the course of runs. Metadata metrics for row count and bytes received is also displayed. These check facets can be populated via the `SQLColumnCheckOperator`, `SQLTableCheckOperator`, Great Expectations, or dbt test.

Together, this information provides a robust amount of data in a user-friendly environment to assist data stakeholders in analyzing their pipelines and tracing data throughout.

When collecting lineage data for Snowflake with Airflow emitting OpenLineage, you should expect to collect information about the input and output datasets of jobs for certain queries. This will show up in the Lineage UI tab in Astro as a link between the relevant Airflow task and the datasets it operates on. Data is also enriched by Snowflake’s query tags when running tasks on Airflow using the `SnowflakeOperator` and `SnowflakeAsyncOperator` by adding that tag to the job’s run facet.

### Unsupported queries

Currently, unsupported queries in Airflow include:
- `COMMENT IF EXISTS ON TABLE...`
- `CREATE STAGE IF NOT EXISTS...`
- `CREATE OR REPLACE TABLE...`
- `DROP TABLE IF EXISTS...`
- `COPY INTO...`

### Viewing lineage in the UI

#### Datasets

When looking at a dataset in the UI representing a Snowflake table, the Info tab about that table shows: 

- Column names
- Data types
- Descriptions, where applicable

You can also see how different columns change over time, either being renamed or having their data type updated. 

In the Inputs/Outputs tab, you’ll find a list of all the tasks that take this dataset as either an input or an output, and clicking on the task names will take you to a view of the task.

In the quality tab, you will see quality checks and information at the dataset and column levels. 

When using Great Expectations, the `SQLColumnCheckOperator` or the `SQLTableCheckOperator`, specific data quality checks will show up as a graph under either the Dataset subheading if the check is running at a dataset level, or the Columns subheading if the check is running on a column. When using Great Expectatiosn or dbt test, information about the number of rows and number of bytes in the dataset will be displayed under the Dataset subheading. The SQL check operators, Great Expectations, and dbt test will all create `Assertion` facets that are displayed when hovering over the dataset, showing assertion names and whether the last run resulted in success or failure.

#### Tasks

When looking at a task in the UI representing a Snowflake run, the Info tab will display the parsed SQL query, including any comment at the top of the file.

The Inputs/Outputs tab will link to the upstream and downstream datasets.

The duration tab logs the task durations.
