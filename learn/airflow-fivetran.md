---
title: "Use Fivetran with Apache Airflow"
sidebar_label: "Fivetran"
description: "How to orchestrate Fivetran sync jobs from within Airflow"
id: airflow-fivetran
---

import CodeBlock from '@theme/CodeBlock';
import fivetran_tutorial_dag_1 from '!!raw-loader!../code-samples/dags/airflow-fivetran/fivetran_tutorial_dag_1.py';

[Fivetran](https://www.fivetran.com/) is a popular ELT platform built to automate ingestion of data from a variety of sources into a database, offering pre-built integration elements called Connectors, Transformations and Destinations for many common data tools.

In this tutorial, you'll learn how to install and use the Airflow Fivetran provider to submit and monitor Fivetran sync jobs.

## Time to complete

This tutorial takes approximately 1.5 hours to complete.

## Assumed knowledge

To get the most out of this tutorial, make sure you have an understanding of:

- The basics of Fivetran. See Fivetran's [Getting started](https://fivetran.com/docs/getting-started) documentation.
- Airflow fundamentals, such as writing DAGs and defining tasks. See [Get started with Apache Airflow](get-started-with-airflow.md).
- Airflow operators. See [Operators 101](what-is-an-operator.md).

## Prerequisites

- A Fivetran account. Fivetran offers a [14-day free trial](https://fivetran.com/signup) for new customers.
- The [Astro CLI](https://docs.astronomer.io/astro/cli/get-started).
- An active [GitHub](https://github.com/) account with the permissions appropriate for the following GitHub scopes: `repo`, `read:org`, `admin:org_hook`, `admin:repo_hook`.

## Step 1: Configure your Astro project

1. Create a new Astro project:

    ```sh
    $ mkdir astro-fivetran-project && cd astro-fivetran-project
    $ astro dev init
    ```

2. Add the following packages to your `requirements.txt` file:

    ```text
    airflow-provider-fivetran-async
    airflow-provider-fivetran
    astronomer-providers[all]
    ```

3. In your `.env` file add the following Airflow connection with the Connection ID `in_docker_file_conn`. This connection will be used by the `FileSensor` in subsequent steps. It does not need any credentials since it simply connects to the file system of your Airflow environment.

    ```text
    AIRFLOW_CONN_IN_DOCKER_FILE_CONN='fs://'
    ```

3. Run the following command to start your project in a local environment:

    ```sh
    astro dev start
    ```

## Step 2: Create a new private GitHub repository

We will use metadata from a GitHub repository as a data source for Fivetran. While you can connect to any existing repository in your account we recommend to use a new repository in order to prevent large amounts of data to be ingested.

1. [Create a new private GitHub repository](https://docs.github.com/en/get-started/quickstart/create-a-repo) called `airflow-fivetran-tutorial`.
2. Commit at least one change to the repository. The content of your commit does not matter for this tutorial.

## Step 3: Connect Fivetran to a destination

Fivetran needs at least one destination to be configured in order to create sync jobs. A destination is a relational database where your ingested data will be loaded into.

1. Log into your [Fivetran account](https://www.fivetran.com/). 

2. Click on **Destinations** in the sidebar on the left side of the screen and then on **ADD DESTINATION** in the upper right corner.

2. Choose either **Connect your destination** or **I don't have one**. For this tutorial you can either connect to an existing data warehouse you have access to by following the [relevant Fivetran documentation](https://fivetran.com/docs/databases) or use a [Fivetran-managed BigQuery service](https://fivetran.com/docs/destinations/bigquery/managed-bigquery). In this tutorial we will use Fivetrans managed BigQuery service by selecting **I don't have one** and then clicking on **CONTINUE SETUP**.

    ![Fivetran Destination](/img/guides/fivetran_destination.png)

:::info

If you choose to connect to an existing data warehouse make sure you are able to connect a BI tool to it if you want to complete the optional Step 8. In Step 8 we will use [Tableau](https://www.tableau.com/) to visualize our data but you are free to use any BI tool compatible with your data warehouse.

:::

3. Configure your destination connection. You can choose the configuration freely. Astronomer recommends to use UTC as your timezone in all data tools as a best practice to. Click **SAVE & TEST** to save your destination.

    ![Fivetran-managed BigQuery](/img/guides/fivetran_managed_bigquery.png)

4. Click **Continue** to get back to the list of your destinations.

    ![Fivetran-managed BigQuery connection successful](/img/guides/fivetran_managed_bigquery_conn_success.png)

## Step 4: Connect Fivetran to a connector

Fivetran needs at least one connector to be configured in order to create sync jobs. A connector is one of many data sources. View the Fivetran website for an [up-to-date list of connectors](https://www.fivetran.com/connectors).

1. Click on **Connectors** in the sidebar on the left side of the screen and then on **ADD CONNECTOR** in the upper right corner.

2. Select the GitHub Connector and click on **CONTINUE SETUP**.

3. Configure the GitHub Connector. Name the schema `in_github`. To connect Fivetran to GitHub you can use either [OAuth or a Personal Access Token](https://fivetran.com/docs/applications/github/setup-guide). Choose your method of authentication and click **AUTHORIZE**. In this tutorial we use OAuth authentication. 

    ![GH Connector](/img/guides/github_connector.png)

4. Authenticate Fivetran to your Github Account.

    ![Authorize Fivetran to GH](/img/guides/authorize_fivetran_github.png)

5. Select the repository `your-github-username/airflow-fivetran-tutorial` repository to be synced. You don't need to enable Webhooks for this tutorial.

    ![Select tutorial repository](/img/guides/fivetran_select_tutorial_repo.png)

6. Click **SAVE & TEST**. After your connection has been tested click **CONTINUE**.

7. Click on **Start Sync** to start your initial sync. This will extract metadata about your GitHub repository and load it into your destination. Once the initial sync is completed your Fivetran job is active, you can set the sync frequencies under the **Setup** tab.

    ![Initial sync completed](/img/guides/complete_initial_sync.png)

## Step 5: Generate a Fivetran API key

We have now created a Fivetran sync job that will extract new metadata from a GitHub repository and load it into a relational database on a time-based schedule. But what if we want to run the sync job every time a specific event happens in our data ecosystem? This is where orchestration via Airflow can help Fivetran sync jobs to become event-driven. 

In order to connect Airflow to Fivetran you will need a Fivetran API key. 

1. Click on you account name in the right Fivetran sidebar and then on **API Key**. 

    ![Fivetran generate API key](/img/guides/fivetran_generate_api_key.png)

2. Click **Generate API Key** and make sure to store the information displayed in a secure place.

## Step 6: Create an Airflow connection to Fivetran

1. Navigate to your Airflow UI at `localhost:8080`.

2. Click on **Admin** -> **Connections** -> **+** to create a new connection.

3. Name your connection `fivetran_conn` and select the **Fivetran** connection type. Provide your Fivetran API Key and Fivetran API Secret. If the connection type does not show up, double check that you added the Fivetran provider to your `requirements.txt` file prior to last starting your Airflow instance.

    ![Fivetran generate API key](/img/guides/fivetran_airflow_connection.png)

4. Click **Test** to test your connection. Once you see `Connection tested successfully` click **Save**.

## Step 5: Create your Airflow DAG

1. Open your `astro-fivetran-project` in a code-editor.

2. In your `dags` folder add a new Python file called `my_fivetran_dag.py`. 

3. Copy and past the following DAG code into the file:

    <CodeBlock language="python">{fivetran_tutorial_dag_1}</CodeBlock>

This DAG contains two tasks: 

- the `wait_for_file` task uses the [FileSensor](https://registry.astronomer.io/providers/apache-airflow/modules/filesensor) to wait for a file to drop at a specific file path in the environment configured in the connection provided to `fs_conn_id`. In Step 1 you already added a connection with the ID `in_docker_file_conn` that connects to the Airflow environment within the Docker file. The `filepath` parameter in the copied DAG code uses a [Jinja template](templating.md) to wait for a csv file with a name starting with the logical date of the DAG in the format `yyyy-mm-dd` to be created in the `include` folder.
- the `kick_off_fivetran_sync` task uses the FivetranOperator to kick of the Fivetran connector specified as `FIVETRAN_CONNECTOR_ID` as soon as the `wait_for_file` task has completed successfully.

4. Add the `FIVETRAN_CONNECTOR_ID` of your connector. You can find the ID of your connector in the Fivetran UI under the **Setup** tab:

    ![Fivetran connector ID](/img/guides/fivetran_connector_id.png)

5. Save your DAG file with the new `FIVETRAN_CONNECTOR_ID`.

## Step 6: Run your DAG

1. In the Airflow UI, unpause your DAG to start its last scheduled DAG run with a logical date of yesterday.

2. Once the `wait_for_file` task is running check the task logs to see what `filepath` the task is waiting for. In the screenshot this is `include/2023-02-26*.csv`.

    ![File sensor waiting](/img/guides/fivetran_filesensor_highlight.png)

3. In your Airflow project add a file to the `include` directory called `<your-date>_customer_data.csv` using the date from the logs seen in the previous step. The file can be empty. Save the file. (Files in the `include` directory will automatically be synchronized to your running Astro CLI project.)

4. After a few seconds the sensor will detect the added file and print logs similar to the ones shown below.

    ```text
    [2023-02-27, 14:13:57 UTC] {filesystem.py:64} INFO - Poking for file include/2023-02-26*.csv
    [2023-02-27, 14:13:57 UTC] {filesystem.py:69} INFO - Found File include/2023-02-26_customer_data.csv last modified: 20230227141347
    [2023-02-27, 14:13:57 UTC] {base.py:228} INFO - Success criteria met. Exiting.
    ```

5. After the `wait_for_file` task has completed, the `kick_off_fivetran_sync` task will run. Wait for it to finish successfully.

    ![Fivetran DAG successful](/img/guides/fivetran_dag_successful.png)

6. Verify in your Fivetran UI that the sync job shows an additional `Manual Update Triggered` entry in its  `User Actions`.

    ![Fivetran additional sync](/img/guides/fivetran_additional_sync.png)

## (Optional) Step 7: Use deferrable operators

Both operators used in the example DAG have asynchronous versions, called [deferrable operators](deferrable-operators.md). The [FileSensorAsync](https://registry.astronomer.io/providers/astronomer-providers/modules/filesensorasync) can be imported from the [Astronomer provider](https://registry.astronomer.io/providers/astronomer-providers), the [FivetranOperatorAsync](https://registry.astronomer.io/providers/fivetran/modules/fivetranoperatorasync) from the new [Fivetran provider](https://registry.astronomer.io/providers/fivetran), both providers were already added to your `requirements.txt` in Step 1 of this tutorial. A deferrable operator creates a task that is handed over (deferred) to the Airflow Triggerer component, freeing up a worker slot. Switching out regular operators for deferrable ones is quite simple, you just need to change the import statement and the operator name.

1. Copy and past the code below into your DAG file. Note the changes in the operator import statements and operator names.


2. Manually run your DAG by clicking the play button in the Airflow UI.

3. Notice how the `wait_for_file` task goes into a deferred state (violet square) instead of running continuously and taking up a worker slot (light green square). Take note of the `filepath` the sensor is looking for, it will use today's date, in the screenshot this is `2023-02-27`.

    ![Fivetran FileSensor deferred](/img/guides/fivetran_filesensor_deferred.png)

4. In your Airflow project add a file to the `include` directory called `<your-date>_customer_data.csv` using the date from the logs seen in the previous step. The file can be empty. Save the file.

5. See how the `wait_for_file` task completes successfully and the `kick_off_fivetran_sync` task will go into a deferred state as well. This task will only complete once the Fivetran sync job has completed, allowing you to schedule downstream actions in your data pipeline on the completing of Fivetran sync jobs!

    ![Fivetran FivetranOperatorAsync deferred](/img/guides/fivetran_deferred.png)

## (Optional) Step 8: Visualize your commits with Tableau

So far this tutorial has shown you how to integrate Fivetran and Airflow but we haven't had a look at the data we've been running through the pipeline. If you are using a custom Fivetran Destination you can simply view your data directly and connect your favorite BI tool to it. If you followed this tutorial using Fivetrans managed BigQuery service, you can add a BI tool in order to view your data!

1. In the Fivetran UI navigate to **Destinations**, click on your warehouse and then select the **BI tools** tab and click on **+ BI tool**.

2. You can use [any compatible BI tool](https://fivetran.com/docs/destinations/bigquery/managed-bigquery#addbitools) listed that you are familiar with. This tutorial will use Tableau. Follow the [steps in Fivetrans documentation to authenticate Tableau](https://fivetran.com/docs/destinations/bigquery/managed-bigquery/tableau-setup-guide#spanclassstepitemauthorizegoogleuserintableauspan) to the Fivetran-managed BigQuery service. Note that you have to authorize the same Google user to Tableau as you authorized to the Fivetran-managed BigQuery service.

    ![Fivetran Tableau connection](/img/guides/fivetran_tableau_connection.png)

3. [Create a new Tableau worksheet](https://help.tableau.com/current/pro/desktop/en-us/environment_workspace.htm), either in Tableau desktop or in Tableau Cloud. This tutorial shows screenshots using Tableau Cloud.

4. Connect your Tableau worksheet to the BigQuery project created by the Fivetran-managed service. Make sure you are using the same Google user you authorized in Fivetran. See the [Tableau documentation](https://help.tableau.com/current/pro/desktop/en-us/examples_googlebigquery.htm) for help.

    ![Tableau BQ connection](/img/guides/tableau_bq_connection.png)

5. You can now visualize all elements of the GitHub repository metadata that has been loaded into BigQuery. For example, using the `commit` table, drag and drop the `commit(Count)` item from the Tables section to the `Rows` list and the `Committer Date` to the `Columns` list. Change the grain of `Committer Date` displayed to `Minute` by Clicking on the right side of the element in the `Columns` list. This will create a line graph showing how many commits were made every minute in the `airflow-fivetran-tutorial` repository. The screenshot below shows that two commits were made in separate minutes:

    ![Tableau commits 1](/img/guides/tableau_commits_one.png)

6. Add a few commits to your `airflow-fivetran-tutorial` repository.

7. Rerun the Fivetran sync job by rerunning the Airflow DAG.

8. View your updated dashboard with commits per minute of the hour aggregated.

    ![Tableau commits 1](/img/guides/tableau_commits_two.png)

## Conclusion

Using Airflow with Fivetran allows you to embed your Fivetran jobs in your larger data ecosystem, making the scheduling of Fivetran jobs event- and data-driven. The new [`airflow-provider-fivetran-async`](https://registry.astronomer.io/providers/fivetran) offers new async capabilities to make your architecture more efficient.