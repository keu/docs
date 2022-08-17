---
sidebar_label: 'Get started'
title: 'Get started with Apache Airflow '
id: get-started
description: Install Apache Airflow and deploy your first local project with the Astro CLI.
---

Getting started with Apache Airflow locally is made easy thanks to the Astro CLI.

This tutorial guides you through the process of using the Astro CLI to create an Astro project, run your project in a local Airflow environment, and write DAGs. We will also cover how to use the Astronomer Registry to discover example DAGs and Airflow providers.

## Time to complete

This tutorial can be completed in 1 hour or less.

## Assumed knowledge

To get the most out of this tutorial, you should know:

- Basic Airflow concepts. See [Introduction to Apache Airflow](https://www.astronomer.io/guides/intro-to-airflow).
- Basic Python. See the [Python Documentation](https://docs.python.org/3/tutorial/index.html).

## Prerequisites

To use this tutorial, you need:

- A terminal that accepts bash commands. This is pre-installed on most operating systems.
- [Python 3](https://www.python.org/downloads/).
- [Docker Desktop](https://docs.docker.com/get-docker/) (v18.09 or higher).
- The [Astro CLI](cli/configure-cli.md).

Astronomer also recommends having an integrated development environment (IDE) for Python development, such as [VSCode](https://code.visualstudio.com/).

## Step 1: Create an Astro project

To run data pipelines on Astro, you first need to create an Astro project, which contains the set of files necessary to run Airflow locally.

1. Create a new, empty folder or directory on your computer called `my-astro-project`.
2. Run the initialization command from the terminal with the Astro CLI:

```sh
astro dev init
```

The Astro project is built to run Airflow with Docker. [Docker](https://docs.docker.com/) is a service to run software in virtualized containers within a machine. When you run Airflow on your computer with the Astro CLI, Docker creates a container for each Airflow component that is required to run DAGs. For this tutorial, no in-depth knowledge of Docker is needed. All you need to know is that Airflow will run in a containerized environment on your machine, and that all necessary files for running these containers are included in the default Astro project.

The default Astro project structure includes a collection of folders and files that you can use to run and customize Airflow.  For this tutorial, you only need to know the following files and folders:

- `/dags`: A directory of DAG files. Each Astro project includes two example DAGs. For more information on DAGs, see [Introduction to Airflow DAGs](https://www.astronomer.io/guides/dags/).
- `Dockerfile`: This is where you specify your Airflow version. For advanced use cases, you can also configure this file with Docker-based commands to run locally at build time.

## Step 2: Start Airflow

Now that you have an Astro project ready, the next step is to actually start Airflow on your machine. In your terminal, open your Astro project directory and run the following command to start Airflow:

```sh
astro dev start
```

Starting Airflow for the first time can take 2 to 5 minutes. Once your local environment is ready, your terminal should show the following text:

```text
Project is running! All components are now available.

Airflow Webserver: <http://localhost:8080>
Postgres Database: localhost:5432/postgres
The default Airflow UI credentials are: admin:admin
The default Postgres DB credentials are: postgres:postgres

```

:::info

If port 8080 or 5432 are in use on your machine, Airflow won't be able to start. To run Airflow on alternative ports, run:

```sh
astro config set webserver.port <available-port>
astro config set postgres.port <available-port>
```

:::

## Step 3: Log in to the Airflow UI

The [Airflow UI](https://www.astronomer.io/guides/airflow-ui/) is essential for managing Airflow. It contains information about your current DAG runs and configuration menus for Airflow connections, variables, and pools.

To access the Airflow UI, open `http://localhost:8080/` in a browser and log in with `admin` for both your username and password.

The default page in the Airflow UI is the **DAGs** page, which shows an overview of all DAGs in your Airflow environment:

![DAGView.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ec24bc62-a4fb-4aa2-a1d0-fa0f9521d296/DAGView.png)

Each DAG is listed with its tags, owner, previous runs, schedule, timestamp of the last and next run, and the states of recent tasks. Because you haven't run any DAGs yet, the **Runs** and **Recent Tasks** sections are empty. Let's fix that!

## Step 4: Trigger a DAG run

Let's run the `example-dag-basic` DAG that was generated with your Astro project.

1. Before you can run a DAG, you have to unpause it. To unpause `example-dag-basic`, click on the slider button next to its name. Once you unpause it, the DAG will start to run on the schedule defined in its code.

2. While all DAGs can run on a schedule defined in their code, you can manually trigger a DAG run at any time from the Airflow UI. Manually trigger `example-dag-basic` by clicking the play button under the **Actions** column. During development, manually triggering DAG runs can be helpful with debugging.

After you press play, the **Runs** and **Recent Tasks** sections for the DAG start to populate with information. These are only high level summaries of your runs. Next, let's explore the other ways to view DAGs in Airflow.

## Step 5: Explore the Airflow UI

The Airflow UI's navigation bar contains 5 tabs, each with different information about your Airflow environment. For more information about what you can find in each tab, see [The Airflow UI](https://www.astronomer.io/guides/airflow-ui/).

For now, let's explore the available views in the **DAGs** page. To access different DAG views for `example-dag-basic`:

1. Click on the name of the DAG.

    The default DAG view is the **Grid** view, which shows the state of completed and currently running tasks. Each column in the grid represents a complete DAG run, and each block in the column represents a specific task instance. Clicking on a square will open additional information about the related task instance on the righthand side of the UI. The task instance view includes tabs that include additional information for the task instance, such as its logs and historic runs. This is one of many available views that show details about your DAG. For now, let's explore two more views.
2. In the tab with **Grid** highlighted, click **Graph**. This view shows the dependencies between your tasks and is useful for troubleshooting issues that stem from dependencies.
3. In the tab with **Graph** highlighted, click **Code**. This view shows the source code for your DAG.

  :::info

  While DAG code can be viewed from within the Airflow UI, code edits have to be done directly in the Python file within the `/dags` folder. The displayed code will every 30 seconds.

  :::

## Step 6: Write a new DAG

In this step, we'll write a DAG that multiplies an input by 23. You will copy most of the code, trigger the DAG, and check to make sure you get the expected output.

1. Create a new Python file in the `/dags` folder named `my-dag.py`
2. Open `my-dag.py` in your IDE. Start by adding the required imports for Python packages:

    ```python
    from airflow import DAG
    from airflow.operators.python import PythonOperator
    from airflow.operators.bash import BashOperator

    from datetime import datetime, timedelta

    ```

    The first line imports the `DAG` class, the second and third line import two Airflow operators that we use in this example, and the last line imports two objects from the [datetime package](https://docs.python.org/3/library/datetime.html, which is required to define the schedule of a DAG.

3. In the same file, add two static variables and a simple Python function that multiplies an input by 23. We will call this code later in our DAG using an Airflow operator.

    ```python
    # constants
    MY_NAME = "MY_NAME"
    MY_NUMBER = 19

    def multiply_by_23(number):
        """Multiplies a number by 23 and prints the results to Airflow logs."""
        result = number * 23
        print(result)

    ```

4. Add a `dag` object, which is an instance of the `DAG` class:

    ```python
    with DAG(
        dag_id="my_first_dag",
        start_date=datetime(2022,7,28),
        schedule_interval=timedelta(minutes=30),
        catchup=False,
        tags= ["tutorial"],
        default_args={
            "owner": MY_NAME,
            "retries": 2,
            "retry_delay": timedelta(minutes=5)
        }
    ) as dag:

    ```

    `with DAG(...) as dag:` instantiates a DAG context in which tasks can be defined and given depenencies. The instantiation includes several important arguments:

    - `dag_id` (Required): The name of the DAG that appears in the Airflow UI. Each DAG must have unique name, and it's best practice to use the same name for both the DAG file and the `dag_id`.
    - `start_date` (Required): The date and time from which the DAG will be scheduled, given as a datetime object. In this example, the DAG will be triggered on its schedule as long as the current time is 0:00 UTC on July 28th, 2022 or later.
    - `schedule_interval`: The frequency at which this DAG runs. You can define this as a timedelta object, a [CRON expression](https://crontab.guru/), or a macro like "@daily". If you don't set this value, the DAG runs every 24 hours after the `start_date`.
    - `catchup`: Determines whether the DAG reruns all DAG runs that were scheduled before today's date. The default value is `True`, but it's best practice to set this argument to `False` unless you are explicitly running your DAG to backfill runs.
    - `tags`: Defines the **Tags** that appear in the **DAGs** page of the Airflow UI. These can help you organize DAGs in more complex projects.
    - `default_args`: A list of configurations for the DAG's behavior. In this DAG, we use these arguments to change the owner of the DAG, give the DAG a maximum of two retries in case it fails, and tell the DAG to wait five minutes before retrying. Many more arguments can be passed to a DAG at instantiation. See [Airflow documentation](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/models/dag/index.html) for a complete list.

4. Add an operator to your DAG:

    ```python
    t1 = BashOperator(
        task_id="say_my_name",
        bash_command=f"echo {MY_NAME}"
    )

    ```

    An operator is a Python class containing the logic to define the work to be completed by a single task. Our first task (`t1`) uses the [BashOperator](https://registry.astronomer.io/providers/apache-airflow/modules/bashoperator) to run a bash command that prints the `MY_NAME` variable to the terminal. The `task_id` defines the name of the task that appears in the Airflow UI. Each task requires a unique `task_id`.

5. Add a second operator to your DAG:

    ```python
    t2 = PythonOperator(
        task_id="multiply_my_number_by_23",
        python_callable=multiply_by_23,
        op_kwargs={"number": MY_NUMBER}
    )
    ```

    Our second task (`t2`) uses the [PythonOperator](https://registry.astronomer.io/providers/apache-airflow/modules/pythonoperator) to call the `mulitply_by_23` function that we defined earlier. We can then pass arguments to the Python function by defining a dictionary of key value pairs in the `op_kwargs` parameter.

    This is one of the features that makes Airflow so powerful: Any action that can be defined in Python, no matter how complex, can be orchestrated using Airflow.

6. Define the dependencies between the two tasks using bit-shift operators:

    ```python
    t1 >> t2
    ```

    This notation is unique to Airflow. It both defines and visualizes the dependencies between tasks. `t1` is **upstream** of `t2`. meaning that `t1` must finish before `t2` can start.

    There are multiple ways to define dependencies in Airflow, but this is one of the simplest. For more options on how to define task dependencies, see [Managing Dependencies in Apache Airflow](https://www.astronomer.io/guides/managing-dependencies).

7. Save your code.

## Step 7: Run the new DAG

To see your new DAG in the Airflow UI, run your browser at `http://localhost:8080/`. As long as Airflow is running, it automatically picks up any new changes in your `/dags` directory. Existing files will be parsed for changes every 30 seconds while new files can be detected every 5 minutes.

Once your new DAG appears in the Airflow UI, we can run it:

1. Unpause the new DAG and trigger a run like you did in Step 4.
2. Click the name of your new DAG and open **Graph** view. After your DAG runs, there should be a dark green border around the tasks in the graph showing that your run was successful.

![GraphView.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/95aadf3a-ded5-402f-84ff-bbe62099e0fb/GraphView.png)

## Step 8: View task logs

When we tell Airflow to print something to the terminal, the output appears in Airflow's logs. To see the output of our tasks:

1. In the Airflow UI, open either the **Grid** or the **Graph** view.  
2. Click the `say_my_name` task to make the task instance view appear.
3. Click the **Log** button.

In the log output, you should see the string we set for the `MY_NAME` constant:

```text
[2022-07-29, 15:17:19 UTC] {subprocess.py:74} INFO - Running command: ['bash', '-c', 'echo MY_NAME']
[2022-07-29, 15:17:19 UTC] {subprocess.py:85} INFO - Output:
[2022-07-29, 15:17:19 UTC] {subprocess.py:92} INFO - MY_NAME
[2022-07-29, 15:17:19 UTC] {subprocess.py:96} INFO - Command exited with return code 0
[2022-07-29, 15:17:19 UTC] {taskinstance.py:1415} INFO - Marking task as SUCCESS. dag_id=my_first_dag, task_id=say_my_name, execution_date=20220729T144715, start_date=20220729T151718, end_date=20220729T151719

```

Follow the same steps for the `multiply_my_number_by_23` task. The task logs should include the results of our multiplication operation.

```text
[2022-07-29, 15:17:22 UTC] {logging_mixin.py:115} INFO - 437
[2022-07-29, 15:17:22 UTC] {python.py:173} INFO - Done. Returned value was: None
[2022-07-29, 15:17:22 UTC] {taskinstance.py:1415} INFO - Marking task as SUCCESS. dag_id=my_first_dag, task_id=multiply_my_number_by_23, execution_date=20220729T144715, start_date=20220729T151721, end_date=20220729T151722
```

## Step 9: Use the Astronomer Registry

The example DAG you wrote used two different core Airflow operators, but there are many more operators available outside of core Airflow. The best place to explore and search for operators is the [Astronomer Registry](https://registry.astronomer.io/).

The Astronomer Registry is also home to a growing set of [example DAGs](https://registry.astronomer.io/dags) that demonstrate more complex use cases and integrations. Let's try adding an example DAG to our Astro project:

1. Go to the [Astronomer Registry](https://registry.astronomer.io/).
2. Click **Browse DAGs**.
3. In the search bar, search for `TaskFlow API`.
4. Open the **TaskFlow API ETL Example** DAG.
5. In the DAG's information page, click the **Code** tab and copy the contents of the DAG code.
6. Paste the code into a new `.py` in the `dags` folder of your Astro project.
7. Run the DAG from the Airflow UI.

This DAG demonstrates how you can define task dependencies using the TaskFlow API, which is a popular, more Pythonic method of writing DAGs. Instead of defining dependencies with bitshift operators, we can do so with direct calls to functions that have been decorated as tasks. In the example DAG, the following line:

```python
store_data(process_data(extract_bitcoin_price()))
```

has the same dependency structure as:

```
extract_bitcoin_price >> process_data >> store_data
```

If this style of writing DAGs feels more intuitive to you, read more about it in the [Airflow Decorators guide](https://www.astronomer.io/guides/airflow-decorators/).

## Conclusion

After completing this tutorial, you should know how to:

- Run a local Airflow environment using the Astro CLI.
- Manage the Astro project directory.
- Write a DAG from scratch.
- Navigate the Airflow UI.
- Use code from the Astronomer registry.

### Next steps

Astronomer offers a variety of resources like this tutorial to learn more about how to use Airflow.

- [Astronomer Webinars](https://www.astronomer.io/events/webinars/) cover concepts and use cases in-depth and offer the possibility to ask us questions live on air.
- [Live with Astronomer](https://www.astronomer.io/events/live/) are hands-on and code focussed live walkthroughs of specific Airflow features.
- [Astronomer Guides](https://www.astronomer.io/guides/) cover both entry and expert level concepts in Airflow.
- [Astronomer Academy](https://academy.astronomer.io/) offers many video tutorials and the option to purchase full length Airflow courses and to take exams to get certified.

Don't know where to start? For beginners, the next resources we recommend are:

- [Managing connections in Airflow](https://www.astronomer.io/guides/connections/): Learn how to connect Airflow to third party products and services.
- [Branching in Airflow](https://www.astronomer.io/guides/airflow-branch-operator): Learn how to use conditional logic in Airflow.
- [Develop a project](develop-project.md): Learn about all of the ways you can configure your Astro project and local Airflow environment.
- [Passing Data between Airflow Tasks](https://www.astronomer.io/guides/airflow-passing-data-between-tasks): Learn how you can pass values resulting from a task execution to a downstream task.
- [DAG Writing Best Practices](https://www.astronomer.io/guides/dag-best-practices?search=best): Learn how to write efficient, secure, and scalable DAGs.
