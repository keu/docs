---
title: "Multi-Team ML Pipeline with Airflow Datasets"
description: "Using Airflow Datasets to create a Producer/Consumer ML pipeline in Airflow "
id: use-case-airflow-ml-datasets
sidebar_label: "Multi-Team ML Pipeline with Airflow Datasets"
sidebar_custom_props: { icon: 'img/integrations/databricks.png' }
---

Airflow plays a pivotal role in machine learning workflows as it provides a robust and scalable platform for orchestrating and managing the entire data pipeline. It facilitates the management of complex ML workflows, handling data dependencies, and ensuring fault tolerance, making it easier for data engineers to handle data inconsistencies, reprocess failed tasks, and maintain the integrity of ML pipelines. 

Many times, ML pipelines are run by two teams in a producer/consumer relationship, where one team produces the clean data for the ML team to consume and use for their models. With the introduction of Datasets and Data Driven scheduling in Airflow, now this relationship can be codified and automated, where upon the arrival of clean data from one team, an ML pipeline can be automatically triggered to run and ingest the clean data for use in model training. 

In this example we provide a model of that exact relationship with two DAG's, one producer DAG that extracts and loads housing data into a local S3FileSystem, and one consumer DAG that takes that data and uses it to train and run a predictive model. 
