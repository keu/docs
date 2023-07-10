---
title: "Multi-Team ML Pipeline with Airflow Datasets"
description: "Using Airflow Datasets to create a Producer/Consumer ML pipeline in Airflow "
id: use-case-airflow-ml-datasets
sidebar_label: "Multi-Team ML Pipeline with Airflow Datasets"
sidebar_custom_props: { icon: 'img/integrations/databricks.png' }
---

Airflow plays a pivotal role in machine learning workflows as it provides a robust and scalable platform for orchestrating and managing the entire data pipeline. It facilitates the management of complex ML workflows, handling data dependencies, and ensuring fault tolerance, making it easier for data engineers to handle data inconsistencies, reprocess failed tasks, and maintain the integrity of ML pipelines. 

Many times, ML pipelines are run by two teams in a producer/consumer relationship, where one team produces the clean data for the ML team to consume and use for their models. With the introduction of Datasets and Data Driven scheduling in Airflow, now this relationship can be codified and automated, where upon the arrival of clean data from one team, an ML pipeline can be automatically triggered to run and ingest the clean data for use in model training. 

In this example we provide a model of that exact relationship with two DAG's, one producer DAG that extracts and loads housing data into a local S3FileSystem, and the creation of that dataset triggers a second consumer DAG. This consumer DAG then takes that data and uses it to train and run a predictive model. This set up has two main advantages. One is that two teams can work independently on their specific sections of the pipeline without needing to co-ordinate with each other outside of the initial set up. The second is that because the consumer DAG will only trigger once the data arrives, we avoid the situation where a producer DAG taking longer than expected to complete leads to the consumer DAG not having data to consume because it's scheduled to run at a certain time.


*Graph Screenshot*


## Before you start

Before you try this example, make sure you have:

- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- [Docker Desktop](https://www.docker.com/products/docker-desktop).

## Clone the project

Clone the example project from the [Astronomer GitHub](https://github.com/astronomer/learn-airflow-databricks-tutorial). 

## Run the project

To run the example project, first make sure Docker Desktop is running. Then, open your project directory and run:

```sh
astro dev start
```

This command builds your project and spins up 6 Docker containers on your machine to run it, the 4 standard airflow components as well as a local minio S3Filesystem and an ML flow instance. After the command finishes, open the Airflow UI at `https://localhost:8080/`, turn on the `astro_ml_producer` and `astro_ml_consumer` DAG's. Then trigger the `astro_ml_producer` DAG using the play button, and the `astro_ml_consumer` DAG will start once the producer DAG has completed. 

## Project contents

### Data source

This project uses a Scikit learn dataset that contains information on the California housing market. [Scikit Dataset](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html#sklearn.datasets.fetch_california_housing)
We use this data as it is custom made to work with the Scikit Machine learning package, which we will be using for our model training and predictions. 

### Project code 

This project consists of two DAG's, one [astro_ml_producer_DAG](https://github.com/astronomer/learn-airflow-databricks-tutorial/blob/main/dags/renewable_analysis_dag.py) which extracts the California Housing dataset from Scikit Learn and builds its model features using the Astro Python SDK [@aql.dataframe]([https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/transform.html](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/dataframe.html)https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/dataframe.html) before saving the data into the local S3Filesystem. 
The second DAG then takes this data from the local S3Filesystem, and uses it to train a Scikit linear model, before using the model to generate a prediction, which is then saved to the local S3Filesystem as well. 

The first astro_ml_producer DAG has three tasks, the first of which is extract_housing_data.

This task imports data from SciKit learn using the fetch_california_housing module, and returns it as a dataframe for the next tasks to use using the Astro SDK dataframe operator [@aql.dataframe]([https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/transform.html](https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/dataframe.html)https://astro-sdk-python.readthedocs.io/en/stable/astro/sql/operators/dataframe.html) .

```python
    @aql.dataframe(task_id='extract')
    def extract_housing_data() -> DataFrame:
        from sklearn.datasets import fetch_california_housing
        return fetch_california_housing(download_if_missing=True, as_frame=True).frame
```

The next task uses the Astro SDK task decorator @aql.dataframe, which means that it operates on a DataFrame and returns a DataFrame as well, eliminating the need to manually convert the raw California Housing Data into a dataframe. It takes two parameters: raw_df, which represents the raw input DataFrame, and model_dir, which is a string representing the directory where the model artifacts will be stored. 

The necessary libraries are imported within the function, including `StandardScaler` from scikit-learn, `pandas` for DataFrame operations, dump from joblib for serialization, and `S3FileSystem` from s3fs for interacting with an S3-compatible object storage system.

An instance of an `S3FileSystem` as FS is created, specifying the access key, secret key, and the endpoint URL of the S3-compatible local storage system. 

Then, this task performs feature engineering by normalizing the input features using a StandardScaler, calculates metrics based on the scaler mean values, saves the scaler object for later monitoring and evaluation, and returns the normalized feature DataFrame `X` with the target column included.

```python
    @aql.dataframe(task_id='featurize', outlets=Dataset(dataset_uri))
    def build_features(raw_df:DataFrame, model_dir:str) -> DataFrame:
        from sklearn.preprocessing import StandardScaler
        import pandas as pd
        from joblib import dump
        from s3fs import S3FileSystem

        fs = S3FileSystem(key='minioadmin', secret='minioadmin', client_kwargs={'endpoint_url': "http://host.docker.internal:9000/"})

        target = 'MedHouseVal'
        X = raw_df.drop(target, axis=1)
        y = raw_df[target]

        scaler = StandardScaler()
        X = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)
        metrics_df = pd.DataFrame(scaler.mean_, index=X.columns)[0].to_dict()

        #Save scalar for later monitoring and eval
        with fs.open(model_dir+'/scalar.joblib', 'wb') as f:
            dump([metrics_df, scaler], f)

        X[target]=y

        return X
```

Finally, the third task in this DAG uses the Astro SDK 




