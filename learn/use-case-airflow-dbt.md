---
title: "Create an ELT pipeline with Airflow, dbt Core, Cosmos, and the Astro Python SDK"
description: "Use Airflow, dbt Core, Cosmos and the Astro Python SDK in an ELT pipeline to analyze energy data."
id: use-case-airflow-dbt
sidebar_label: "ELT with Airflow + dbt + Astro SDK"
sidebar_custom_props: { icon: 'img/integrations/dbt.png' }
---

import CodeBlock from '@theme/CodeBlock';
import cosmos_energy_dag from '!!raw-loader!../code-samples/dags/use-case-airflow-dbt/cosmos_energy_dag.py';

[dbt Core](https://docs.getdbt.com/) is a popular open-source library for analytics engineering that helps users build interdependent SQL models. Thanks to the [Cosmos](https://astronomer.github.io/astronomer-cosmos/) provider package, you can integrate any dbt project into your DAG with only a few lines of code. The open-source [Astro Python SDK](https://astro-sdk-python.readthedocs.io/en/stable/index.html) greatly simplifies common ELT tasks like loading data and allows users to easily use Pandas on data stored in a data warehouse. 

This example shows a DAG that loads data about changes in solar and renewable energy capacity in different European countries from a local CSV file into a data warehouse. Transformation steps in dbt Core filter the data for a country selected by the user and calculate the percentage of solar and renewable energy capacity for that country in different years. Depending on the trajectory of the percentage of solar and renewable energy capacity in the selected country, the DAG will print different messages to the logs.

![My energy DAG screenshot](/img/examples/uc_dbt_my_energy_dag_screenshot.png)

## Before you start

Before trying this example, make sure you have:

- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- An Astro project running locally on your computer. See [Getting started with the Astro CLI](https://docs.astronomer.io/astro/cli/get-started-cli).
- Access to a data warehouse supported by dbt Core and the Astro Python SDK. See [dbt supported warehouses](https://docs.getdbt.com/docs/supported-data-platforms) and [Astro Python SDK supported warehouses](https://astro-sdk-python.readthedocs.io/en/stable/supported_databases.html). This example uses a local [PostgreSQL](https://www.postgresql.org/) database with a database called `energy_db` and a schema called `energy_schema`.

## Clone the project

You can clone the example project from this [Astronomer GitHub](https://github.com/astronomer/astro-dbt-provider-tutorial-example). Make sure to create a file called `.env` with the contents of the `.env_example` file in the project root directory and replace the connection details with your own.

## Data source

This example analyzes changes in solar and renewable energy capacity in different European countries. The full source data provided by [Open Power System Data](https://doi.org/10.25832/national_generation_capacity/2020-10-01) includes information on many types of energy capacity. The subset of data used in this example can be found in this [GitHub repository](https://github.com/astronomer/learn-tutorials-data/blob/main/subset_energy_capacity.csv), and is read by the DAG from the `include` folder of the Astro project.

## Project contents

The DAG in this use case consists of two tasks and one task group:

- The `load_file` task uses the [Astro Python SDK `load file` operator](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/load_file.html) to load the contents of the local CSV file into the data warehouse.
- The `transform_data` task group is created from the dbt models. The task group contains two nested task groups with two tasks each, one for `dbt run`, the other for `dbt test`.
- The `log_data_analysis` task uses the [Astro Python SDK dataframe operator](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/dataframe.html) to run an analysis on the final table using `pandas` and logs the results.

Cosmos' `DbtTaskGroup` function automatically scans the `dbt` folder for dbt projects and creates a task group (`transform_data` in this example) containing Airflow tasks for running and testing your dbt models. Additionally, Cosmos can infer dependencies within the dbt project and will set your Airflow task dependencies accordingly.

You can choose which country's data to analyze by specifying your desired `country_code` in the `dbt_args` parameter of the DbtTaskGroup. See the [dataset](https://github.com/astronomer/learn-tutorials-data/blob/main/subset_energy_capacity.csv) for all available country codes.

## Results

After the DAG runs, the logs of the `log_data_analysis` task show the proportion of solar and renewable energy capacity development in the country you selected.

![Energy Analysis logs](/img/guides/cosmos_energy_analysis_logs.png)

## Setup

If you want to set up a the project from scratch follow these instructions.

### Astro project

Modify your Astro project so each of the named files contain the provided information.

1. `Dockerfile`:

    ```Dockerfile
    FROM quay.io/astronomer/astro-runtime:8.4.0

    # install dbt into a virtual environment
    # replace dbt-snowflake with the adapter you need
    RUN python -m venv dbt_venv && source dbt_venv/bin/activate && \
        pip install --no-cache-dir dbt-snowflake && deactivate

    ENV AIRFLOW__CORE__ALLOWED_DESERIALIZATION_CLASSES = airflow\.* astro\.*
    ```

2. `requirements.txt`:

    ```text
    astronomer-cosmos==0.7.0
    astro-sdk-python==1.6.1
    ```

3. `.env`:

    ```text
    # replace with your connection details to your data warehouse
    AIRFLOW_CONN_DB_CONN='{
        "conn_type": "Postgres",
        "login": "<your-postgres-login>",
        "password": "<your-postgres-password>",
        "host": "<your-postgres-host>",
        "port": <your_postgres-port>,
        "schema": "energy_db",
    }'
    ```

4. `/include`: Add the [CSV file](https://github.com/astronomer/learn-tutorials-data/blob/main/subset_energy_capacity.csv) with the energy data to the `include` folder in your Astro project.

:::info 

This example runs ELT operations in a data warehouse. The connection set in `.env` is for a PostgreSQL database but you can use any data warehouse [supported by both dbt](https://docs.getdbt.com/docs/supported-data-platforms) and the [Astro Python SDK](https://astro-sdk-python.readthedocs.io/en/stable/supported_databases.html). Both dbt Core via Cosmos and the Astro Python SDK will be able to use the same Airflow connection.

:::

### dbt Core models

When using Cosmos, any dbt project can be converted into an Airflow task group by putting it in a `dbt` directory within the Astro projects `dags` folder.

1. Create a `dbt` directory in the `dags` folder of your Astro project.

2. Create a `my_energy_project` directory in the `dbt` directory.

3. Create a file called `dbt_project.yml` in the `my_energy_project` dbt project with the following contents:

    ```yml
    name: 'my_energy_project'
    # while you need to name a profile, you do not need to have a profiles.yml file defined when using Cosmos
    profile: my_profile
    models:
    my_energy_project:
        materialized: table
    # create a variable called country_code and give it the default value "FR" (for France)
    vars:
    country_code: "FR"
    ```

4. Create a `models` directory in the `my_energy_project` dbt project.

5. Create a file called `select_country.sql` in the `models` directory with the following contents:

    ```sql
    select 
        "YEAR", "COUNTRY", "SOLAR_CAPACITY", "TOTAL_CAPACITY", "RENEWABLES_CAPACITY"
    from energy_db.energy_schema.energy
    where "COUNTRY" = '{{ var("country_code") }}'
    ```

6. Create a file called `create_pct.sql` in the `models` directory with the following contents:

    ```sql
    select 
        "YEAR", "COUNTRY", "SOLAR_CAPACITY", "TOTAL_CAPACITY", "RENEWABLES_CAPACITY",
        "SOLAR_CAPACITY" / "TOTAL_CAPACITY" AS "SOLAR_PCT",
        "RENEWABLES_CAPACITY" / "TOTAL_CAPACITY" AS "RENEWABLES_PCT"
    from {{ ref('select_country') }}
    where "TOTAL_CAPACITY" is not NULL
    ```

:::info

If you are using a different data warehouse than Postgres you might need to adapt the `FROM` statement in the first model and potentially the SQL dialect in both dbt models.

:::

### DAG

Add the following DAG to your `dags` directory in a file called `my_energy_dag.py`.

<CodeBlock language="python">{cosmos_energy_dag}</CodeBlock>

### Project structure

The resulting file structure of the Astro project is:

```text
.
├── dags
│   ├── dbt
│   │   └── my_energy_project
│   │      ├── dbt_project.yml
│   │      └── models
│   │          ├── select_country.sql
│   │          └── create_pct.sql
│   └── my_energy_dag.py
└── include
    └── subset_energy_capacity.csv
```

## See also

Tutorials:

- [Orchestrate dbt Core jobs with Airflow and Cosmos](airflow-dbt.md).
- [Orchestrate dbt Cloud jobs with Airflow](airflow-dbt-cloud.md).
- [Write a DAG with the Astro Python SDK](astro-python-sdk.md).

Concept guides:

- [What is dbt?](https://docs.getdbt.com/docs/introduction).
- [Airflow task groups](task-groups.md).
- [Manage connections in Apache Airflow](connections.md).

Documentation:

- [Astronomer Cosmos](https://astronomer.github.io/astronomer-cosmos/).
- [Astro Python SDK](https://astro-sdk-python.readthedocs.io/en/stable/index.html).

Webinars:

- [The easiest way to orchestrate your dbt workflows from Airflow](https://www.astronomer.io/events/webinars/the-easiest-way-to-orchestrate-your-dbt-workflows-from-airflow/).
- [Simplified DAG authoring with the Astro SDK](https://www.astronomer.io/events/webinars/simplified-dag-authoring-with-the-astro-sdk/).