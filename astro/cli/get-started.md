---
sidebar_label: 'Get started'
title: 'Get started with Airflow using the Astro CLI'
id: get-started
description: Deploy your first local Airflow project with the Astro CLI.
---

Getting started with Airflow locally is made simple thanks to the Astro CLI.

This tutorial guides you through the process of using the Astro CLI to create a project, run your project in a local Airflow environment, and write DAGs. We will also cover how to use the Astronomer Registry to discover example DAGs and Airflow providers.

## Time to complete

This tutorial can be completed in 1 hour or less.

## Assumed knowledge

To get the most out of this tutorial, you should have knowledge of:

- Airflow fundamentals. See [Introduction to Apache Airflow](https://www.astronomer.io/guides/intro-to-airflow).
- Python fundamentals. See the [Python Documentation](https://docs.python.org/3/tutorial/index.html).
- How to provide arguments to Airflow operators. See [Operators 101](https://www.astronomer.io/guides/what-is-an-operator).

## Prerequisites

To use this tutorial, the following software is required:

- [Astro CLI](cli/configure-cli.md)
- [Docker Desktop](https://docs.docker.com/get-docker/) (v18.09 or higher)
- [Python 3](https://www.python.org/downloads/)
- A terminal that accepts bash commands (pre-installed on most operating systems)

Additionally, we recommend that you use an IDE for Python development, such as [VSCode](https://code.visualstudio.com/).

## Step 1: Create an Astro project

After [installing the Astro CLI](cli/configure-cli.md), create a folder for the new Astro project and run the initialization command from the terminal:

```sh
astro dev init
```

This command creates the folders and files necessary to run a Dockerized Airflow environment.

[Docker](https://docs.docker.com/) is a service to run software in virtualized containers within a machine. When you run Airflow locally with the Astro CLI, Docker creates these containers based the [Astro Runtime Docker image](https://docs.astronomer.io/astro/runtime-release-notes), which contains all necessary specifications on how to run the 4 [core Airflow components](https://www.astronomer.io/guides/airflow-components/). For this tutorial, no in-depth knowledge of Docker is needed. All you need to know is that Airflow will run in a containerized environment on your machine, and all necessary files for running these containers are included in the default Astro project.

The default Astro project includes the following files and folders:

- `/.astro`: A set of configurations that should not be edited directly.
- `/dags`: A directory for Python files for defining DAGs. The default Astro project includes to example DAGs. For more information on DAGs, see [Introduction to Airflow DAGs](https://www.astronomer.io/guides/dags/).
- `/include`: A directory for additional files that are accessible to your DAGs. All files in this directory are packaged into your Airflow environment.
- `/plugins`: A directory for [plugins](https://www.astronomer.io/guides/using-airflow-plugins) that can further customize Airflow for advanced use cases.
- `/tests` : A directory for unit tests that you can run with `astro dev pytest`. The default Astro project includes a few basic unit tests.
- `.dockerignore`: A list of folders and files and folders that Docker ignores when building your Airflow environment.
- `.gitignore`: A list of folders and files that [git](https://git-scm.com/) ignores when parsing the project. Using git is not required for this tutorial.
- `airflow_settings.yaml`: A file for configuring Airflow [connections](https://www.astronomer.io/guides/connections/), [pools](https://www.astronomer.io/guides/airflow-pools/) and [variables](https://airflow.apache.org/docs/apache-airflow/stable/howto/variable.html) in YAML.
- `Dockerfile`: A list of commands that Docker runs when building containers for your Airflow environment.
- `packages.txt`: A list of OS-level packages that Docker installs when building your Airflow environment.
- `README.md`: The overview of your project contents.
- `requirements.txt`: A list of Python-level packages that Docker installs when building your Airflow environment.

## Step 2: Start Airflow

In your terminal, open your Astro project directory and run the following command to start Airflow:

```sh
astro dev start
```

Starting Airflow for the first time can take 2-5 minutes. Once the CLI successfully starts Airflow, your terminal should show the following text:

```
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

Each DAG is listed with its tags, owner, previous runs, schedule, timestamp of the last and next run, and the states of recent tasks. Because you haven't run any DAGs yet, the `Runs` and `Recent Tasks` sections are empty. Let's fix that!

## Step 4: Trigger a DAG run

1. Before you can run a DAG, you have to activate it. To activate a DAG, click on the slider button next to its name. Once activated, the DAG runs once for its latest scheduled date.

2. While all DAGs run on a schedule defined in their code, you can manually trigger a DAG run at any time from the Airflow UI. Manually trigger an active DAG by clicking the play button under **Actions**. During development, manually triggering DAG runs can be helpful with debugging.

![DAGView_start_DAG.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/40421eb0-a4f6-4215-8562-d2040d97feea/DAGView_start_DAG.png)

## Step 5: Explore the Airflow UI

The Airflow UI's navigation bar contains 5 tabs:

- **DAGs**: A page that shows all DAGs, and the default page after opening the Airflow UI.
- **Security**: A set of pages where you can configure users, roles, and permissions.
- **Browse**: A set of pages that show information about previous DAG and task runs.
- **Admin**: A set of pages where you can configure Airflow connections, variables, and pools.
- **Docs**: A link out to Airflow documentation.

For now, let's explore the different available views in the **DAGs** page. To access different DAG views, click on a DAG's name.

The default DAG view is the **Grid** view, which shows the state of completed and currently running tasks. Each column in the grid represents a complete DAG run, and each block in the column represents a specific task instance. Clicking on a green square will open additional information about the related task instance on the righthand side of the UI. The task instance view includes tabs that include additional information for the task instance, such as its logs and historic runs.

The **Grid** view is one of many available views that show details about your DAG. For now, let's explore one more view. In the tab with **Grid** highlighted, click **Code**. This view shows the source code for your DAG.

:::info

While DAG code can be viewed from within the Airflow UI, code edits have to be done directly in the Python file within the `/dags` folder. The displayed code will update when the scheduler parses the `/dags` folder, which by default happens every 30 seconds.

:::

## 6. Write a new DAG

Now that you know how to start and Airflow environment and run DAGs, you can start writing and testing your own DAGs.

1. Create a new Python file in the `/dags` folder named `my-dag.py`
2. Open the file in your IDE. Start by adding the required imports for Python packages:

    ```python
    from airflow import DAG
    from airflow.operators.python import PythonOperator
    from airflow.operators.bash import BashOperator

    from datetime import datetime, timedelta

    ```

    The first line imports the `DAG` class, the second and third line import different Airflow operators, and the last line imports two objects from the [datetime package](https://docs.python.org/3/library/datetime.html) which help define dates and time intervals for DAG scheduling.

3. Add two static variables and a simple Python function that multiplies an input by 23. These are can be used Airflow operators later in our DAG code.

    ```python
    # constants
    MY_NAME = "MY_NAME"
    MY_NUMBER = 19

    def multiply_by_23(number):
        """Multiplies a number by 23."""
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

    `with DAG(...) as dag:` instantiates a DAG context in which Airflow operators can be defined and given depenencies. The instantiation includes several important arguments:

    - `dag_id` (Required): The name of the DAG that appears in the Airflow UI. Each DAG must have unique name, and it's best practice to use the same name for both the DAG file and the `dag_id`.
    - `start_date` (Required): The date and time from which the DAG will be scheduled, given as a datetime object.
    - `schedule_interval`: How often the DAG should run. You can define this as a timedelta object, a [CRON expression](https://crontab.guru/), or a macro like "@daily". If you don't set this value, the DAG runs every 24 hours after the `start_date`.
    - `catchup`: Determines whether the DAG reruns all DAG runs that were scheduled before today's date. The default value is `True`, but it's best practice to set this argument to `False`.
    - `tags`: Defines the **Tags** that appear in the **DAGs** page of the Airflow UI.
    - `default_args`: A list of configurations for the DAG's behavior. In this DAG, we use these arguments to change the owner of the DAG, give the DAG a maximum of two retries in case it fails, and tell the DAG to wait five minutes before retrying. Many more arguments can be passed to a DAG at instantiation. See [Airflow documentation](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/models/dag/index.html) for a complete list.

4. Add an operator to your DAG:

    ```python
    t1 = BashOperator(
        task_id="say_my_name",
        bash_command=f"echo {MY_NAME}"
    )

    ```

    Operators define the work to be completed by your DAG. They often encapsulate a single task or step of your DAG. Task 1 (`t1`) uses the [BashOperator](https://registry.astronomer.io/providers/apache-airflow/modules/bashoperator) to run a bash command printing the `MY_NAME` variable to the terminal. The `task_id` defines the name of the task that appears in the Airflow UI. Each task requires a unique `task_id`.

    We can now use `t1` to define dependencies within our DAG code.

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

Refresh your browser at `http://localhost:8080/`. As long as Airflow is running, it automatically picks up any new changes in your `/dags` directory.

Click the name of your new DAG and open **Graph** view. The **Graph** view shows the dependencies between your tasks and is useful for troubleshooting issues that stem from dependencies.

You can trigger a DAG run from any view in the **DAGs** page using the play button in the upper righthand corner of the UI. Trigger your new DAG from the **Graph** view.

After your DAG runs, there should be a dark green border around the tasks showing that your run was successful.

![GraphView.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/95aadf3a-ded5-402f-84ff-bbe62099e0fb/GraphView.png)

### 8. Check out task logs

When we tell Airflow to print something to the terminal, the output appears in Airflow's logs. To see the output of our tasks, we need to open our tasks in either the **Grid** or the **Graph** view.  

Click the `say_my_name` task to make the task instance view appear. From here, click the **Log** button.

In the log output, you should see the string we set for the `MY_NAME` constant:

```
[2022-07-29, 15:17:19 UTC] {subprocess.py:74} INFO - Running command: ['bash', '-c', 'echo MY_NAME']
[2022-07-29, 15:17:19 UTC] {subprocess.py:85} INFO - Output:
[2022-07-29, 15:17:19 UTC] {subprocess.py:92} INFO - MY_NAME
[2022-07-29, 15:17:19 UTC] {subprocess.py:96} INFO - Command exited with return code 0
[2022-07-29, 15:17:19 UTC] {taskinstance.py:1415} INFO - Marking task as SUCCESS. dag_id=my_first_dag, task_id=say_my_name, execution_date=20220729T144715, start_date=20220729T151718, end_date=20220729T151719

```

Follow the same steps for the `multiply_my_number_by_23` task. The task logs should include the results of our multiplication operation.

```
[2022-07-29, 15:17:22 UTC] {logging_mixin.py:115} INFO - 437
[2022-07-29, 15:17:22 UTC] {python.py:173} INFO - Done. Returned value was: None
[2022-07-29, 15:17:22 UTC] {taskinstance.py:1415} INFO - Marking task as SUCCESS. dag_id=my_first_dag, task_id=multiply_my_number_by_23, execution_date=20220729T144715, start_date=20220729T151721, end_date=20220729T151722
```

## Step 9: Use the Astronomer Registry

The example DAG you wrote used two different core Airflow operators, but there are many more operators available outside of core Airflow. The best place to explore and search for operators is the [Astronomer Registry](https://registry.astronomer.io/).

The Astronomer Registry is also home to a growing set of [example DAGs](https://registry.astronomer.io/dags) that demonstrate more complex use cases and integrations.

Pick an example DAG that uses tools you know and copy its code into a new file in your local `/dags` folder.

If you are new to the world of data engineering and haven't used other tools yet, you can use the [TaskFlow API ETL Example](https://registry.astronomer.io/dags/taskflow-etl) which demonstrates how you can define task dependencies using the TaskFlow API.

Depending on which DAG you picked, Airflow might produce an import error. This is because the DAG uses modules that are not part of core Airflow.

![ImportError.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9da60514-66c0-4500-9987-9a6bc62bc6a3/ImportError.png)

These modules have to be made available to your Docker image before you run the `astro dev start` command. Search the registry for the missing package, click on the provider, and copy its name.

![SearchProvider.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d97c954d-3b50-4b0c-a7d8-b7422284c0b3/SearchProvider.png)

Paste this name on its own line in the `requirements.txt` file of your Astro project. If you want, you can also install a specific version like in the following example:

```
apache-airflow-providers-common-sql==1.0.0
```

If you make changes to `requirements.txt`, `packages.txt`, or `Dockerfile`, or you add new files to `/include` or `/plugins`, you need to restart your Airflow environment to build your changes.

You can restart Airflow using the Astro CLI by running:

```sh
astro dev restart
```

## Step 10: Add variables and connections

Some DAGs require additional configurations like setting Airflow [variables](https://airflow.apache.org/docs/apache-airflow/stable/howto/variable.html) and [connections](https://airflow.apache.org/docs/apache-airflow/stable/howto/connection.html). Airflow variables define values for your DAGs outside of your DAG code, while connections define how Airflow integrates with external systems. Take the following code, for example:

```python

upload_file = LocalFilesystemToS3Operator(
    task_id="upload_to_s3",
    filename=CSV_FILE_PATH,
    dest_key="{{ var.json.aws_configs.s3_key_prefix }}/" + CSV_FILE_PATH,
    dest_bucket="{{ var.json.aws_configs.s3_bucket }}",
    # This code requires an Airflow connection to connect to AWS
    aws_conn_id="aws_default",
    replace=True,
)

@task
def validate_etag():
    """
    #### Validation task
    Check the destination ETag against the local MD5 hash to ensure the file
    was uploaded without errors.
    """
    s3 = S3Hook()
    # This code requires an Airflow variable that contains a JSON file of AWS configurations
    aws_configs = Variable.get("aws_configs", deserialize_json=True)
    obj = s3.get_key(
        key=f"{aws_configs.get('s3_key_prefix')}/{CSV_FILE_PATH}",
        bucket_name=aws_configs.get("s3_bucket"),
    )
    obj_etag = obj.e_tag.strip('"')
    file_hash = hashlib.md5(
        open(CSV_FILE_PATH).read().encode("utf-8")).hexdigest()
    if obj_etag != file_hash:
        raise AirflowException(
            f"Upload Error: Object ETag in S3 did not match hash of local file."
        )
```

If the code contains `Variable.get("variable_name")`, you need to add a variable of that name with a fitting input. If the code contains a `conn_id` parameter, you need to define an Airflow connection.

To create connections, go to **Admin** > **Connections** in the Airflow UI. In the case of the code above, we need to define an `aws_default` connection. For more information about managing connections, see [Managing your Connections in Apache Airflow](https://www.astronomer.io/guides/connections/).

Airflow variables can be defined in **Admin** > **Variables**. However, it's best practice to define them as environment variables in your Astro project's `.env` file. All custom environment variables used by Airflow must start with `AIRFLOW_VAR`:

```text
AIRFLOW_VAR_MY_VAR="my-value"
AIRFLOW_VAR_AWS_CONFIGS="<your-config-json>"
```

Environment variables can be accessed from within the DAG alongside your imports:

```python
import os
my_var = os.environ["AIRFLOW_VAR_AWS_CONFIGS"]
```

### 9.4 TaskFlow API

Many DAGs in the Astronomer Registry use a slightly different syntax to define their DAG and tasks with Python decorators. Decorators are a Python-specific tool that wrap one function around another to make code more readable. We can use decorators in DAGs thanks to the [TaskFlow API](https://airflow.apache.org/docs/apache-airflow/stable/tutorial_taskflow_api.html#).

Decorators are available to instantiate DAGs, define TaskGroups, and create Python and Docker tasks. They can be used together with regular operators in the same DAG.

The following DAG has the same functionality as the example DAG in step 6, but it has been rewritten using the `@dag()` and `@task()` decorators. The first task using the BashOperator stays the same because there is no decorators available for the BashOperator.

```python
from airflow.decorators import dag, task
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator

from datetime import datetime, timedelta

MY_NAME = "MY_NAME"
MY_NUMBER = 19

@dag(
    schedule_interval=timedelta(minutes=30),
    start_date=datetime(2022,7,28),
    catchup=False,tags= ["tutorial"],
    default_args={
        "owner": MY_NAME,
        "retries": 2,
        "retry_delay": timedelta(minutes=5)
        }
    )
def my_first_dag():

    t1 = BashOperator(
        task_id="say_my_name",
        bash_command=f"echo {MY_NAME}"
    )

    @task(task_id='multiply_my_number_by_23')
    def multiply_by_23(number = MY_NUMBER):
        """Multiplies a number by 23."""
        result = number * 23
        print(result)

    t1 >> multiply_by_23()

dag = my_first_dag_2()

```

Note the last line of the code example: DAGs defined using the `@dag()` decorator must be called to appear in Airflow.

Whether to use regular operators or decorated tasks is often a question of personal preference. The TaskFlow API offers more abstraction and generally requires less code.

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

- [Branching in Airflow](https://www.astronomer.io/guides/airflow-branch-operator): Learn how to use conditional logic in Airflow.
- [Passing Data between Airflow Tasks](https://www.astronomer.io/guides/airflow-passing-data-between-tasks): Learn how you can pass values resulting from a task execution to a downstream task.
- [DAG Writing Best Practices](https://www.astronomer.io/guides/dag-best-practices?search=best): Learn how to write efficient, secure, and scalable DAGs.
