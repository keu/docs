---
title: "Use Kafka with Airflow"
sidebar_label: "Kafka/Confluent"
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

This Dockerfile installs both the `confluent-kafka` and the [`airflow-provider-kafka` package](https://github.com/astronomer/airflow-provider-kafka).

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

If you are using an M1 Mac you need to use a base image of the Astro Runtime allowing you to make changes as the root user. First the `librdkafka-dev` package is installed (needing root permissions), before the necessary environment variables are defined and the `confluent-kafka` and the [`airflow-provider-kafka` package](https://github.com/astronomer/airflow-provider-kafka) can be installed.

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

The [Airflow Kafka provider package](https://github.com/astronomer/airflow-provider-kafka) contains an operator allowing you to produce events directly to an existing Kafka topic, the ProduceToTopicOperator.

1. Create a new Python file in your `dags` folder called `kafka_example_dag_1.py`.

2. Copy and paste the following code into the file:

    ```python
    # kafka_example_dag_1.py 

    import os
    import json
    import logging
    import functools
    from pendulum import datetime

    from airflow import DAG
    from airflow_provider_kafka.operators.produce_to_topic import ProduceToTopicOperator

    # get the topic name from .env
    my_topic = os.environ["KAFKA_TOPIC_NAME"]

    # get Kafka configuration information
    connection_config = {
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
            kafka_config=connection_config
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

2. In the `kafka_example_dag_1` add the following code below the `producer_task`.

    ```python
    consumer_logger = logging.getLogger("airflow")
    def consumer_function(message, prefix=None):
        try:
            key = json.loads(message.key())
            value = json.loads(message.value())
            consumer_logger.info(f"{prefix} {message.topic()} @ {message.offset()}; {key} : {value}")
            return
        except:
            return

    consumer_task = ConsumeFromTopicOperator(
        task_id=f"consume_from_{my_topic}",
        topics=[my_topic],
        apply_function=functools.partial(consumer_function, prefix="consumed:::"),
        consumer_config={
            **connection_config
            "group.id": "consume",
            "enable.auto.commit": False,
            "auto.offset.reset": "beginning",
        },
        max_messages=30,
        max_batch_size=10,
    )

    producer_task >> consumer_task

    ```

    In this code snippet first a function is defined that reads from the topic defined as `my_topic` and prints the messages consumed to the Airflow task log. The ConsumeFromTopicOperator uses the same `connection_config` as the `producer_task` with added configurations specific to Kafka Consumers. You can read more about consumer configuration in Kafka in the official [Kafka documentation](https://kafka.apache.org/documentation/#consumerconfigs).

3. Run your DAG.

4. View the consumed messages in your Airflow task logs.

    ![Consumer log](/img/guides/kafka-consumer-logs.png)

:::info

A very common pattern is to directly connect an Amazon S3 bucket to your Kafka topic as a consumer. The ConsumeFromTopicOperator is for example helpful if you want to use Airflow features to schedule the consuming task. Instead of writing the messages retrieved to the Airflow logs you can write them to S3 using the [S3CreateObjectOperator](https://registry.astronomer.io/providers/amazon/modules/s3createobjectoperator).

:::

## Step 4: Listen for a message in the stream

You might want to schedule a downstream task based on a specific message appearing in your Kafka topic. The AwaitKafkaMessageOperator is a deferrable operator that will listen to your Kafka topic for a message that fulfills a specific criteria.

:::info

A deferrable operator is a sensor that will go into a deferred state in between checking for its condition in the target system. While in the deferred state the operator does not take up a worker slot, offering a significant efficiency improvement. Using a deferrable operator necessitates the presence of the Triggerer component. Learn more about [Deferrable operators]((https://docs.astronomer.io/learn/deferrable-operators)).

:::

1. In `kafka_example_dag_1`, add the following import statement:

    ```python
    from airflow_provider_kafka.operators.await_message import AwaitKafkaMessageOperator
    ```

2. Copy and past the following code at the end of your DAG:

    ```python
    def await_function(message):
        if isinstance(json.loads(message.value()), int):
            if json.loads(message.value()) % 5 == 0:
                return f" Got the following message: {json.loads(message.value())}"

    await_message = AwaitKafkaMessageOperator(
        task_id=f"awaiting_message_in_{my_topic}",
        topics=[my_topic],
        # the apply function needs to be passed with its location for the triggerer
        apply_function="provider_example_code.await_function", 
        kafka_config={
            **connection_config
            "group.id": "awaiting_message",
            "enable.auto.commit": False,
            "auto.offset.reset": "beginning",
        },
        xcom_push_key="retrieved_message",
    )

    consumer_task >> await_message
    ```

    In this code snippet an `await_function` is defined which will parse each message in the Kafka topic and return the message if the value is an integer divisible by 5. The AwaitKafkaMessageOperator using runs this function over messages polled from the Kafka topic. If no matching message is found it goes into a deferred state until it tries again.  

3. Run the DAG. Notice how the task instance of the `await_message` task goes into a deferred state (purple square).

    ![Kafka deferred state](/img/guides/kafka-deferred-state.png)

4. (Optional) Add a downstream task to the `await_message` task, which only runs once `await_message` has completed successfully.


## Conclusion

The Airflow Kafka provider offers 3 easy to use operators to interact with topics and messages in Kafka. You know now how to use these operators to connect Kafka and Airflow. 

