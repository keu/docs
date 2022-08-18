---
title: 'Write DAGs with the Astro Python SDK'
sidebar_label: 'Astro Python SDK'
id: astro-python-sdk
description: Learn how you can manage database queries in Python using the Astro SDK.
---

The Astro Python SDK is an open source DAG development platform built and maintained by Astronomer. The purpose of the SDK is to abstract away Airflow's code-level configuration and let DAG authors focus on writing Python code.

The Astro SDK uses [decorators](https://realpython.com/primer-on-python-decorators/) and the TaskFlow API to extend the behaviors of your Python functions and properly configure them for use in Airflow. Specifically, the Astro SDK decorators remove the need to specify Xcoms, dependencies, and downstream database connections in your DAG.

## Use cases

You can use the SDK to write any ETL pipeline that you could typically run in Airflow. The Astro SDK is optimized for DAG authors who want to focus data transformations instead of Airflow configurations. Writing a DAG with the Astro SDK is more similar to writing a traditional Python script than it is to writing an Airflow DAG.

## Installation

To install the Astro Python SDK in a local environment:

1. Add the following line to the `requirements.txt` file of your Astro project:

    ```text
    astro-sdk-python
    ```

2. Add the following environment variables to the `.env` file of your Astro project

    ```text
    AIRFLOW__CORE__ENABLE_XCOM_PICKLING=True
    AIRFLOW__ASTRO_SDK__SQL_SCHEMA=<snowflake_schema>
    ```

    To use the Astro Python SDK on a Deployment, add these environment variables in your Deployment's configuration. See [Environment variables](environment-variables.md).

## Available functions

The Astro SDK includes task decorators for the most common actions you would want to complete in an ETL pipeline. Some of the key functions available are:

- `load_file`: Loads a given file into a SQL table.
- `transform`: Applies a SQL select statement to a source table and saves the result to a destination table.
- `drop_table`: Drops a SQL table.
- `run_raw_sql`: Run any SQL statement without handling its output
- `append`: Insert rows from the source SQL table into the destination SQL table, if there are no conflicts
- `merge`: Insert rows from the source SQL table into the destination SQL table, depending on conflicts:
- `export_file`: Export SQL table rows into a destination file.
- `dataframe`: Export given SQL table into in-memory Pandas data-frame.

## Example

The following DAG is a complete implementation of an ETL pipeline using the Astro Python SDK. In order, the DAG:

- Loads `.csv` files from GitHub into `Tables`, which are objects that contain all of the necessary functionality to pass database contexts between functions without reconfiguration.
- Extract the data from the files into a new temporary `Table` using `aql.transform`.
- Turn the temporary `Table` into a dataframe and melt the values using `aql.dataframe`.
- Create a new reporting table in Snowflake using `aql.run_raw_sql`.
- Convert the dataframe back into a SQL table and append it to the reporting table with `aql.append`.

```python
import os
from datetime import datetime
import pandas as pd
from airflow.decorators import dag
from astro.files import File
from astro import sql as aql
from astro.sql.table import Metadata, Table
SNOWFLAKE_CONN_ID = "snowflake_conn"
AWS_CONN_ID = "aws_conn"
# The first transformation combines data from the two source tables
@aql.transform
def extract_data(homes1: Table, homes2: Table):
    return """
    SELECT *
    FROM {{homes1}}
    UNION
    SELECT *
    FROM {{homes2}}
    """
# Switch to Python (Pandas) for melting transformation to get data into long format
@aql.dataframe
def transform_data(df: pd.DataFrame):
    df.columns = df.columns.str.lower()
    melted_df = df.melt(
        id_vars=["sell", "list"], value_vars=["living", "rooms", "beds", "baths", "age"]
    )
    return melted_df
# Run a raw SQL statement to create the reporting table if it doesn't already exist
@aql.run_raw_sql
def create_reporting_table():
    """Create the reporting data which will be the target of the append method"""
    return """
    CREATE TABLE IF NOT EXISTS homes_reporting (
      sell number,
      list number,
      variable varchar,
      value number
    );
    """
@dag(start_date=datetime(2021, 12, 1), schedule_interval="@daily", catchup=False)
def example_s3_to_snowflake_etl():
    # Initial load of homes data csv's from S3 into Snowflake
    homes_data1 = load_file(
        task_id="load_homes1",
        input_file=File(path="s3://airflow-kenten/homes1.csv", conn_id=AWS_CONN_ID),
        output_table=Table(name="HOMES1", conn_id=SNOWFLAKE_CONN_ID)
    )
    homes_data2 = load_file(
        task_id="load_homes2",
        input_file=File(path="s3://airflow-kenten/homes2.csv", conn_id=AWS_CONN_ID),
        output_table=Table(name="HOMES2", conn_id=SNOWFLAKE_CONN_ID)
    )
    # Define task dependencies
    extracted_data = extract_data(
        homes1=homes_data1,
        homes2=homes_data2,
        output_table=Table(name="combined_homes_data"),
    )
    transformed_data = transform_data(
        df=extracted_data, output_table=Table(name="homes_data_long")
    )
    create_reporting_table = create_reporting_table(conn_id=SNOWFLAKE_CONN_ID)
    # Append transformed data to reporting table
    # Dependency is inferred by passing the previous `transformed_data` task to `source_table` param
    record_results = aql.append(
        source_table=transformed_data,
        target_table=Table(name="homes_reporting", conn_id=SNOWFLAKE_CONN_ID),
        columns=["sell", "list", "variable", "value"],
    )
    record_results.set_upstream(create_results_table)
example_s3_to_snowflake_etl_dag = example_s3_to_snowflake_etl()
```

This Astro SDK implementation is different from a standard TaskFlow implementation in the following ways:

- You don't have to pull in tables as XComs. All operations between different database types are handled automatically by the SDK.
- You don't have to define connections top your databases in each task. Tasks can automatically inherit connection information from `Tables`.
- You can run SQL queries directly without first defining them. The SDK includes decorators for common actions in SQL that you would otherwise have to write yourself.

## Documentation

For more documentation about the Astro Python SDK, see:

- [Astro Python SDK README](https://github.com/astronomer/astro-sdk): Includes an overview of the SDK, a quickstart, and supported database types.
- [readthedocs.io](https://astro-sdk.readthedocs.io/en/latest/): Complete SDK documentation, including API and operator references.
