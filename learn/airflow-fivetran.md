---
title: "Use Fivetran with Apache Airflow"
sidebar_label: "Fivetran"
description: "How to orchestrate Fivetran syncs from within Airflow"
id: airflow-fivetran
---

import CodeBlock from '@theme/CodeBlock';
import fivetran_tutorial_dag_1 from '!!raw-loader!../code-samples/dags/airflow-fivetran/fivetran_tutorial_dag_1.py';

[Fivetran](https://www.fivetran.com/) is a popular ELT platform built to automate ingestion of data from a variety of sources into a database, offering pre-built integration elements called Connectors, Transformations and Destinations for many common data tools.
Fivetran is optimized to simplify data ingestion from many sources by easily configuring relevant connectors. Using Airflow with Fivetran allows you to schedule your Fivetran syncs based on events in your larger data ecosystem, as well as kick-off downstream actions the moment a sync has finished.

In this tutorial, you'll learn how to install and use the Airflow Fivetran provider to submit and monitor Fivetran syncs.

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
    apache-airflow-providers-github
    ```

3. Run the following command to start your project in a local environment:

    ```sh
    astro dev start
    ```

## Step 2: Create a new private GitHub repository

For this tutorial you will use metadata from a GitHub repository as a data source for Fivetran. We recommend using a new repository in order to prevent unintentionally ingesting large amounts of data.

1. [Create a new private GitHub repository](https://docs.github.com/en/get-started/quickstart/create-a-repo) called `airflow-fivetran-tutorial`.
2. Commit at least one change to the repository. The content of your commit does not matter for this tutorial.

## Step 3: Connect Fivetran to a destination

Fivetran needs at least one destination to be configured in order to create syncs. A destination is a relational database where your ingested data will be loaded into.

1. Log into your [Fivetran account](https://www.fivetran.com/). 

2. Click on **Destinations** in the sidebar on the left side of the screen and then on **ADD DESTINATION** in the upper right corner.

3. Choose either **Connect your destination** or **I don't have one**. For this tutorial you can either connect to an existing data warehouse by following the [relevant Fivetran documentation](https://fivetran.com/docs/databases), or use a [Fivetran-managed BigQuery service](https://fivetran.com/docs/destinations/bigquery/managed-bigquery). In this tutorial we will use Fivetran's managed BigQuery service by selecting **I don't have one** and then clicking on **CONTINUE SETUP**.

    ![Fivetran Destination](/img/guides/fivetran_destination.png)

4. Configure your destination connection. You can choose any configuration. Astronomer recommends using UTC as your timezone in all data tools as a best practice. Click **SAVE & TEST** to save your destination.

    ![Fivetran-managed BigQuery](/img/guides/fivetran_managed_bigquery.png)

5. Click **Continue** to get back to the list of your destinations.

    ![Fivetran-managed BigQuery connection successful](/img/guides/fivetran_managed_bigquery_conn_success.png)

## Step 4: Configure a Fivetran connector

Fivetran needs at least one connector to be configured in order to create syncs. A Fivetran connector reaches out to a specific data source, receives data from it and writes it to your destination. View the Fivetran website for an [up-to-date list of connectors](https://www.fivetran.com/connectors).

1. Click on **Connectors** in the sidebar on the left side of the screen and then on **ADD CONNECTOR** in the upper right corner.

2. Select the GitHub Connector and click on **CONTINUE SETUP**.

3. Configure the GitHub Connector. Name the schema `in_github`. To connect Fivetran to GitHub you can use either [OAuth or a Personal Access Token](https://fivetran.com/docs/applications/github/setup-guide). Choose your method of authentication and click **AUTHORIZE**. In this tutorial we use OAuth authentication. 

    ![GH Connector](/img/guides/github_connector.png)

4. Authenticate Fivetran to your Github Account.

    ![Authorize Fivetran to GH](/img/guides/authorize_fivetran_github.png)

5. Select the `your-github-username/airflow-fivetran-tutorial` repository to be synced. You don't need to enable Webhooks for this tutorial.

    ![Select tutorial repository](/img/guides/fivetran_select_tutorial_repo.png)

6. Click **SAVE & TEST**. After your connection has been tested click **CONTINUE**.

7. Click on **Start Sync** to start your initial sync. This initial synchronization will load all historic metadata from your GitHub repository and has to be completed in Fivetran for the sync to become active. Once the Fivetran sync is active, you can set the sync frequency under the **Setup** tab or kick-off the sync via the Fivetran API with Airflow.

    ![Initial sync completed](/img/guides/complete_initial_sync.png)

## Step 5: Generate a Fivetran API key

You have now created a Fivetran sync that will extract new metadata from a GitHub repository and load it into a relational database on a time-based schedule. But to run the sync every time a specific event happens in your data ecosystem, you will need to use Airflow for orchestration. 

In order to connect Airflow to Fivetran, you will need a Fivetran API key. 

1. Click on your account name in Fivetran's sidebar and then on **API Key**. 

    ![Fivetran generate API key](/img/guides/fivetran_generate_api_key.png)

2. Click **Generate API Key** and make sure to store the information displayed in a secure place.

## Step 6: Create an Airflow connection to Fivetran

1. Navigate to your Airflow UI at `localhost:8080`.

2. Click on **Admin** -> **Connections** -> **+** to create a new connection.

3. Name your connection `fivetran_conn` and select the **Fivetran** connection type. Provide your Fivetran API Key and Fivetran API Secret. If the connection type does not show up, try restarting your Airflow instance with `astro dev restart` to ensure the contents of `requirements.txt` have been installed.

    ![Fivetran connection](/img/guides/fivetran_airflow_connection.png)

4. Click **Test** to test your connection. Once you see `Connection tested successfully` click **Save**.

## Step 7: Create an Airflow connection to GitHub

The DAG you are about to build will wait for a specific tag to be added to a GitHub repository, which requires a connection to GitHub.

1. Click on **Admin** -> **Connections** -> **+** to create a new connection.

2. Name your connection `github_conn` and select the **GitHub** connection type. Provide a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) (PAT) for your GitHub account. The PAT needs to have read access to the metadata (includes tags) of the `airflow-fivetran-tutorial` repository.

    ![GitHub connection](/img/guides/github_connection.png)

4. Click **Test** to test your connection. Once you see `Connection tested successfully` click **Save**.

## Step 8: Create your Airflow DAG

For this tutorial you will create a DAG that waits for a GitHub tag to be present in your GitHub repo, and then kicks off the Fivetran sync you configured to ingest the GitHub repo metadata to your destination.

1. Open your `astro-fivetran-project` in a code-editor.

2. In your `dags` folder add a new Python file called `my_fivetran_dag.py`. 

3. Copy and past the following DAG code into the file:

    <CodeBlock language="python">{fivetran_tutorial_dag_1}</CodeBlock>

This DAG contains four tasks: 

- The `generate_tag_to_await` task pulls a number from the [Airflow Variable](https://airflow.apache.org/docs/apache-airflow/stable/howto/variable.html) `sync-metadata`, or creates the Airflow Variable and assigns a value of `1` if it does not exist yet. The task returns the tag to wait for in the format `sync-metadata/{number}`. This task helps set up the GitHubTagSensor and ensures that DAG can be run repeatedly.
- The `wait_for_tag` task uses the [GitHubTagSensor](https://registry.astronomer.io/providers/github/modules/githubtagsensor) to wait for a specific tag to be present in your GitHub repository. This DAG is set up to wait for `sync-metadata/{number}` to appear in the repository that has been connected to the Fivetran sync. If you want to wait for a tag to appear in a different repository change `repository_name` parameter in your GitHubTagSensor to another repo the PAT you provided to the GitHub connection in [Step 7](#step-7-create-an-airflow-connection-to-github) has access to.
- The `kick_off_fivetran_sync` task uses the FivetranOperatorAsync to kick of the Fivetran connector specified as `FIVETRAN_CONNECTOR_ID` as soon as the `wait_for_tag` task has completed successfully.
- The `increase_tag_var` task increases the value assigned to the `sync-metadata` Airflow Variable by 1. This task ensures that next time you run the DAG, the sensor will wait for a new tag value to be added to your GitHub repo.

4. Update the `FIVETRAN_CONNECTOR_ID` variable with the ID of your connector. You can find the ID of your connector in the Fivetran UI under the **Setup** tab:

    ![Fivetran connector ID](/img/guides/fivetran_connector_id.png)

5. Add your GitHub username to the `GITHUB_REPOSITORY` variable.

6. Save your DAG file with the changed variable names.

:::info

The FivetranOperatorAsync is one of many [deferrable operators](deferrable-operators.md). Instead of taking up a worker slot, these operators will hand their task to the Airflow Triggerer component while waiting for a condition to be fulfilled. For longer running tasks, this can result in cost savings and greater scalability as more worker slots area available.

:::

## Step 9: Run your DAG

1. In the Airflow UI, unpause your DAG to start its last scheduled DAG run with a logical date of yesterday.

2. Once the `wait_for_tag` task is running check the task logs to see what `tag` in which repository the task is waiting for. It should be `sync-metadata/1` in `<your GH name>/airflow-fivetran-tutorial`.

    ![GH tag sensor waiting](/img/guides/fivetran_githubtagsensor.png)

3. Add a tag with the name of `sync-metadata/1` to `<your GH name>/airflow-fivetran-tutorial`. You can either [use the GitHub UI to add tags](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/managing-commits/managing-tags) or run the following bash commands in your local repository clone:

    ```sh
    git tag sync-metadata/1
    git push --tags
    ```

4. After a few seconds the sensor will detect the added file and print logs similar to the ones shown below.

    ```text
    [2023-03-01, 00:31:35 UTC] {custom_githubtagsensor.py:127} INFO - Poking for tag: sync-metadata/1 in repository: TJaniF/airflow-fivetran-tutorial
    [2023-03-01, 00:31:35 UTC] {base.py:73} INFO - Using connection ID 'github_conn' for task execution.
    [2023-03-01, 00:31:36 UTC] {custom_githubtagsensor.py:146} INFO - Tag sync-metadata/1 exists in TJaniF/airflow-fivetran-tutorial repository, Success.
    [2023-03-01, 00:31:36 UTC] {base.py:228} INFO - Success criteria met. Exiting.
    [2023-03-01, 00:31:36 UTC] {taskinstance.py:1318} INFO - Marking task as SUCCESS. 
    ```

5. After the `wait_for_tag` task has completed, the `kick_off_fivetran_sync` task will start. This task will be in a deferred state (violet square) until the Fivetran sync is completed. 

    ![Fivetran Deferred](/img/guides/fivetran_deferred_operator.png)

6. After the DAG run has finished successfully, verify in your Fivetran UI that the sync shows an additional `Manual Update Triggered` entry in its `User Actions`.

    ![Fivetran additional sync](/img/guides/fivetran_additional_sync.png)

:::info

When running the DAG again after it has run successfully the `number` Variable will have increased by one, meaning in its second run, the `wait_for_tag` task will wait for a tag with the name `sync-metadata/2` and so forth. To reset the Airflow Variable manually go to the Airflow UI and navigate to **Admin** -> **Variables**.

:::

## (Optional) Step 10: Visualize your commits with Tableau

So far this tutorial has shown you how to integrate Fivetran and Airflow but we haven't had a look at the data we've been running through the pipeline. If you are using a custom Fivetran Destination you can simply view your data directly and connect your favorite BI tool to it. If you followed this tutorial using Fivetran's managed BigQuery service, you can add a BI tool in order to view your data!

:::info

If you choose to connect to an existing data warehouse not managed by Fivetran, you can directly connect a BI tool to it to complete this step. We will use [Tableau](https://www.tableau.com/) to visualize our data but you are free to use any BI tool compatible with your data warehouse.

:::

1. In the Fivetran UI navigate to **Destinations**, click on your warehouse and then select the **BI tools** tab and click on **+ BI tool**.

2. You can use [any compatible BI tool](https://fivetran.com/docs/destinations/bigquery/managed-bigquery#addbitools) listed that you are familiar with. This tutorial will use Tableau. Follow the [steps in Fivetrans documentation to authenticate Tableau](https://fivetran.com/docs/destinations/bigquery/managed-bigquery/tableau-setup-guide#spanclassstepitemauthorizegoogleuserintableauspan) to the Fivetran-managed BigQuery service. Note that you have to authorize the same Google user to Tableau as you authorized to the Fivetran-managed BigQuery service.

    ![Fivetran Tableau connection](/img/guides/fivetran_tableau_connection.png)

3. [Create a new Tableau worksheet](https://help.tableau.com/current/pro/desktop/en-us/environment_workspace.htm), either in Tableau desktop or in Tableau Cloud. This tutorial shows screenshots using Tableau Cloud.

4. Connect your Tableau worksheet to the BigQuery project created by the Fivetran-managed service. Make sure you are using the same Google user you authorized in Fivetran. See the [Tableau documentation](https://help.tableau.com/current/pro/desktop/en-us/examples_googlebigquery.htm) for help.

    ![Tableau BQ connection](/img/guides/tableau_bq_connection.png)

5. You can now visualize all elements of the GitHub repository metadata that has been loaded into BigQuery. For example, using the `commit` table, drag and drop the `commit(Count)` item from the Tables section to the `Rows` list and the `Committer Date` to the `Columns` list. Change the grain of `Committer Date` displayed to `Minute` by Clicking on the right side of the element in the `Columns` list. This will create a line graph showing how many commits were made every minute in the `airflow-fivetran-tutorial` repository. The screenshot below shows that two commits were made in separate minutes:

    ![Tableau commits 1](/img/guides/tableau_commits_one.png)

6. Add a few commits to your `airflow-fivetran-tutorial` repository.

7. Rerun the Fivetran sync by rerunning the Airflow DAG and adding the GitHub tag the `wait_for_tag` task is listening to to your `airflow-fivetran-tutorial` repository.

8. View your updated dashboard with commits per minute of the hour aggregated.

    ![Tableau commits 1](/img/guides/tableau_commits_two.png)

## Conclusion

Using Airflow with Fivetran allows you to embed your Fivetran syncs in your larger data ecosystem, making the scheduling of Fivetran syncs event- and data-driven. The [`airflow-provider-fivetran-async`](https://registry.astronomer.io/providers/fivetran) offers asynchronous capabilities to make your architecture more scalable and efficient.