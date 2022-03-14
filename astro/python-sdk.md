---
sidebar_label: 'Python SDK'
title: 'Using the Astro Python SDK'
id: python-sdk
description: Learn how to use the Astro Python SDK.
---

## Overview

The Python SDK simplifies ETL pipelines for Python engineers working in Airflow by treating SQL tables as Python objects. Using decorators, SQL tables can be manipulated, joined, templatized, and turned into dataframes using Python.

For each step of your pipeline, the SDK automatically passes database context, dependencies, and formatting so that you can focus on writing Python over database configuration.

## Prerequisites

To use the Python SDK, you must first install the Astro SDK as described in [Setup the Astro SDK](install-astro-sdk).

To run the demo code in this guide on your own machine, you need:

- The [Astro CLI](install-cli.md).
- An [Astro project](create-project.md).
- [Docker](https://www.docker.com/).

### Demo Setup  

Several of the examples in this project are based on a Postgres instance populated with the [pagila](https://dataedo.com/samples/html/Pagila/doc/Pagila_10/home.html) dataset. This is a standard open dataset provided by Postgres that has a number of movies, actors, and directors.

To set up the pagila dataset on your local machine:

1. Run the following Docker command:

   ```sh
   docker run --rm -it -p 5433:5432 pagila-test &
   ```

2. In your Astro project, create an Airflow connection to the dataset using the following command:

    ```sh
    astrocloud dev run airflow connections add 'postgres_conn' \
        --conn-type 'postgresql' \
        --conn-login 'postgres' \
        --conn-password 'postgres' \
        --conn-host 'localhost' \
        --conn-port '5433'
    ```

## Creating Tables

To create or import a SQL table in the `astro` ecosystem, you can create a `Table` object. The `Table` object contains all of the metadata that's necessary for handling SQL table creation between Airflow tasks. `astro` can automatically pass metadata from a `Table` to downstream tasks, meaning that you only need to define your database context once at the start of your DAG.

In the following example, a SQL table is defined in the DAG instantiation. In each subsequent task, you only need to pass in an input table. This is because `astro` automatically passes in the additional context from the original `input_table` parameter.

```python {10-12}
from astro import sql as aql
from astro.sql.table import Table

# Context is passed from the DAG instantiation
@aql.transform
def my_first_sql_transformation(input_table: Table):
    return "SELECT * FROM {{input_table}}"

with dag:
    my_table = my_first_sql_transformation(
        input_table=Table(table_name="actor", database="pagila", conn_id="postgres_conn")
    )
```

### The TempTable Class

If you want to ensure that the output of your task is a table that can be deleted at any time for garbage collection, you can declare it as a nameless `TempTable`. This places the output into your `temp` schema, which can then be bulk deleted. By default, all `aql.transform` functions will output to a `TempTable` unless a `Table` object is used in the `output_table` argument.

The following example DAG sets `output_table` to a nameless `TempTable`, meaning that any output from this DAG will be deleted once the DAG completes. If you wanted to keep your output, you would simply update the parameter to instantiate a `Table` instead.


```python {18}
from astro import sql as aql
from astro.sql.table import Table, TempTable

# Context is passed from the DAG instantiation
@aql.transform
def my_first_sql_transformation(input_table: Table):
    return "SELECT * FROM {{input_table}}"

@aql.transform
def my_second_sql_transformation(input_table_2: TempTable):
    return "SELECT * FROM {{input_table_2}}"

with dag:
    my_table = my_first_sql_transformation(
        # Table will persist after DAG finishes
        input_table=Table(table_name="actor", database="pagila", conn_id="postgres_conn"),
        # TempTable will not persist after DBA cleans temp schema
        output_table=TempTable(database="pagila", conn_id="postgres_conn"),
    )
    my_second_sql_transformation(input_table_2=my_table)
```

## Loading Data from Storage

You can import data from a variety of data sources with the `load_file` function. The result of this function can be either an `Table` or a dataframe. For a full list of supported file locations and file types, see the [Astro README](https://github.com/astro-projects/astro#supported-technologies).

In the following example, data is loaded from S3 by specifying the path and connection ID for an S3 database using `aql.load_file`. The result of this load is stored in a `Table` that can be used as an input table in later transformations:

```python {10-14}
from astro import sql as aql
from astro.sql.table import Table

@aql.transform
def my_first_sql_transformation(input_table: Table):
    return "SELECT * FROM {{input_table}}"

with dag:
    # Load a CSV directly into a new Table
    raw_orders = aql.load_file(
        path="s3://my/s3/path.csv",
        file_conn_id="my_s3_conn",
        output_table=Table(table_name="my_table", conn_id="postgres_conn"),
    )
    my_first_sql_transformation(input_table=raw_orders)
```

:::info

To interact with any external storage services, you need to first configure them as Airflow connections. For example, to interact with S3, you must first set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables in your project.

:::

## Transforming Data

After loading tables into your DAG, you can transform them. The `aql.transform` function serves as the "T" of the ETL system. Each use of the function creates a new output table from the `SELECT` statement. Tasks can pass these tables as if they were native Python objects.

The following example DAG shows how you can quickly pass tables between tasks when completing a data transformation:

```py
from astro import sql as aql
from astro.sql.table import Table

@aql.transform
def get_orders(orders_table: Table):
    """Basic clean-up of an existing table."""
    return """SELECT customer_id, count(*) AS purchase_count FROM {orders_table}
        WHERE purchase_date >= DATEADD(day, -7, '{{ execution_date }}')"""

@aql.transform(customers_table: Table)
def get_customers(customer_table: Table = Table("customer")):
    """Basic clean-up of an existing table."""
    return """SELECT customer_id, source, region, member_since
        FROM {[customer_table}} WHERE NOT is_deleted"""

@aql.transform
def join_orders_and_customers(orders_table: Table, customer_table: Table):
    """Join `orders_table` and `customers_table` to create a simple feature dataset."""
    return """SELECT c.customer_id, c.source, c.region, c.member_since,
        CASE WHEN purchase_count IS NULL THEN 0 ELSE 1 END AS recent_purchase
        FROM {orders_table} c LEFT OUTER JOIN {customer_table} p ON c.customer_id = p.customer_id"""

with dag:
    raw_orders = aql.load_file(
    ...
    )
    orders = get_orders(raw_orders)
    customers = get_customers(input_table=Table(table_name="foo", conn_id="postgres_conn", database="pagila"))
    join_orders_and_customers(orders, customers)
```

The functions in this example use a templating system that's specific to the Python SDK. Wrapping a value in double brackets (like `{{ execution_date }}`) indicates that the value will be rendered as a SQL table or an Airflow jinja template.

Please note that the SQL expression should not be an F-string. F-strings in SQL formatting risk security breaches via SQL injections.

For security, users must explicitly identify tables in the function parameters by typing a value as a `Table`. Only then can the SQL decorator treat the value as a table.

### Raw SQL

Most ETL use cases can be addressed by cross-sharing task outputs, as shown with the example of `@aql.transform`.

If you need to perform a SQL operation that doesn't return a table but might require a table as an argument, such as dropping or altering a table, you can use `@aql.run_raw_sql`.

```python
@aql.run_raw_sql
def drop_table(table_to_drop):
    return "DROP TABLE IF EXISTS {{table_to_drop}}"
```

## Working with Dataframes

You can use the `astro.dataframe` function to complete data analysis on a pandas dataframe. This function takes a `Table` as an argument and will trea it as a dataframe any additional configuration, meaning that you can automatically finish your data processing in a Pythonic context.

You can also convert a dataframe back into a SQL table by passing this function a `Table` or `TempTable` in the `output_table` argument.

In the following example, the `actor` SQL table is automatically passed to `astro.dataframe` as a dataframe. The contents of the dataframe are printed, and then the dataframe is converted back into a SQL table using the `output_table` argument:

```python {14-16,22}
import os
from datetime import datetime, timedelta

from airflow.models import DAG

from astro import sql as aql
from astro.dataframe import dataframe
import pandas as pd

dag = DAG(
   ...
)

@dataframe
def my_dataframe_func(df: pd.DataFrame):
   print(df.to_string)


dir_path = os.path.dirname(os.path.realpath(__file__))
with dag:
   input_table=Table(table_name="actor", database="pagila", conn_id="postgres_conn")
   my_dataframe_func(df=actor, output_table=TempTable(conn_id="my_snowflake_conn"))
```

## Rendering Tables

Instead of defining your SQL queries in your DAG code, you can use the `render` function to pass an external SQL query to your DAG. In the following example, the SQL model, arguments, and Airflow connection information are defined as arguments of `aql.render`:

```python
with self.dag:
    f = aql.render(
        # Define input table
        conn_id="postgres_conn",
        database="pagila",
        # Run SQL query on the table from external file
        sql=str(cwd) + "/my_sql_function.sql",
        parameters={
            "actor": Table("actor"),
            "film_actor_join": Table("film_actor"),
            "unsafe_parameter": "G%%",
        },
        # Load results into output table
        output_table=Table("my_table_from_file"),
    )
```

### Rendering a Set of Models

You can use the `aql.render` function to manage multiple SQL queries from an external directory. In this workflow, all task dependencies and database contexts are defined as frontmatter in your `.sql` files.  

For example, consider the following project structure:

```text
Your project
├── dags
│   ├── astro_dag.py
│   ├── models
│   │   ├── test_astro.sql
│   │   ├── test_inheritance.sql
```

In this example, your DAG should run the `test_astro` query first, followed by `test_inheritance`. This time, however, all database context and dependencies will be defined directly in the `sql` query files.

To define a database context in a `.sql` file, you can use the `conn_id` and `database` frontmatter options. For example, the following frontmatter defines the database context for `test_astro.sql`:

```SQL title="/dags/models/test_astro.sql" {1-4}
---
conn_id: postgres_conn
database: pagila
---
SELECT * FROM actor;
```

This context will be automatically passed to any downstream queries.

To define a downstream query, specify the upstream table in the downstream query using a jinja template. For example, the following query will run only after `test_astro.sql` has completed:

```SQL title="/dags/models/test_inheritance.sql" {1-4}
SELECT * FROM {{test_astro}};
```

Because all database contexts and dependencies are defined in your `.sql` files, you only need to run `aql.render` once to execute your queries as Airflow tasks with set dependencies.

```Python title="/dags/astro_dag.py" {15}
import os
from datetime import datetime, timedelta

from airflow.models import DAG

from astro import sql as aql

dag = DAG(
   ...
)

dir_path = os.path.dirname(os.path.realpath(__file__))
with dag:
   # Load final results of queries into a new table
   models = aql.render(dir_path + "/models")
```
