---
title: "Creating the Snowflake Connection"
id: snowflake
sidebar_label: Snowflake
---

<head>
  <meta name="description" content="Learn how to create the Snowflake Connection." />
  <meta name="og:description" content="Learn how to create the Snowflake Connection." />
</head>

[Snowflake](https://www.snowflake.com/en/) is a cloud data warehouse to store and analyze your data.

## Prerequisites
- Local Airflow environment using [Astro CLI](https://docs.astronomer.io/astro/cli/overview)
- Snowflake account which is accessible from your Airflow server
- A Snowflake user and password. See [Create a Snowflake User](https://docs.snowflake.com/en/sql-reference/sql/create-user.html) for more details.
- Python requirement `apache-airflow-providers-snowflake` should be added to `requirements.txt`

## Get Connection details

1. From your Snowflake login URL, get your `host`, `account`, `region`. For example, if your URL is `https://gp12345.us-east-1.snowflakecomputing.com/`, your connection parameters will be:
    - **`host`**    : `gp12345.us-east-1.snowflakecomputing.com`
    - **`account`** : `gp12345`
    - **`region`**  : `us-east-1`

2. Get your `database` and `warehouse`. If you are using Snowflake Classic Console, you can see the `Warehouses` and `Databases` from the header on the page. If you are using the new Snowflake App Console, you can see `Warehouses` from the **Admin** menu and `Databases` from the **Data** menu in the left panel.

You can also get the connection details from the bottom left corner of your Snowflake Account and hovering over your required account.

## Create your connection

To create a Snowflake connection, you can either use the password or password-less Key Pair authentication.

### Using Airflow UI

1. Use the details captured in [Get Connection Details](snowflake#get-connection-details).
2. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as **Snowflake**.
3. You can either enter the details in the indvidual fields or just enter **Login**, **Password** fields and remaining in **Extra** as shown in the screenshot below.
4. Click on **Test** connection to test and then **Save** the connection.

![snowflake-connection-extra](/img/guides/connection-snowflake-extra.png)

For GCP, Snowflake connection region might look different as shown in screenshot below:

![snowflake-connection-extra](/img/guides/connection-snowflake-gcp.png)

### Without Airflow UI

You can also create Airflow connections using Environment Variables or in Secrets Backend using URI or JSON format. 

#### URI

```bash
snowflake://<USERNAME>:<PASSWORD>@<HOST-ENDPOINT>?extra__snowflake__account=<SNOWFLAKE-ACCOUNT>&extra__snowflake__database=<DATABASE>&extra__snowflake__region=<REGION>&extra__snowflake__warehouse=<WAREHOUSE>
```

#### JSON

```json
{
    "conn_type": "snowflake",
    "login": "user",
    "password": "password",
    "schema": "db-schema",
    "extra": {
        "account": "account",
        "database": "database",
        "region": "east",
        "warehouse": "snow-warehouse"
    }
}
```

## How it works

Airflow Snowflake provider uses the python package [Snowflake connector](https://github.com/snowflakedb/snowflake-connector-python) to connect to Snowflake.

## References

- [`CREATE USER`](https://docs.snowflake.com/en/sql-reference/sql/create-user) in Snowflake.
- [Key Pair Authentication](https://docs.snowflake.com/en/user-guide/key-pair-auth) in Snowflake.
- [OSS Airflow Snowflake Connection](https://airflow.apache.org/docs/apache-airflow-providers-snowflake/stable/connections/snowflake.html).