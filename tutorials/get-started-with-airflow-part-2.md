---
title: "Get started with Apache Airflow - Part 2"
sidebar_label: "Get started with Airflow - Part 2"
description: "Learn the core Apache Airflow concepts of using providers and connections."
id: get-started-with-airflow-part-2
---

Learn core Apache Airflow concepts in this hands-on tutorial using the Astro CLI.

Use this tutorial after completing the [Get started with Apache Airflow](https://docs.astronomer.io/astro/cli/get-started) tutorial to learn about how to connect Airflow to external systems.

After you complete this tutorial, you'll be able to:

- Add a provider to your Airflow environment.
- Create and use an Airflow connection.
- Create and use an Airflow variable.
- Use the `GithubTagSensor` to wait for a tag to be added to a GitHub repository.
- Use the `SimpleHTTPOperator` to query an API.

## Time to complete

This tutorial takes approximately 1 hour to complete.

## Assumed knowledge

To complete this tutorial, you'll need to know:

- How to write DAGs and run Airflow. See [Get started with Apache Airflow](https://docs.astronomer.io/astro/cli/get-started).
- Basic knowledge of git. See the [tutorial on Git’s official webpage](https://git-scm.com/docs/gittutorial).

## Prerequisites

- An Astro project created with the [Astro CLI](https://docs.astronomer.io/astro/cli/configure-cli).
- A GitHub account with a personal access token and at least one repository. If you don’t have a GitHub repository you can follow the [steps in the GitHub documentation](https://docs.github.com/en/get-started/quickstart/create-a-repo) on how to create one.

:::info

If you do not have a GitHub account you can create one for free following the steps on the [GitHub website](https://github.com/signup) . You can learn how to create a personal access token in the [official GitHub documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

:::

## Step 1: Start your Astro project

To run data pipelines on Astro, you first need to create an Astro project, which contains the set of files necessary to run Airflow locally. For more information on the Astro project, see Part 1 of the [Get started with Apache Airflow tutorial]().

1. Create a new directory for your Astro project:

    ```sh
    mkdir <your-astro-project-name>
    ```

2. Open the directory:

    ```sh
    cd <your-astro-project-name>
    ```

3. Run the following Astro CLI command to initialize an Astro project in the directory:

    ```sh
    astro dev init
    ```

4. Run the following Astro CLI command to start Airflow:

    ```bash
    astro dev start
    ```

    Once your local environment is ready, the CLI automatically opens a new tab or window in your default web browser to the Airflow UI at `https://localhost:8080`.

5. Log in to the Airflow UI with `admin` for both your username and password.

## Step 2: Create your DAG

1. Create a new Python file in the `/dags` directory of your Astro project called `my_second_dag.py`.
2. Copy the Getting started with Apache Airflow Part 2 example DAG from the Astronomer Registry.
3. Paste the code into `my_second_dag.py`.

## Step 3: Add a provider package

1 Open the Airflow UI to confirm that your DAG was pushed to your environment. On the **DAGs** page, you should see a "DAG Import Error" like the one shown here:

![Import Error](/img/tutorials/T2_ImportError.png)

        Provider packages are Python packages maintained separately from core Airflow that contain hooks and operators for interacting with external services. You can browse all available providers in the Astronomer Registry. 

  Your DAG uses operators from two Airflow provider packages: the [HTTP provider](https://registry.astronomer.io/providers/http) and the [GitHub provider](https://registry.astronomer.io/providers/github). While the HTTP provider is pre-installed in the Astro Runtime image, the GitHub provider is not, which causes the DAG import error.

2. Open the GitHub provider page in the [Astronomer Registry](https://registry.astronomer.io/providers/github).

    ![GitHub Provider](/img/tutorials/T2_GitHubProvider.png)

3. Copy the provider name and version from **Quick Install**. 
4. Paste the provider name and version into the `requirements.txt` file of your Astro project. Make sure to only add `apache-airflow-providers-github=<version>` without `pip install`. 
5. Restart your Airflow environment by running `astro dev restart`. Unlike DAG code changes, package dependency changes require a complete restart of Airflow.

## Step 4: Add an Airflow variable

After restarting your Airflow instance, you should not see the same DAG import error from Step 2. However, you should see a new DAG import error about a missing Airflow variable. Airflow variables are key value pairs that can be accessed from any DAG in your Airflow environment. You'll now define the missing Airflow variable in the Airflow UI:

1. Go to **Admin** > **Variables** to open the list of Airflow variables. It will be empty.

    ![Admin Variables](/img/tutorials/T2_AdminVariables.png)

2. Click on the **+** sign to open the form for adding a new variable. Set the **Key** for the variable as `my_github_repo` and set the **Val** as a GitHub repository you have administrator access to. Make sure the **Val** is in the format `github_account_name/repository_name` (for example `apache/airflow`). The repository can be private.

    ![Add new variable](/img/tutorials/T2_AddNewVariable.png)

3. Click **Save**.

4. Go back to the **DAGs** view. You should now see your DAG without any import errors.

## Step 5: Create a GitHub connection

An Airflow connection is a set of configurations for connecting with an external tool in the data ecosystem. If you use a hook or operator that connects to an external system, it likely needs a connection. 

In your example DAG, you used two operators that interact with two external systems, which means you need to define two different connections.

1. In the Airflow UI, go to **Admin** > **Connections**.

    ![Admin Connections](/img/tutorials/T2_AdminConnections.png)

2. Click **+** to open the form for adding a new Airflow connection.
3. Name the connection `my_github_connection` and set its **Connection Type** to `GitHub`. Note that you can only select connection types that are available from either core Airflow or an installed provider package. If you are missing the connection type `GitHub`, double check that you installed the `GitHub` provider correctly in Step 3.
4. Enter your **GitHub Access Token** in the GitHub Access Token field. If you need to create a token, you can follow the [official GitHub documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
5. Test your connection by clicking **Test**. You should see a green banner indicating that your connection was successfully tested.
    
    ![GitHub Connection](/img/tutorials/T2_GitHubConnection.png)

    Note that the option to test connections was added in Airflow 2.2. If you are running an older version of Airflow, you can skip this step.
    
6. Save the connection by clicking the `Save` button.

## Step 6: Create an HTTP connection

1. In the **Connections** view, click **+** to create a new connection.
2. Name the connection `my_http_connection` and select a **Connection Type** of `HTTP`.
3. Enter the host URL for the API you want to query in the **Host** field. For this tutorial we use the Catfact API, which returns a random fact about cats for every `GET` request. The host for this API is `http://catfact.ninja/fact`.
4. Test your connection by pressing the **Test** button.

    ![HTTP Connection](/img/tutorials/T2_HTTPConnection.png)

5. Click **Save**.

You should now have two connections as shown in the following screenshot:

![Connection List](/img/tutorials/T2_TwoConnections.png)

## Step 7: View your DAG code

Now that your Airflow environment is configured correctly, look at DAG code you copied from the repository to see how your new configurations are used at the code level.

At the top of the file, all necessary packages are imported. Notice how both the `SimpleHttpOperator` as well as the `GithubTagSensor` are part of the provider packages you installed.

```python
from airflow import DAG
from airflow.models import Variable
from airflow.providers.http.operators.http import SimpleHttpOperator
from airflow.providers.github.sensors.github import GithubTagSensor
from datetime import datetime
```

Next, the DAG context is instantiated using the `DAG` class. The DAG has the ID `my_second_dag`, and it starts its runs on September 1st, 2022. After its start date, the DAG runs every day at 9:00 AM as defined in a [cron](https://crontab.guru/) statement. `catchup` is set to `False` in order to prevent the DAG runs from between the `start_date` and today from being scheduled automatically.

```python
with DAG(
    dag_id="my_second_dag",
    start_date=datetime(2022, 9, 1),
    schedule_interval="0 9 * * *",
    catchup=False
) as dag:
```


The DAG itself has two tasks. The first task uses the `GithubTagSensor` to check whether a tag named `v1.0` has been to your GitHub repository. It uses the Airflow variable (`my_github_repo`) and connection (`my_github_connection`) to access the correct repository with the appropriate credentials. The sensor checks for the tag every 30 seconds and will time out after one day. It is best practice to always set a `timeout` because the default value is 7 days, which is a long default value that can impact performance.

```python
    tag_sensor = GithubTagSensor(
        task_id='tag_sensor',
        github_conn_id="my_github_connection",
        tag_name='v1.0',
        repository_name=Variable.get("my_github_repo"),
        timeout=60*60*24,
        poke_interval=30
    )
```

The second task uses the `SimpleHttpOperator` to send a `GET` request to the cat fact API. The response is logged to the Airflow task logs using `log_response=True`.

```python
    query_API = SimpleHttpOperator(
        task_id="query_API",
        http_conn_id="my_http_connection",
        method="GET",
        log_response=True
    ) 
```

Lastly, the dependency between the two tasks is set so that the API is only queried after the `tag_sensor` task is successful.

```python
    tag_sensor >> query_API
```

The DAG produces the following **Graph** view:

![Graph View](/img/tutorials/T2_GraphView.png)

## Step 8: Test your DAG

1. Go to the Airflow UI and unpause the DAG by clicking on the toggle to the left of the DAG name. The last scheduled DAG run automatically starts, and the `tag_sensor` starts waiting for the `v1.0` tag to be added to your GitHub repository. You will see two light green circles in the **DAGs** view which indicate that the DAG run is in progress and the `example_tag_sensor` task is running.

![DAG running](/img/tutorials/T2_GraphView.png)

2. Add the tag `v1.0` to your GitHub repository by configuring it in the GitHub UI or running `git tag v1.0 && git push --tags` in your local repository clone.
3. Watch for the `example_tag_sensor` task to finish successfully. The `query_api` task should now start. 
4. In the **Grid** view, click on the green box representing the successful task run for `query_api`. Check the **Log** page of the task for a brand new cat fact!

```
[2022-09-07, 16:34:04 UTC] {base.py:68} INFO - Using connection ID 'my_http_connection' for task execution.
[2022-09-07, 16:34:04 UTC] {http.py:148} INFO - Sending 'GET' to url: http://catfact.ninja/fact
[2022-09-07, 16:34:05 UTC] {http.py:125} INFO - {"fact":"Cats sleep 16 to 18 hours per day. When cats are asleep, they are still alert to incoming stimuli. If you poke the tail of a sleeping cat, it will respond accordingly.","length":167}
```

## Conclusion

Congratulations on finishing this tutorial! You now know how to:

- Browse the Astronomer Registry for providers.
- Add a provider to your Airflow environment.
- Configure Airflow connections.
- Add Airflow variables.
- Use the `GithubTagSensor` and the `SimpleHTTPOperator`.
- Get a near infinite supply of cat facts.