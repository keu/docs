---
title: "Get started with Apache Airflow - Part 2"
sidebar_label: "Get started with Airflow - Part 2"
description: "Learn core Apache Airflow concepts: using providers and connections."
id: get-started-with-airflow-part-2
---

Learn core Apache Airflow concepts in this hands-on tutorial using the Astro CLI.

This tutorial is for people who have completed the [Get started with Apache Airflow](https://docs.astronomer.io/astro/cli/get-started) tutorial and want to learn how to use additional features.

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

- Contents of [Get started with Apache Airflow](https://docs.astronomer.io/astro/cli/get-started).
- Basic knowledge of git. See the [tutorial on Git’s official webpage](https://git-scm.com/docs/gittutorial).

## Prerequisites

- An Astro project created with the [Astro CLI](https://docs.astronomer.io/astro/cli/configure-cli).
- A GitHub account with a personal access token.

:::note

If you do not have a GitHub account you can create one for free following the steps on the [GitHub website](https://github.com/signup) . You can learn how to create a personal access token in the [official GitHub documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

:::

## Step 1: Start your Astro project

Navigate to the folder of your Astro project from the Get started with Apache Airflow tutorial. 

1. Run the following Astro CLI command to start Airflow:

```bash
astro dev start
```

Once your local environment is ready, the CLI automatically opens a new tab or window in your default web browser to the Airflow UI at `https://localhost:8080`.

2. Log into the Airflow UI with `admin` for both your username and password.

## Step 2: Create your DAG file

1. Create a new Python file in the `/dags` folder of your Astro project called `my_second_dag.py`.
2. Copy the Getting started with Apache Airflow Part 2 example DAG from the Astronomer Registry.
3. Paste the code into `my_second_dag.py`.

## Step 3: Add a provider package

1. Go back to the Airflow UI. You will see a DAG Import Error like the one shown below.

![Import Error](/img/tutorials/T2_ImportError.png)

This happens because the DAG uses operators from two Airflow providers: the [HTTP provider](https://registry.astronomer.io/providers/http) and the [GitHub provider](https://registry.astronomer.io/providers/github). While the HTTP provider is pre-installed in the Astro Runtime image, the GitHub provider is not, which causes the DAG Import Error.
Provider packages are Python packages maintained separately from core Airflow that contain the hooks and operators to interact with external services. You can browse all available providers in the Astronomer Registry. 

2. Go to the [Astronomer Registry](https://registry.astronomer.io/) and enter “GitHub” in the search. Click on the card in the drop down menu to open the page of the GitHub provider.

![GitHub Provider](/img/tutorials/T2_GitHubProvider.png)

3. Copy the provider name and version from the **Quick Install** statement. 
4. Paste the provider name and version into the `requirements.txt` file of your Astro project. Make sure to only add `apache-airflow-providers-github=2.1.0` without `pip install`. 
5. Restart your Airflow instance using the command `astro dev restart`. 

## Step 4: Add an Airflow variable

After restarting your Airflow instance, you will see a new DAG Import Error alerting you to a missing Airflow variable. Airflow variables are key value pairs that can be accessed in all DAGs of your Airflow instance. You can define Airflow variables in the Airflow UI.

1. Go to **Admin** → **Variables** to open the list of Airflow variables. It will be empty.

![Admin Variables](/img/tutorials/T2_AdminVariables.png)

2. Click on the `+` sign to open the form for adding a new variable. Use `my_github_repo` as the **Key** and a GitHub repository you have administrator access to as the **Val**. The repository can be private.

![Add new variable](/img/tutorials/T2_AddNewVariable.png)

3. Save the variable.

4. Refresh the DAGs View. You should now see your DAG without any import errors.

:::note

If you don’t have a GitHub repository you can follow the [steps in the GitHub documentation](https://docs.github.com/en/get-started/quickstart/create-a-repo) on how to create one.

:::

## Step 5: Add a GitHub connection

Connections in Airflow are sets of configurations used to connect with other tools in the data ecosystem. If you are using a hook or operator that connects to an external system, they are most likely doing so using a connection. In our example DAG we use two operators that interact with two different external systems, which means we will need to define two connections.

1. Open the Connections List by clicking on **Admin** → **Connections**.

![Admin Connections](/img/tutorials/T2_AdminConnections.png)

2. Click on the `+` sign to open the form for adding new Airflow connections.
3. Name the connection `my_github_connection` and select the **Connection Type** `GitHub`. Note that you can only select connection types that are either available form core Airflow or from a provider package you have installed. If you are missing the connection type `GitHub` double check that you installed the `GitHub` provider correctly (Step 3). 
4. Enter your **GitHub Access Token**. 
5. Test your connection by pressing the `Test` button. You should see a green banner indicating that your connection was successfully tested.
    
![GitHub Connection](/img/tutorials/T2_GitHubConnection.png)
    
6. Save the connection by clicking the `Save` button.

:::info

The option to test connections was added in Airflow 2.2. If you are running an older version you can skip step 5.

:::

## Step 6: Add a HTTP connection

1. While still on the Connections View, click on the `+` sign to open another form to add the HTTP connection.
2. Name the connection `my_http_connection` and select the **Connection Type** `HTTP`.
3. Enter the name of the API you want to query in the **Host** field. For this tutorial we use the Catfact API `http://catfact.ninja/fact`, which will return a random fact about cats for every `GET` request. This API does not need any further authorization.
4. Test your connection by pressing the `Test` button.

![HTTP Connection](/img/tutorials/T2_HTTPConnection.png)

5. Save the connection by clicking the `Save` button.

You should now have two connections in your list as shown in the screenshot below.

![Connection List](/img/tutorials/T2_TwoConnections.png)

## Step 7: View your DAG code

In this step we will go through the DAG code you copied from the repository and explain each section in detail.

At the top of the script, all necessary packages are imported. Notice how both the `SimpleHttpOperator` as well as the `GithubTagSensor` are part of two different provider packages.

```python
from airflow import DAG
from airflow.models import Variable
from airflow.providers.http.operators.http import SimpleHttpOperator
from airflow.providers.github.sensors.github import GithubTagSensor
from datetime import datetime
```

Next, the DAG context is instantiated using the `DAG` class. The DAG is given the id `my_second_dag` and is set to run every day at 9am starting from the first of September 2022. `catchup` is set to `False` in order to prevent the DAG runs from between the `start_date` and today from being scheduled automatically.

```python
with DAG(
    dag_id="my_second_dag",
    start_date=datetime(2022, 9, 1),
    schedule_interval="0 9 * * *",
    catchup=False
) as dag:
```

:::tip

The `schedule_interval` uses a CRON expression. A good resource to learn about CRON is the [Crontab website](https://crontab.guru/).

:::

The DAG itself has two tasks, the first one uses the `GithubTagSensor` to wait for a tag with the name `v1.0` to be added to the GitHub repository you specified in the Airflow variable `my_github_repo`. The sensor will check for the tag every `30` seconds and time out after one day. It is best practice to always set a `timeout` because the default value is 7 days, which means the sensor would be waiting for 7 days for the tag to be added to your GitHub repository until it fails.

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

The second task uses the `SimpleHttpOperator` to send a `GET` request to the cat fact API. The response is logged to the Airflow task logs (`log_response=True`).

```python
    query_API = SimpleHttpOperator(
        task_id="query_API",
        http_conn_id="my_http_connection",
        method="GET",
        log_response=True
    ) 
```

Lastly, the dependency between the two tasks is set so that the API is only queried after the `tag_sensor` task has been successful.

```python
    tag_sensor >> query_API
```

The DAG produces the following **Graph** view:

![Graph View](/img/tutorials/T2_GraphView.png)

## Step 8: Test your DAG

1. Go to the Airflow UI and unpause the DAG by clicking on the toggle to the left of the DAG name. The last scheduled DAG run will automatically start and the `tag_sensor` will start to wait for the `v1.0` tag to be added to your GitHub repository. You will see two light green circles in the **DAGs** View indicating that the DAG run is in progress and the `example_tag_sensor` task is running..

![DAG running](/img/tutorials/T2_GraphView.png)

2. Add the tag `v1.0` to your GitHub repository by running the command `git tag v1.0 && git push --tags` from within your local clone of the repository in your terminal. 
3. Watch for the `example_tag_sensor` task to finish successfully. The `query_api` task should now start. 
4. Check the logs of the `query_api` task for a brand new cat fact!

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