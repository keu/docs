---
title: "Connect to Kafka topics with Airflow"
sidebar_label: "Use Kafka with Airflow"
description: "How to produce to and consume from Kafka topics using the Airflow Kafka provider"
id: airflow-kafka
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Apache Kafka is an open source tool for handling event streaming. Combining Kafka and Airflow allows you to build powerful pipelines that integrate streaming data with batch processing.
In this tutorial, you'll learn how to install and use the Airflow Kafka provider to interact directly with Kafka topics.

## Time to complete

This tutorial takes approximately 1 hour to complete.

## Assumed knowledge

To get the most out of this tutorial, make sure you have an understanding of:

- The basics of Apache Kafka. See the official [Introduction to Kafka](https://kafka.apache.org/intro).
- Airflow fundamentals, such as writing DAGs and defining tasks. See [Get started with Apache Airflow](get-started-with-airflow.md).
- Airflow operators. See [Operators 101](what-is-an-operator.md).

## Prerequisites

To complete this tutorial, you need:

- A Kafka cluster with a topic. In this tutorial we will use a cluster hosted by [Confluent Cloud](https://www.confluent.io/) (a free trial account is available).
- The [Astro CLI](https://docs.astronomer.io/astro/cli/get-started).

:::info

Refer to the [documentation of Confluent](https://developer.confluent.io/quickstart/kafka-on-confluent-cloud/) for how to create a Kafka cluster and topic in the Confluent Cloud or to the [Kafka documentation](https://kafka.apache.org/quickstart) for how to do so locally.

:::

## Step 1: Configure your Astro project

1. Create a new Astro project:

    ```sh
    $ mkdir astro-kafka-tutorial && cd astro-kafka-tutorial
    $ astro dev init
    ```

2. Open the Dockerfile that was created and replace its contents with:

<Tabs
    defaultValue="general"
    groupId= "dockerfile"
    values={[
        {label: 'General', value: 'general'},
        {label: 'M1 Mac', value: 'M1'},
    ]}>

<TabItem value="general">

```dockerfile
FROM quay.io/astronomer/astro-runtime:<version>

RUN pip install confluent-kafka
RUN pip install airflow-provider-kafka
```

This Dockerfile installs both the `confluent-kafka` and the `airflow-provider-kafka` package.

</TabItem>

<TabItem value="M1">

```dockerfile
FROM quay.io/astronomer/astro-runtime:<version>-base

RUN apt-get update
RUN apt install librdkafka-dev -y
ENV C_INCLUDE_PATH=/opt/homebrew/Cellar/librdkafka/1.8.2/include
ENV LIBRARY_PATH=/opt/homebrew/Cellar/librdkafka/1.8.2/lib
RUN pip install confluent-kafka
RUN pip install airflow-provider-kafka
```

If you are using an M1 Mac you need to use a base image of the Astro Runtime allowing you to make changes as the root user. First the `librdkafka-dev` package is installed (needing root permissions), before the necessary environment variables are defined and the `confluent-kafka` and the `airflow-provider-kafka` package can be installed.

</TabItem>

</Tabs>

3. In the .env file define the following environment variables. Provide your own Kafka topic name and boostrap server. If you are connecting to a cloud based Kafka cluster you will likely also need to provide an API Key and API Secret:

    ```text
    KAFKA_TOPIC_NAME=my_kafka_topic_name
    BOOSTRAP_SERVER=my_boostrap_server
    KAFKA_API_KEY=my_api_key
    KAFKA_API_SECRET=my_API_secret
    ```

3. Run the following command to start your project in a local environment:

    ```sh
    astro dev start
    ```

## Step 2: Create a DAG with a producer task

The Airflow Kafka provider package contains an operator allowing you to produce events directly to an existing Kafka topic, the ProduceToTopicOperator.

1. Create a new Python file in your `dags` folder called `kafka_example_dag_1.py`.

2. Copy and paste the following code into the file:

    ```python
    # kafka_example_dag_1.py 

    import os
    import json
    from pendulum import datetime

    from airflow import DAG
    from airflow_provider_kafka.operators.produce_to_topic import ProduceToTopicOperator

    # get the topic name from .env
    my_topic = os.environ["KAFKA_TOPIC_NAME"]

    # get Kafka configuration information
    config_kwargs = {
        "bootstrap.servers": os.environ["BOOSTRAP_SERVER"],
        "security.protocol": "SASL_SSL", # optional for local clusters
        "sasl.mechanism": "PLAIN", # optional for local clusters
        "sasl.username": os.environ["KAFKA_API_KEY"], # optional for local clusters
        "sasl.password": os.environ["KAFKA_API_SECRET"] # optional for local clusters
    }

    with DAG(
        dag_id="kafka_example_dag_1",
        start_date=datetime(2022, 11, 1),
        schedule=None,
        catchup=False,
    ):

        # define the producer function
        def producer_function():
            for i in range(5):
                yield (json.dumps(i), json.dumps(i+1))

        # define the producer task
        producer_task = ProduceToTopicOperator(
            task_id=f"produce_to_{my_topic}",
            topic=my_topic,
            producer_function=producer_function, 
            kafka_config=config_kwargs
        )
    ```

    The code above retrieves the environment variables you defined in Step 1 and packages them into a configuration dictionary that can be used by the ProduceToTopicOperator. Any Python function which returns a generator can be passed to the `producer_function` parameter of the ProduceToTopicOperator. Make sure your producer function returns a generator that contains key-value paris where the value is in a format your Kafka topic accepts as input. In the example above the generator produces a JSON value. Additionally, if you have defined a schema for your Kafka topic, the generator needs to return compatible objects.

3. Run your DAG.

4. View the logs of your task instance. The 5 produced events will be listed.

    ![Producer logs](/img/guides/kafka-producer-logs.png)

5. View the produced events in your Kafka cluster. The example screenshot below shows them in the Confluent Cloud.

    ![Producer logs](/img/guides/confluent-produced-tasks.png)


## Step 3: Add a consumer task

With the ConsumeFromTopicOperator Airflow is able to consume messages from topics. 

1. Add the following import statement to the `kafka_example_dag_1`.

    ```python
    from airflow_provider_kafka.operators.consume_from_topic import ConsumeFromTopicOperator
    ```

2. In the `kafka_example_dag_1` add the following  task below the `producer_task`.