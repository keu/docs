---
title: "Introduction to the TaskFlow API and Airflow decorators"
sidebar_label: "TaskFlow API & Decorators"
description: "An overview of Airflow decorators and how they can improve the DAG authoring experience."
id: airflow-decorators
---

import CodeBlock from '@theme/CodeBlock';
import airflow_decorator_example_traditional_syntax from '!!raw-loader!../code-samples/dags/airflow-decorators/airflow_decorator_example_traditional_syntax.py';
import airflow_decorator_example from '!!raw-loader!../code-samples/dags/airflow-decorators/airflow_decorator_example.py';
import airflow_decorators_traditional_mixing from '!!raw-loader!../code-samples/dags/airflow-decorators/airflow_decorators_traditional_mixing.py';
import airflow_decorators_sdk_example from '!!raw-loader!../code-samples/dags/airflow-decorators/airflow_decorators_sdk_example.py';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The TaskFlow API is a functional API that allows you to explicitly declare information being passed between tasks while inferring task dependencies. In a nutshell, when using the TaskFlow decorator functions (e.g. `@task`) you can pass data between tasks by providing the output of one task as an argument to another task. Additionally using Airflow decorators often reduces the amount of code needed to define Airflow tasks. 

Astronomer recommends to use Airflow decorators for all tasks where they are available, especially when you are writing Python heavy DAGs. Decorators are a simpler, cleaner way to define your tasks and DAGs and can be used in combination with traditional operators.

In this guide, you'll learn about the benefits of decorators, the decorators available in Airflow, and decorators provided in the Astronomer open source Astro Python SDK library. You'll also review examples and learn when you should use decorators and how you can combine them with traditional operators in a DAG.

## Assumed knowledge

To get the most out of this guide, you should have an understanding of:

- Basic Python. See the [Python Documentation](https://docs.python.org/3/tutorial/index.html).
- Airflow operators. See [Operators 101](what-is-an-operator.md).

## What is a decorator?

In Python, [decorators](https://realpython.com/primer-on-python-decorators/) are functions that take another function as an argument and extend the behavior of that function. For example, the `@multiply_by_100_decorator` below takes in any function as the `decorated_function` argument and will return the result of that function multiplied by 100. 

In the context of Airflow, decorators contain much more functionality than this simple example, but the basic idea is the same: the Airflow decorator function turns a normal Python function into an Airflow task, task group or DAG.

```python
# definition of the decorator function
def multiply_by_100_decorator(decorated_function):
    def wrapper(num1, num2):
        result = decorated_function(num1, num2) * 100
        return result

    return wrapper


# definition of the `add` function decorated with the `multiply_by_100_decorator`
@multiply_by_100_decorator
def add(num1, num2):
    return num1 + num2


# definition of the `subtract` function decorated with the `multiply_by_100_decorator`
@multiply_by_100_decorator
def subtract(num1, num2):
    return num1 - num2


# calling the decorated functions
print(add(1, 9))  # prints 1000
print(subtract(4, 2))  # prints 200
```

## When to use The TaskFlow API

The purpose of the TaskFlow API in Airflow is to simplify the DAG authoring experience by eliminating the boilerplate code required by traditional operators. The result can be cleaner DAG files that are more concise and easier to read.

In general, whether to use the TAskFlow API is a matter of developer preference and style. In most cases, a TaskFlow decorator and the corresponding traditional operator will have the same functionality. You can also easily [mix decorators and traditional operators](#mixing-decorators-with-traditional-operators) within your DAG if your use case requires that.

## How to use the TaskFlow API

The TaskFlow API allows you to write your Python tasks with decorators and handles passing data between tasks using XCom and inferring task dependencies automatically.

Using decorators to define your Python functions as tasks is easy. Let's take a before and after example. Under the **Traditional syntax** tab below, there is a basic ETL DAG with tasks to get data from an API, process the data, and store it. Click on the **Decorators** tab to see the same DAG written using Airflow decorators.

<Tabs
    defaultValue="traditional"
    groupId= "how-to-use-airflow-decorators"
    values={[
        {label: 'Traditional syntax', value: 'traditional'},
        {label: 'TaskFlow API', value: 'taskflow'},
    ]}>

<TabItem value="traditional">

<CodeBlock language="python">{airflow_decorator_example_traditional_syntax}</CodeBlock>

</TabItem>

<TabItem value="taskflow">

<CodeBlock language="python">{airflow_decorator_example}</CodeBlock>

</TabItem>
</Tabs>

The decorated version of the DAG eliminates the need to explicitly instantiate the PythonOperator, has much less code and is easier to read. Notice that it also doesn't require using `ti.xcom_pull` and `ti.xcom_push` to [pass data between tasks](airflow-passing-data-between-tasks.md). This is all handled by the TaskFlow API when you define your task dependencies with `store_data(process_data(extract_bitcoin_price()))`.

Here are some other things to keep in mind when using decorators:

- When you define a task, the `task_id` will default to the name of the function you decorated. If you want to change this behavior, you can simply pass a `task_id` to the decorator as was done in the `extract` task above. Similarly, other [BaseOperator](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/models/baseoperator/index.html#airflow.models.baseoperator.BaseOperator) task-level parameters such as retries or pools can be defined within the decorator:

    ```python
    @task(
        task_id="say_hello_world"
        retries=3,
        pool="my_pool",
    )
    def taskflow_func():
        retun "Hello World"

    taskflow_func()  # this creates a task with the task_id `say_hello_world`
    ```

- You can override task-level parameters when calling the task by using the `.override()` method. Note the `()` at the end of the line, which calls the task with the overridden parameters applied.

    ```python
    # this creates a task with the task_id `greeting`
    taskflow_func.override(retries=5, pool="my_other_pool", task_id="greeting")()
    ```

- For any decorated function in your DAG file, you must call them so that Airflow can register the task or DAG. For example `taskflow()` is called at the end of the DAG above to call the DAG function. Every task defined using decorators has to be called as shown in the code snippet below. If you call the same task multiple times and do not override the `task_id`, multiple tasks will be created in the DAG with automatically generated unique task IDs by appending a unique number to the end of the original task id (e.g. `say_hello`, `say_hello__1`, `say_hello__2` etc). 

    ```python
    # task definition
    @task
    def say_hello(dog):
        return f"Hello {dog}!"

    ### calling the task 4 times, creating 4 tasks in the DAG
    # this task will have the id `say_hello` and print "Hello Avery!"
    say_hello("Avery")
    # this task will have the id `greet_dog` and print "Hello Piglet!"
    say_hello.override(task_id="greet_dog")("Piglet")
    # this task will have the id `say_hello__1` and print "Hello Peanut!"
    say_hello("Peanut")
    # this task will have the id `say_hello__2` and print "Hello Butter!"
    say_hello("Butter")
    ```

- You can decorate a function that is imported from another file as shown in the code snippet below:

    ```python
    from include.my_file import my_function

    @task
    def taskflow_func():
        my_function()
    ```
    
    This is recommended in cases where you have lengthy Python functions since it will make your DAG file easier to read.

- You can assign the output of a called decorated task to a Python object to be passed as an argument into another decorated task. This is helpful when the output of one decorated task is needed in several downstream functions and to make DAGs with complicated dependencies more legible. 

    ```python
    @task 
    def get_fruit_options():
        return ["peach", "raspberry", "pineapple"]
    
    @task
    def eat_a_fruit(list):
        index = random.randint(0, len(list) - 1)
        print(f"I'm eating a {list[index]}!")

    @task 
    def gift_a_fruit(list):
        index = random.randint(0, len(list) - 1)
        print(f"I'm giving you a {list[index]}!")
    
    # you can assign the output of a decorated task to a Python object
    my_fruits = get_fruit_options()
    eat_a_fruit(my_fruits)
    gift_a_fruit(my_fruits)
    ```

Get more examples on how to use Airflow task decorators in this [Astronomer webinar](https://www.astronomer.io/events/webinars/writing-functional-dags-with-decorators/) and this Apache Airflow [TaskFlow API tutorial](https://airflow.apache.org/docs/apache-airflow/stable/tutorial/taskflow.html).

### Mixing decorators with traditional operators

If you have a DAG that uses `PythonOperator` and other operators that don't have decorators, you can easily combine decorated functions and traditional operators in the same DAG. For example, you can add an `EmailOperator` to the previous example by updating your code to the following:

<CodeBlock language="python">{airflow_decorators_traditional_mixing}</CodeBlock>

Note that when adding traditional operators, dependencies are still defined using bit-shift operators.

You can pass information between decorated tasks and traditional operators using [XCom](airflow-passing-data-between-tasks.md). See the tabs below for examples.

<Tabs
    defaultValue="two-flow"
    groupId="mixing-decorators-with-traditional-operators"
    values={[
        {label: 'TaskFlow to TaskFlow', value: 'two-flow'},
        {label: 'TaskFlow to Traditional operator', value: 'flow-traditional'},
        {label: 'Traditional operator to TaskFlow', value: 'traditional-flow'},
        {label: 'Traditional operator to Traditional operator', value: 'two-traditional'},
    ]}>

<TabItem value="two-flow">

If both tasks are defined using the TaskFlow API, you can pass information directly between them by providing the called task function as a positional argument to the downstream task. Airflow will infer the dependency between the two tasks.

```python
@task
def get_23_TF():
    return 23

@task
def plus_10_TF(x):
    return x + 10

plus_10_TF(get_23_TF())  # plus_10_TF will return 33
# or `plus_10_TF(x=get_23_TF())` if you want to use kwargs
```
</TabItem>
<TabItem value="flow-traditional">

You can access the returned value of a traditional operator using the `.output` attribute of the task object and pass it to a downstream task defined using Airflow decorators. Airflow will infer the dependency between the two tasks.

```python
def get_23_traditional():
    return 23

@task
def plus_10_TF(x):
    return x + 10

get_23_task = PythonOperator(
    task_id="get_23_task",
    python_callable=get_23_traditional
)

plus_10_TF(get_23_task.output)  # plus_10_TF will return 33
# or `plus_10_TF(x=get_23_task.output)` if you want to use kwargs
```

</TabItem>
<TabItem value="traditional-flow">

When using the result from an upstream TaskFlow task in a traditional task you can provide the called decorated task directly to a parameter in the traditional operator. Airflow will infer the dependency between the two tasks.

```python
@task
def get_23_TF():
    return 23

def plus_10_traditional(x):
    return x + 10

plus_10_task = PythonOperator(
    task_id="plus_10_task",
    python_callable=plus_10_traditional,
    op_args=[get_23_TF()]  # note that op_args expects a list as an input
)

# plus_10_task will return 33
```

</TabItem>
<TabItem value="two-traditional">

For the sake of completeness the below example shows how to use the output of one traditional operator in another traditional operator by accessing the `.output` attribute of the upstream task. The dependency has to be defined explicitly using bit-shift operators.

```python
def get_23_traditional():
    return 23

def plus_10_traditional(x):
    return x + 10

get_23_task = PythonOperator(
    task_id="get_23_task",
    python_callable=get_23_traditional
)

plus_10_task = PythonOperator(
    task_id="plus_10_task",
    python_callable=plus_10_traditional,
    op_args=[get_23_task.output]
)

# plus_10_task will return 33

# when only using traditional operators, define dependencies explicitly
get_23_task >> plus_10_task
```

</TabItem>
</Tabs>

:::info

If you want to access any XCom that is not the returned value an operator, you can use the `xcom_pull` method inside a function, see [how to access ti / task_instance in the Airflow context guide](airflow-context.md#ti--task_instance) for an example. Traditional operators can also pull from XCom using [Jinja templates](templating.md) in templateable parameters.

:::

## Astro Python SDK decorators

The [Astro Python SDK](https://github.com/astronomer/astro-sdk) provides decorators and modules that allow data engineers to think in terms of data transformations rather than Airflow concepts when writing DAGs. The goal is to allow DAG writers to focus on defining *execution* logic without having to worry about orchestration logic.

The library contains SQL and dataframe decorators that greatly simplify your DAG code and allow you to directly define tasks without boilerplate operator code. It also allows you to transition seamlessly between SQL and Python for transformations without having to explicitly pass data between tasks or convert the results of queries to pandas DataFrames and vice versa. For a full description of functionality, check out the [Astro Python SDK documentation](https://astro-sdk-python.readthedocs.io/en/stable/).

To use the Astro Python SDK, you need to install the `astro-sdk-python` package in your Airflow environment and allow serialization of Astro SDK objects by setting the environment variable `AIRFLOW__CORE__ALLOWED_DESERIALIZATION_CLASSES = airflow\.* astro\.*`. For more instructions, check out the [Use the Astro Python SDK tutorial](https://docs.astronomer.io/learn/astro-python-sdk).

To show the Astro Python SDK in action, we'll use a simple ETL example. We have homes data in two different CSVs that we need to aggregate, clean, transform, and append to a reporting table. Some of these tasks are better suited to SQL, and some to Python, but we can easily combine both using `astro-sdk-python` functions. The DAG looks like this:

<CodeBlock language="python">{airflow_decorators_sdk_example}</CodeBlock>

![Astro ETL](/img/guides/astro_etl_graph.png)

The general steps in the DAG are:

1. Combine data from your two source tables. You use a `transform()` function since you are running a SQL statement on tables that already exist in our database. You define the source tables with the `Table()` parameter when you call the function (`center_1=Table('ADOPTION_CENTER_1', conn_id="snowflake", schema='SANDBOX_KENTEND')`).
2. Run another `transform()` function to clean the data; you don't report on guinea pig adoptions in this example, so you'll remove them from the dataset. Each `transform` function will store results in a table in your database. You can specify an `output_table` to store the results in a specific table, or you can let the SDK create a table in a default temporary schema for you by not defining any output.
3. Transform the data by pivoting using Python. Pivoting is notoriously difficult in Snowflake, so you seamlessly switch to Pandas. In this task you specify an `output_table` that you want the results stored in.
4. Append the results to an existing reporting table using the `append` function. Because you pass the results of the previous function (`aggregated_data`) to the `append_data` parameter, the SDK infers a dependency between the tasks. You don't need to explicitly define the dependency yourself.

By defining your task dependencies when calling the functions (for example, `cleaned_data = clean_data(combined_data)`), the Astro Python SDK takes care of passing all context and metadata between the tasks. The result is a DAG where you accomplished some tricky transformations without having to write a lot of Airflow code or explicitly transition between SQL and Python.

## Available Airflow decorators

There are several decorators available to use with Airflow. This list provides a reference of currently available decorators:

- [Astro Python SDK decorators](https://github.com/astronomer/astro-sdk)
- DAG decorator (`@dag()`)
- Task decorator (`@task()`), which creates a Python task
- Python Virtual Env decorator (`@task.virtualenv()`), which runs your Python task in a virtual environment
- Docker decorator (`@task.docker()`), which creates a `DockerOperator` task
- TaskGroup decorator (`@task_group()`), which creates a TaskGroup
- [Short circuit decorator](airflow-branch-operator.md#taskshortcircuit-and-shortcircuitoperator) (`@task.short_circuit()`), which evaluates a condition and skips downstream tasks if the condition is False
- [Branch decorator](airflow-branch-operator.md#taskbranch-and-branchpythonoperator) (`@task.branch()`), which creates a branch in your DAG based on an evaluated condition
- Kubernetes pod decorator (`@task.kubernetes()`), which runs a KubernetesPodOperator task
- [Sensor decorator](what-is-a-sensor.md#sensor-decorator) (`@task.sensor()`), which turns a Python function into a sensor. This sensor was introduced in Airflow 2.5.

You can also [create your own custom task decorator](https://airflow.apache.org/docs/apache-airflow/stable/howto/create-custom-decorator.html).
