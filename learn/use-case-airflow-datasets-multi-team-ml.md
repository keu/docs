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


