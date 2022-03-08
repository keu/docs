---
sidebar_label: 'SQL SDK'
title: 'Using the Astro SQL SDK'
id: python-sdk
description: Learn how to use the Astro Python SDK.
---

## Overview

The Python SDK simplifies the experience of using SQL for Python engineers working in Airflow. It allows you to treat SQL tables as if they're Python objects. Using decorators, SQL tables can be manipulates, joined, templatized, and turned into dataframes using Python.

## Prerequisites

To use the Python SDK, you must:

- Install the Astro SDK as described in [Setup the Astro SDK](install-astro-sdk).

## Input and Output Tables

Before you can complete any data transformations, you need to define input and output tables for Airflow. You can do this in either of the following ways:

- Using an existing table, define `input_table` and `output_table` with `Table` or `TempTable` objects in the parameters of your DAG instantiations.
- Load data from storage into a new table.

### The Table class

To instantiate a table or bring in a table from a database into the `astro` ecosystem, you can pass a `Table` object into your DAG. The `Table` object contains all of the metadata that's necessary for handling table creation between tasks. After you define a `Table's` metadata in the beginning of your pipeline, `astro` can automatically pass that metadata along to downstream tasks.

In the following example, your SQL table is defined in the DAG instantiation. In each subsequent task, you only pass in an input table argument because `astro` automatically passes in the additional context from your original `input_table` parameter.

```python
from astro import sql as aql
from astro.sql.table import Table

@aql.transform
def my_first_sql_transformation(input_table: Table):
    return "SELECT * FROM {{input_table}}"

@aql.transform
def my_second_sql_transformation(input_table_2: Table):
    return "SELECT * FROM {{input_table_2}}"

with dag:
    my_table = my_first_sql_transformation(
        input_table=Table(table_name="foo", database="bar", conn_id="postgres_conn")
    )
    my_second_sql_transformation(my_table)
```

### The TempTable Class

If you want to ensure that the output of your task is a table that can be deleted at any time for garbage collection, you can declare it as a nameless `TempTable`. This places the output into your `temp` schema, which can be later bulk deleted. By default, all `aql.transform` functions will output to TempTables unless a `Table` object is used in the `output_table` argument.

The following example DAG sets the `output_table` to a nameless `TempTable`, meaning that any output from this DAG will be deleted once the DAG completes. If you wanted to keep your output, you would simply update the parameter to instantiate a `Table` instead.


```python
from astro import sql as aql
from astro.sql.table import Table, TempTable

@aql.transform
def my_first_sql_transformation(input_table: Table):
    return "SELECT * FROM {{input_table}}"

@aql.transform
def my_second_sql_transformation(input_table_2: Table):
    return "SELECT * FROM {{input_table_2}}"

with dag:
    my_table = my_first_sql_transformation(
        # Table will persist after DAG finishes
        input_table=Table(table_name="foo", database="bar", conn_id="postgres_conn"),
        # TempTable will not persist after DAG finishes
        output_table=TempTable(database="bar", conn_id="postgres_conn"),
    )
    my_second_sql_transformation(my_table)
```

### Loading Data from Storage as a Table

You can load CSV or parquet data from either local, S3, or GCS storage into a SQL database with the `load_file` function. The result of this function can be used as an input table in your DAG.

In the following example, data is loaded from S3 by specifying the path and connection ID for an S3 database using `aql.load_file`. The result of this load is stored in a `Table` that can be used as an input table in later transformations:

```python
from astro import sql as aql
from astro.sql.table import Table

with dag:

    raw_orders = aql.load_file(
        path="s3://my/s3/path.csv",
        file_conn_id="my_s3_conn",
        output_table=Table(table_name="my_table", conn_id="postgres_conn"),
    )
```

:::info

To interact with S3, you must first set an S3 Airflow connection in the `AIRFLOW__ASTRO__CONN_AWS_DEFAULT` environment variable.

:::

## Transform

The `transform` function of the SQL decorator serves as the "T" of the ELT system. Each step of the transform pipeline creates a new table from the `SELECT` statement. Tasks can pass these tables as if they were native Python objects.

The following example DAG shows how you can quickly pass tables between tasks when completing a data transformation:

```python
#
@aql.transform
def get_orders():
    ...

@aql.transform
def get_customers():
    ...

@aql.transform
def join_orders_and_customers(orders_table: Table, customer_table: Table):
    """Join `orders_table` and `customers_table` to create a simple 'feature' dataset."""
    return """SELECT c.customer_id, c.source, c.region, c.member_since,
        CASE WHEN purchase_count IS NULL THEN 0 ELSE 1 END AS recent_purchase
        FROM {orders_table} c LEFT OUTER JOIN {customer_table} p ON c.customer_id = p.customer_id"""

with dag:
    orders = get_orders()
    customers = get_customers()
    join_orders_and_customers(orders, customers)
```

Note that the functions in this example use a templating system that's specific to the Python SDK. Wrapping a value in single brackets (like `{customer_table}`) indicates the value needs to be rendered as a SQL table. The SQL decorator also treats values in double brackets as Airflow jinja templates.

Please note that the SQL expression should not be an F-string. F-strings in SQL formatting risk security breaches via SQL injections.

For security, users must explicitly identify tables in the function parameters by typing a value as a `Table`. Only then can the SQL decorator treat the value as a table.

### Transform File

Instead of defining your SQL queries in your DAG code, you can use the `transform_file` function to pass an external SQL file to your DAG.

```python
with self.dag:
    f = aql.transform_file(
        sql=str(cwd) + "/my_sql_function.sql",
        conn_id="postgres_conn",
        database="pagila",
        parameters={
            "actor": Table("actor"),
            "film_actor_join": Table("film_actor"),
            "unsafe_parameter": "G%%",
        },
        output_table=Table("my_table_from_file"),
    )
```

### Raw SQL

Most ETL use cases can be addressed by cross-sharing task outputs, as shown with the example of `@aql.transform`.

If you need to perform a SQL operation that doesn't return a table but might require a table as an argument, you can use `@aql.run_raw_sql`.

```python
@aql.run_raw_sql
def drop_table(table_to_drop):
    return "DROP TABLE IF EXISTS {{table_to_drop}}"
```

## Complete Example DAG

The following is a full example DAG of a SQL + Python workflow using `astro`. It pulls data from S3, runs SQL transformations to merge the pulled data with existing data, and moves the result of that merge into a dataframe so that you can complete complex work on it using Python / ML.

This DAG also showcases the different ways you can set contexts using the Astro library. For example, `get_customers` has its database context set in the SQL decorator, while `aggregate_orders` has its context set in the DAG instantiation. Both of these syntaxes are valid and can coexist with the help of the Astro library.

```python
from datetime import datetime, timedelta

from airflow.models import DAG
from pandas import DataFrame

from astro import sql as aql
from astro import dataframe as df

from astro.sql.table import Table

default_args = {
    "owner": "airflow",
    "retries": 1,
    "retry_delay": 0,
}

dag = DAG(
    dag_id="astro_example_dag",
    start_date=datetime(2019, 1, 1),
    max_active_runs=3,
    schedule_interval=timedelta(minutes=30),
    default_args=default_args,
)

@aql.transform
def aggregate_orders(orders_table: Table):
    """Basic clean-up of an existing table."""
    return """SELECT customer_id, count(*) AS purchase_count FROM {orders_table}
        WHERE purchase_date >= DATEADD(day, -7, '{{ execution_date }}')"""

@aql.transform(conn_id="postgres_conn", database="pagila")
def get_customers(customer_table: Table = Table("customer")):
    """Basic clean-up of an existing table."""
    return """SELECT customer_id, source, region, member_since
        FROM {[customer_table}} WHERE NOT is_deleted"""

@aql.transform
def join_orders_and_customers(orders_table: Table, customer_table: Table):
    """Join two tables together to create a very simple 'feature' dataset."""
    return """SELECT c.customer_id, c.source, c.region, c.member_since,
        CASE WHEN purchase_count IS NULL THEN 0 ELSE 1 END AS recent_purchase
        FROM {{orders_table}} c LEFT OUTER JOIN {{customer_table}} p ON c.customer_id = p.customer_id"""

@df
def perform_dataframe_transformation(df: DataFrame):
    """Train model with Python. You can import any python library you like and treat this as you would a normal
    dataframe.
    """
    recent_purchases_dataframe = df.loc[:, "recent_purchase"]
    return recent_purchases_dataframe

@df
def dataframe_action_to_sql(df: DataFrame):
    """
    This function gives us an example of a dataframe function that we intend to put back into SQL. The only thing we need to keep in mind for a SQL return function is that the result has to be a dataframe. Any non-dataframe return will result in an error, as there's no way for us to know how to upload the object to SQL.
    """  
    return df

SOURCE_TABLE = "source_finance_table"

s3_path = (
    f"s3://astronomer-galaxy-stage-dev/thanos/{SOURCE_TABLE}/"
    "{{ execution_date.year }}/"
    "{{ execution_date.month }}/"
    "{{ execution_date.day}}/"
    f"{SOURCE_TABLE}_"
    "{{ ts_nodash }}.csv"
)

with dag:
    """Structure DAG dependencies.
    """

    raw_orders = aql.load_file(
        path="s3://my/s3/path.csv",
        file_conn_id="my_s3_conn",
        output_table=Table(table_name="foo", conn_id="postgres_conn"),
    )
    agg_orders = aggregate_orders(raw_orders)
    customers = get_customers()
    features = join_orders_and_customers(customers, agg_orders)
    simple_df = perform_dataframe_transformation(df=features)
    # By defining the output_table in the invocation, we are telling astro where to put the result dataframe
    dataframe_action_to_sql(
        simple_df, output_table=Table(table_name="result", conn_id="postgres_conn")
    )
```
