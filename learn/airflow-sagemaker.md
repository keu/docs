---
title: "Train an ML model with SageMaker and Airflow"
sidebar_label: "Amazon SageMaker"
description: "Use Airflow to orchestrate training and testing a SageMaker model."
id: airflow-sagemaker
---

[Amazon SageMaker](https://aws.amazon.com/sagemaker/) is a comprehensive AWS machine learning (ML) service that is frequently used by data scientists to develop and deploy ML models at scale. With Airflow, you can orchestrate every step of your SageMaker pipeline, integrate with services that clean your data, and store and publish your results using only Python code.

This tutorial demonstrates how to orchestrate a full ML pipeline including creating, training, and testing a new SageMaker model. This use case is relevant if you want to automate the model training, testing, and deployment components of your ML pipeline.

## Time to complete

This tutorial takes approximately 1 hour to complete.

## Assumed knowledge

To get the most out of this tutorial, make sure you have an understanding of:

- The basics of [Amazon S3](https://aws.amazon.com/s3/getting-started/) and [Amazon SageMaker](https://aws.amazon.com/sagemaker/getting-started/).
- Airflow fundamentals, such as writing DAGs and defining tasks. See [Get started with Apache Airflow](get-started-with-airflow.md).
- Airflow operators. See [Operators 101](what-is-an-operator.md).
- Airflow connections. See [Managing your Connections in Apache Airflow](connections.md).

## Prerequisites

To complete this tutorial, you need:

- An AWS account with:
    - An S3 [storage bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html). If you don't already have an account, Amazon offers 5GB of free storage in S3 for 12 months. This should be more than enough for this tutorial.
    - Access to [AWS SageMaker](https://aws.amazon.com/sagemaker/). If you don't already use SageMaker, Amazon offers a free tier for the first month.
- The [Astro CLI](https://docs.astronomer.io/astro/cli/get-started).


## Step 1: Set up SageMaker


## Step 2: Configure your Astro project

Create project and add env vars (s3_bucket and role)

## Step 3: Add a connection to SageMaker

## Step 4: Create your DAG

## Step 5: Update your model info (optional)

This example uses KNN to make predictions on Iris dataset. If you want to change, update these ...

## Step 6: Run your DAG to train the model




## How it works

All code used in this tutorial is located in the [Astronomer Registry](https://registry.astronomer.io/dags/sagemaker-run-model).


The following use cases demonstrate how to use some of these operators, but they generally all have similar requirements, such as an input configuration for the job being executed. Documentation on what should be included in each configuration can be found in the Actions section of the [API documentation](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_Operations.html).

:::info

In addition to the modules shown in this tutorial, the [AWS provider](https://registry.astronomer.io/providers/amazon) contains multiple other SageMaker operators and sensors that are built on the [SageMaker API](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_Operations_Amazon_SageMaker_Service.html) and cover a wide range of SageMaker features.

:::


## Use case 2: Orchestrate a full ML pipeline

For this example, you'll use the [Iris dataset](https://archive.ics.uci.edu/ml/datasets/iris), and train a built-in SageMaker K-Nearest Neighbors (KNN) model. The general steps in the DAG are:

1. Using a `PythonOperator` to pull the data from the API, complete some pre-processing so the data is compliant with KNN requirements, split into train and test sets, and save them to S3 using the `S3Hook`.
2. Train the KNN algorithm on the data using the `SageMakerTrainingOperator`. The configuration for this operator requires: 

    - Information about the algorithm being used
    - Any required hyper parameters
    - The input data configuration
    - The output data configuration
    - Resource specifications for the machine running the training job 
    - The Role ARN for execution

    For more information about submitting a training job, check out the [API documentation](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateTrainingJob.html).

3. Create a SageMaker model based on the training results using the `SageMakerModelOperator`. This step creates a model artifact in SageMaker that can be called on demand to provide inferences. The configuration for this operator requires:

    - A name for the model
    - The Role ARN for execution
    - The image containing the algorithm (in this case the pre-built SageMaker image for KNN)
    - The S3 path to the model training artifact 
    
    For more information on creating a model, check out the API documentation [here](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateModel.html).
4. Evaluate the model on the test data created in Step 1 using the `SageMakerTransformOperator`. This step runs a batch transform to get inferences on the test data from the model created in Step 3. The configuration for this operator requires:

    - Information about the input data source
    - The output results path
    - Resource specifications for the machine running the training job
    - The name of the model 
    
    For more information on submitting a batch transform job, check out the [API documentation](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateTransformJob.html).

The DAG code looks like this:


The graph view of the DAG should look similar to this:

![SageMaker Pipeline](/img/guides/sagemaker_pipeline.png)

When using this DAG, there are a couple of other things to be aware of for your Airflow environment:

- Some SageMaker operators may require the `AWS_DEFAULT_REGION` to be set in your Airflow environment in addition to a region being specified in the AWS connection. If you're using Astro, you can set this variable in the Cloud UI or in your Dockerfile (`ENV AWS_DEFAULT_REGION=us-east-2`).
-Some SageMaker operators require XCom pickling to be turned on in order to work because they return objects that are not JSON serializable. To enable XCom pickling, set `AIRFLOW__CORE__ENABLE_XCOM_PICKLING=True`

You've learned how you can use Airflow with SageMaker to automate an end-to-end ML pipeline. A natural next step would be to deploy this model to a SageMaker endpoint using the `SageMakerEndpointConfigOperator` and `SageMakerEndpointOperator`, which provisions resources to host the model. In general, the SageMaker modules in the AWS provider allow for many possibilities when using Airflow to orchestrate ML pipelines.
