---
title: "Get started with Apache Airflow - Part 2"
sidebar_label: "Get started with Airflow - Part 2"
description: "Learn core Apache Airflow concepts like providers and connections."
id: get-started-with-airflow-part-2
---

Learn core Apache Airflow concepts in this hands-on tutorial using the Astro CLI.

This tutorial is for people who have completed the [Get started with Apache Airflow](https://docs.astronomer.io/astro/cli/get-started) tutorial and want to learn how to use additional features.

After you complete this tutorial, you'll be able to:

- Add a provider to your Airflow environment.
- Create and use an Airflow connection.
- Create and use an Airflow variable.
- Use the SimpleHTTPOperator to query an API.
- Use the SnowflakeOperator to create and query a table in Snowflake.

## Time to complete

This tutorial takes approximately 1 hour to complete.

## Assumed knowledge

To complete this tutorial, you'll need to know:

- Contents of [Get started with Apache Airflow.](https://docs.astronomer.io/astro/cli/get-started)
- Basic knowledge of git. See the [tutorial on Git’s official webpage](https://git-scm.com/docs/gittutorial).

## Prerequisites

- An Astro project created with the [Astro CLI](https://docs.astronomer.io/astro/cli/configure-cli).
- A GitHub account with a personal access token.

> **Note:** If you do not have a GitHub account you can create one for free following the steps on the [GitHub website](https://github.com/signup) . You can learn how to create a personal access token in the [official GitHub documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
> 

## Step 1: Start your Astro project

Navigate to the folder of your Astro project from the Get started with Apache Airflow tutorial. 

1. Run the following Astro CLI command to start Airflow:

```bash
astro dev start
```

Once your local environment is ready, the CLI automatically opens a new tab or window in your default web browser to the Airflow UI at `https://localhost:8080`.

1. Log into the Airflow UI with `admin` for both your username and password.

## Step 2: Create your DAG file

1. Create a new Python file in the `/dags` folder of your Astro project called `my_second_dag.py`. 
2. Copy the  Getting started with Apache Airflow Part 2 example DAG from the Astronomer Registry.
3. Paste the code into `my_second_dag.py`. 

## Step 3: Add a provider package

1. Go back to the Airflow UI. Most likely you will see a DAG Import Error like the one shown below. 

![Screenshot 2022-09-07 at 15.20.44.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2e52e5da-8ac9-4555-9ef1-98f8ebbf7f68/Screenshot_2022-09-07_at_15.20.44.png)

This happens because the DAG uses two Airflow providers the [HTTP provider](https://registry.astronomer.io/providers/http) and the [GitHub provider](https://registry.astronomer.io/providers/github). While the HTTP provider is pre-installed in the Astro Runtime image, the GitHub provider is not, which causes the DAG Import Error.

2. Go to the [Astronomer Registry](https://registry.astronomer.io/) and enter “GitHub” in the search. Click on the card in the drop down menu to open the page of the GitHub provider.

![Screenshot 2022-09-07 at 15.34.56.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/990748d1-de3d-4caf-8a75-d826b556bb80/Screenshot_2022-09-07_at_15.34.56.png)

3. Copy the provider name and version (`apache-airflow-providers-github=2.1.0`) from the **Quick Install** statement. 
2. Paste the provider name and version into the `requirements.txt` file of your Astro project.

![Screenshot 2022-09-07 at 15.38.44.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/75d5aea9-4e08-4035-a1e6-44ce123d22c4/Screenshot_2022-09-07_at_15.38.44.png)

1. Restart your Airflow instance using the command `astro dev restart`. 

## Step 4: Add an Airflow variable

After restarting you will get a new DAG Import Error alerting you to a missing Airflow variable. Airflow variables are key value pairs you can set from within the Airflow UI that can be accessed in all DAGs of your Airflow instance. 

1. Go to **Admin** → **Variables** to open the list of Airflow variables. It will be empty.

![Screenshot 2022-09-07 at 17.02.15.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/03052af9-1030-4021-bc8e-c5d5ef0bcb6c/Screenshot_2022-09-07_at_17.02.15.png)

1. Click on the `+` sign to open the form for adding a new variable. Use the **Key** `my_github_repo` and a GitHub repository you have administrator access to as a value. The repository can be private.

![Screenshot 2022-09-07 at 17.04.29.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e9a4def6-a3b3-4eb9-b471-390bd1a4067b/Screenshot_2022-09-07_at_17.04.29.png)

1. Save the variable.

Now the DAG is listed in your **DAGs** view without any Import Error.

> **Note**: If you don’t have a GitHub repository you can follow the [steps in the GitHub documentation](https://docs.github.com/en/get-started/quickstart/create-a-repo) on how to create one.
> 

## Step 5: Add a GitHub connection

1. Open the Connections List by clicking on **Admin** → **Connections**.

![Screenshot 2022-09-07 at 17.09.07.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e535c7be-7fda-457e-87d5-4a8d851ccd0d/Screenshot_2022-09-07_at_17.09.07.png)

1. Click on the `+` sign to open the form for adding new Airflow connections.
2. Name the connection `my_github_connection` and select the **Connection Type** `GitHub`.
3. Enter your **GitHub Access Token**. 
4. Test your connection by pressing the `Test` button. You should see a green banner indicating that your connection was successfully tested.
    
    ![Screenshot 2022-09-07 at 16.40.32.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/34e5ecfa-328a-4673-ba23-382c92a67ecd/Screenshot_2022-09-07_at_16.40.32.png)
    
5. Save the connection by clicking the `Save` button.

## Step 6: Add a HTTP connection

1. Click on the `+` sign to open another form to add the HTTP connection.
2. Name the connection `my_http_connection` and select the **Connection Type** `HTTP`.
3. Enter the name of the API you want to query in the **Host** field. We suggest the Catfact API `http://catfact.ninja/fact`, which will return a random fact about cats for every `GET` request and does not need any further authorization.
4. Test your connection by pressing the `Test` button.

![Screenshot 2022-09-07 at 13.36.13.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f74f9ff6-c489-4775-b2e5-aec939ccdf95/Screenshot_2022-09-07_at_13.36.13.png)

1. Save the connection by clicking the `Save` button.

You should now have two connections in your list as shown in the screenshot below.

![Screenshot 2022-09-07 at 16.54.13.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/807d7b0d-6f77-4650-bd7e-4bd789d5456d/Screenshot_2022-09-07_at_16.54.13.png)

## Step 7: View your DAG code

In this step we will go through the DAG code you copied from the repository and explain each section in detail.

On top of the file all necessary packages are imported. Notice how both the `SimpleHttpOperator` as well as the `GithubTagSensor` are part of two different provider packages.

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

> **Note:** the `schedule_interval` uses a CRON expression. A good resource to learn about CRON is the [Crontab website](https://crontab.guru/).
> 

The DAG itself has two tasks, the first one uses the `GithubTagSensor` to wait for a tag with the name `v1.0` to be added to the GitHub repository you specified in the Airflow variable `my_github_repo`. The sensor will check every `30` seconds and time out after a day.

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

![Screenshot 2022-09-07 at 17.23.14.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/70d44dbc-8c5d-46b7-bcb5-5456d3d621a4/Screenshot_2022-09-07_at_17.23.14.png)

## Step 8: Test your DAG

1. Go to the Airflow UI and unpause the DAG by clicking on the toggle to the left of the DAG name. The last scheduled DAG run will automatically start and the `tag_sensor` will start to wait for the `v1.0` tag to be added to your GitHub repository. This process is visible from the **DAGs** view as light green circles, on for the active DAG run, one for the active task run.

![Screenshot 2022-09-07 at 18.22.11.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/735f9639-fa90-4a3e-9661-7ea06d41615d/Screenshot_2022-09-07_at_18.22.11.png)

1. Add the tag `v1.0` to your GitHub repository using the command `git tag v1.0 && git push --tags` from within your local clone of the repository. 
2. See the `tag_sensor` task finishing sucessfully and kicking off the `query_api` task. 
3. Check the logs of the `query_api` task for a brand new cat fact!

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