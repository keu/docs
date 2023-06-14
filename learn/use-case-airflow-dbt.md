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

:::info

For simple instructions on how to use dbt Core with Cosmos, see the [dbt Core tutorial](airflow-dbt.md).

:::

## Before you start

Before trying this example, make sure you have:

- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- An Astro project running locally on your computer. See [Getting started with the Astro CLI](https://docs.astronomer.io/astro/cli/get-started-cli).
- Access to a data warehouse supported by dbt Core and the Astro Python SDK. See [dbt supported warehouses](https://docs.getdbt.com/docs/supported-data-platforms) and [Astro Python SDK supported warehouses](https://astro-sdk-python.readthedocs.io/en/stable/supported_databases.html). This example uses a local [PostgreSQL](https://www.postgresql.org/) database with a database called `energy_db` and a schema called `energy_schema`.

## Clone the project

Clone the example project from this [Astronomer GitHub](https://github.com/astronomer/astro-dbt-provider-tutorial-example). Make sure to create a file called `.env` with the contents of the `.env_example` file in the project root directory and replace the connection details with your own.
## Run the project

To run the example project, first make sure Docker Desktop is running. Then, open your project and run:

```sh
astro dev start
## Data source

This example analyzes changes in solar and renewable energy capacity in different European countries. The full source data provided by [Open Power System Data](https://doi.org/10.25832/national_generation_capacity/2020-10-01) includes information on many types of energy capacity. The subset of data used in this example can be found in this [GitHub repository](https://github.com/astronomer/learn-tutorials-data/blob/main/subset_energy_capacity.csv), and is read by the DAG from the `include` folder of the Astro project.

## Project contents

This project consists of one DAG, [my_energy_dag](https://github.com/astronomer/astro-dbt-provider-tutorial-example/blob/main/dags/my_energy_dag.py), which performs an ELT process using two tasks defined with Astro Python SDK operators and one task group created through Cosmos that orchestrates a dbt project consisting of two models.

First, the full dataset containing solar and renewable energy capacity data for several European cities is loaded into the data warehouse using the [Astro Python SDK `load file` operator](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/load_file.html). Using the Astro Python SDK in this step allows you to easily switch between data warehouses, simply by changing the connection ID.

```python
load_data = aql.load_file(
    input_file=File(CSV_FILEPATH),
    output_table=Table(
        name="energy",
        conn_id=CONNECTION_ID,
        metadata=Metadata(
            database=DB_NAME,
            schema=SCHEMA_NAME,
        ),
    ),
)
```

Then, the `transform_data` task group is created using the `DbtTaskGroup` class from Cosmos:

```python
dbt_tg = DbtTaskGroup(
    group_id="transform_data",
    dbt_project_name=DBT_PROJECT_NAME,
    conn_id=CONNECTION_ID,
    dbt_root_path=DBT_ROOT_PATH,
    dbt_args={
        "dbt_executable_path": DBT_EXECUTABLE_PATH,
        "schema": SCHEMA_NAME,
        "vars": '{"country_code": "CH"}',
    },
    profile_args={
        "schema": SCHEMA_NAME,
    },
)
```

The Airflow tasks within the task group are automatically inferred by Cosmos from the dependencies between the two dbt models: 

- The first model, [`select_country`](https://github.com/astronomer/astro-dbt-provider-tutorial-example/blob/main/dags/dbt/my_energy_project/models/select_country.sql), queries the table created by the previous task and creates a subset of the data by only selecting rows for the country that was specified as the `country_code` variable in the `dbt_args` parameter of the `DbtTaskGroup`. See the [dataset](https://github.com/astronomer/learn-tutorials-data/blob/main/subset_energy_capacity.csv) for all available country codes.

    ```sql
    select 
        "YEAR", "COUNTRY", "SOLAR_CAPACITY", "TOTAL_CAPACITY", "RENEWABLES_CAPACITY"
    from energy_db.energy_schema.energy
    where "COUNTRY" = '{{ var("country_code") }}'
    ```

- The second model, [`create_pct`](https://github.com/astronomer/astro-dbt-provider-tutorial-example/blob/main/dags/dbt/my_energy_project/models/create_pct.sql), divides both the solar and renewable energy capacity by the total energy capacity for each year calculating the fractions of these values. Note how the dbt `ref` function creates a dependency between this model and the upstream model `select_country`. Cosmos then automatically translates this into a dependency between Airflow tasks.

    ```sql
    select 
        "YEAR", "COUNTRY", "SOLAR_CAPACITY", "TOTAL_CAPACITY", "RENEWABLES_CAPACITY",
        "SOLAR_CAPACITY" / "TOTAL_CAPACITY" AS "SOLAR_PCT",
        "RENEWABLES_CAPACITY" / "TOTAL_CAPACITY" AS "RENEWABLES_PCT"
    from {{ ref('select_country') }}
    where "TOTAL_CAPACITY" is not NULL
    ```

Finally, the `log_data_analysis` task uses the [Astro Python SDK dataframe operator](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/dataframe.html) to run an analysis on the final table and logs the results.

```python
@aql.dataframe
def log_data_analysis(df: pd.DataFrame):

    "... code to determine the year with the highest solar and renewable energy capacity ..."

    if latest_year == year_with_the_highest_solar_pct:
        task_logger.info(
            f"Yay! In {df.COUNTRY.unique()[0]} adoption of solar energy is growing!"
        )
    if latest_year == year_with_the_highest_renewables_pct:
        task_logger.info(
            f"Yay! In {df.COUNTRY.unique()[0]} adoption of renewable energy is growing!"
        )
```

The files come together in the following project structure:

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
├── include
│   └── subset_energy_capacity.csv
├── Dockerfile
└── requirements.txt
```

## Results

After the DAG runs, the logs of the `log_data_analysis` task show the proportion of solar and renewable energy capacity development in the country you selected.

![Energy Analysis logs](/img/guides/cosmos_energy_analysis_logs.png)

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