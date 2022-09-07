---
title: "Executing notebooks with Airflow"
description: "Methods for orchestrating commonly used notebooks with Airflow."
sidebar_label: "Executing notebooks"
id: executing-notebooks
---

Notebooks are great tools for quickly developing code and presenting data visualizations. They are frequently used in exploratory data analysis, data science, and analytics, and reporting.

Translating code written in a notebook to code running in production can be challenging. Maybe you've developed a machine learning model in a notebook, and now you need to run that model on a schedule and publish the results. Most notebooks do not come with built-in scheduling and orchestration capabilities, and can't easily integrate with other services. Fortunately, Airflow can take care of this for you! Within the vast collection of [Airflow provider packages](https://registry.astronomer.io/), there are hooks and operators you can use to orchestrate almost any type of notebook while taking advantage of Airflow's vast scheduling capabilities.

In this guide, you'll learn how to orchestrate commonly used notebooks, including Jupyter, Databricks, and SageMaker notebooks, using Airflow and the Astro CLI.

## Executing Jupyter Notebooks with Papermill

[Jupyter notebooks](https://jupyter.org/) are the most commonly used open source notebooks out there. They are especially popular for exploratory analysis and data science, offering support for over 40 programming languages.

Jupyter notebooks can be parameterized and executed from Python using the [Papermill package](https://papermill.readthedocs.io/en/latest/index.html). For Airflow specifically, the [Papermill provider](https://registry.astronomer.io/providers/papermill) supplies a `PapermillOperator` that can be used to execute a notebook as an Airflow task.

Note that the `PapermillOperator` is designed to run a notebook locally. Because of this, you need to supply a kernel engine for your Airflow environment to execute the notebook code. If you use the Astro CLI, you can configure your kernel engine and dependencies within your Astro project.

Because the Jupyter notebook is running within your Airflow environment, this method is not recommended for notebooks that process large data sets. For notebooks that are computationally intensive, Databricks or notebook instances from cloud providers like AWS or GCP may be more appropriate.

1. Create a Jupyter notebook and save it in a place where Airflow has access to it. For this example, you can add the notebook to the `/include` directory of your Astro project.
2. Parameterize any cells in your notebook as needed. If you need to pass any information to your notebook at run time, you can do so by tagging the cell in your notebook as described in the [Papermill usage documentation](https://papermill.readthedocs.io/en/latest/usage-parameterize.html).

    The following notebook prints a simple statement with the current date. The second cell is paramaterized so that the `execution_date` is dynamic.

    ![Notebook param](/img/guides/parameterized_notebook.png)

3. Install the Papermill provider and any supporting packages required to run the kernel (such as `jupyter` or `ipykernel`). For example, to install the provider and the package for `ipykernel`, add the following lines to the `requirements.txt` file of your Astro project:

    ```python
    apache-airflow-providers-papermill
    ipykernel
    ```

4. Create your DAG with the `PapermillOperator` to execute your notebook. The operator requires the following arguments:

    - `input_nb`: The notebook you want to run.
    - `output_nb`: The path to your output notebook (i.e. the notebook which shows the results of the notebook execution).
    - `parameters`: A JSON dictionary of any parameters you are passing to your notebook.

    The example DAG looks like this:

    ```python
    from datetime import datetime, timedelta

    from airflow import DAG
    from airflow.providers.papermill.operators.papermill import PapermillOperator

    default_args = {
        'owner': 'airflow',
        'depends_on_past': False,
        'email_on_failure': False,
        'email_on_retry': False,
        'retries': 0,
        'retry_delay': timedelta(minutes=1)
    }

    with DAG(
        dag_id='example_papermill_operator',
        default_args=default_args,
        schedule_interval='0 0 * * *',
        start_date=datetime(2021, 1, 1),
        template_searchpath='/usr/local/airflow/include',
        catchup=False
    ) as dag_1:

        notebook_task = PapermillOperator(
            task_id="run_example_notebook",
            input_nb="include/example_notebook.ipynb",
            output_nb="include/out-{{ execution_date }}.ipynb",
            parameters={"execution_date": "{{ execution_date }}"},
        )
    ```

  Note that the built-in `execution_date` Airflow variable is used so that the DAG is idempotent. Parameters for your notebook can come from anywhere, but Astronomer highly recommends using Airflow macros and environment variables to avoid hard-coding values in your DAG file.

5. Run your DAG. The DAG executes the `example_notebook.ipynb` and generates an output notebook named with the execution date. Open the notebook to see the results of the run:

    ![Output notebook](/img/guides/notebook_output.png)

:::info

With versions of `papermill` you might encounter a bug when writing grammar tables as described in [this GitHub issue](https://github.com/psf/black/issues/1143). The error would say something like `Writing failed: [Errno 2] No such file or directory: '/home/astro/.cache/black/21.7b0/tmpzpsclowd'`. If this occurs, a workaround is to manually add that directory to your Airflow environment. If using an Astro project, you can add `RUN mkdir -p /home/astro/.cache/black/21.7b0/` to your project's `Dockerfile`.

:::

## Executing Databricks notebooks

[Databricks](https://databricks.com/) is a popular unified data and analytics platform built around [Apache Spark](https://spark.apache.org/) that provides users with fully managed Apache Spark clusters and interactive notebooks. Databricks notebooks are frequently used when working with large data sets that require Spark's large-scale data processing capabilities.

Databricks notebooks can be easily orchestrated with Airflow by using the [Databricks provider](https://registry.astronomer.io/providers/databricks). The `DatabricksRunNowOperator` and `DatabricksSubmitRunOperator` can be used to run an existing notebook in your Databricks workspace and manage your Databricks notebooks and cluster configuration. For more details on how to use these operators, see [Orchestrating Databricks Jobs with Airflow](https://www.astronomer.io/guides/airflow-databricks).

## Executing AWS SageMaker notebooks

[Amazon SageMaker](https://aws.amazon.com/sagemaker/) is a comprehensive AWS machine learning service. One of the features of SageMaker is elastic and shareable notebooks, which are essentially Jupyter notebooks set up to leverage AWS Elastic Computing. If you want a cloud-based solution that can handle large data processing, AWS SageMaker notebooks are a great alternative to Jupyter notebooks.

SageMaker can be easily integrated with Airflow by using the [AWS provider](https://registry.astronomer.io/providers/amazon/). There are multiple SageMaker operators and sensors available within the provider that cover a wide range of SageMaker features:

- [`SageMakerEndpointOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakerendpointoperator): Creates a SageMaker endpoint.
- [`SageMakerEndpointConfigOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakerendpointconfigoperator): Creates a SageMaker endpoint config.
- [`SageMakerModelOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakermodeloperator): Creates a SageMaker model.
- [`SageMakerProcessingOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakerprocessingoperator): Initiates a SageMaker processing job.
- [`SageMakerTrainingOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakertrainingoperator): Initiates a SageMaker training job.
- [`SageMakerTransformOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakertransformoperator): Initiates a SageMaker transform job.
- [`SageMakerTuningOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakertuningoperator): Initiates a SageMaker hyperparameter tuning job.
- [`SageMakerEndpointSensor`](https://registry.astronomer.io/providers/amazon/modules/sagemakerendpointsensor): Waits until the endpoint state is terminated.
- [`SageMakerTransformSensor`](https://registry.astronomer.io/providers/amazon/modules/sagemakertransformsensor): Waits until the transform state is terminated.
- [`SageMakerTuningSensor`](https://registry.astronomer.io/providers/amazon/modules/sagemakertuningsensor): Waits until the tuning state is terminated.
- [`SageMakerTrainingSensor`](https://registry.astronomer.io/providers/amazon/modules/sagemakertrainingsensor): Waits until the training state is terminated.

For examples of how to use these operators in common machine learning use cases, see [Using Airflow with SageMaker](https://www.astronomer.io/guides/airflow-sagemaker).
