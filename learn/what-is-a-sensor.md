---
title: "Airflow sensors"
sidebar_label: "Sensors"
description: "An introduction to Airflow sensors."
id: what-is-a-sensor
---

[Apache Airflow sensors](https://airflow.apache.org/docs/apache-airflow/stable/concepts/sensors.html) are a special kind of operator that are designed to wait for something to happen. When sensors run, they check to see if a certain condition is met before they are marked successful and let their downstream tasks execute. When used properly, they can be a great tool for making your DAGs more event driven.

In this guide, you'll learn how sensors are used in Airflow, best practices for implementing sensors in production, and learn about smart sensors and deferrable operators. For more information about implementing sensors, see the video [Create Powerful Data Pipelines by Mastering Sensors](https://www.astronomer.io/events/webinars/creating-data-pipelines-using-master-sensors/).

## Assumed knowledge

To get the most out of this guide, you should have an understanding of:

- Basic Airflow concepts. See [Introduction to Apache Airflow](intro-to-airflow.md).
- Basic Python. See the [Python Documentation](https://docs.python.org/3/tutorial/index.html).

## Sensor basics

Sensors are a type of operator that checks if a condition is met at a specific interval. If the condition is met, the task is marked successful and the DAG can move to downstream tasks. If the condition isn't met, the sensor waits for another interval before checking again. 

All sensors inherit from the [`BaseSensorOperator`](https://github.com/apache/airflow/blob/main/airflow/sensors/base.py) and have the following parameters:

- `mode`: How the sensor operates. There are two types of modes:
    - `poke`: This is the default mode. When using `poke`, the sensor occupies a worker slot for the entire execution time and sleeps between pokes. This mode is best if you expect a short runtime for the sensor.
    - `reschedule`: When using this mode, if the criteria is not met then the sensor releases its worker slot and reschedules the next check for a later time. This mode is best if you expect a long runtime for the sensor, because it is less resource intensive and frees up workers for other tasks.
- `poke_interval`: When using `poke` mode, this is the time in seconds that the sensor waits before checking the condition again. The default is 30 seconds.
- `exponential_backoff`: When set to `True`, this setting creates exponentially longer wait times between pokes in `poke` mode.
- `timeout`: The maximum amount of time in seconds that the sensor checks the condition. If the condition is not met within the specified period, the task fails.
- `soft_fail`: If set to `True`, the task is marked as skipped if the condition is not met by the `timeout`.

Different types of sensors have different implementation details.

### Commonly used sensors

Many Airflow provider packages contain sensors that wait for various criteria in different source systems. The following are some of the most commonly used sensors:

- [`S3KeySensor`](https://registry.astronomer.io/providers/amazon/modules/s3keysensor): Waits for a key (file) to appear in an Amazon S3 bucket. This sensor is useful if you want your DAG to process files from Amazon S3 as they arrive.
- [`DateTimeSensor`](https://registry.astronomer.io/providers/apache-airflow/modules/datetimesensor): Waits for a specified date and time. This sensor is useful if you want different tasks within the same DAG to run at different times.
- [`ExternalTaskSensor`](https://registry.astronomer.io/providers/apache-airflow/modules/externaltasksensor): Waits for an Airflow task to be completed. This sensor is useful if you want to implement [cross-DAG dependencies](cross-dag-dependencies.md) in the same Airflow environment.
- [`HttpSensor`](https://registry.astronomer.io/providers/http/modules/httpsensor): Waits for an API to be available. This sensor is useful if you want to ensure your API requests are successful.
- [`SqlSensor`](https://registry.astronomer.io/providers/apache-airflow/modules/sqlsensor): Waits for data to be present in a SQL table. This sensor is useful if you want your DAG to process data as it arrives in your database.
- [`PythonSensor`](https://registry.astronomer.io/providers/apache-airflow/modules/pythonsensor): Waits for a Python call to return `True`. This sensor is useful if you want to implement complex conditions in your DAG.

To review the available Airflow sensors, go to the [Astronomer Registry](https://registry.astronomer.io/modules?types=sensors).

### Example implementation

The following example DAG shows how you might use the `SqlSensor` sensor: 

```python
from airflow.decorators import task, dag
from airflow.sensors.sql import SqlSensor

from typing import Dict
from datetime import datetime

def _success_criteria(record):
        return record

def _failure_criteria(record):
        return True if not record else False

@dag(description='DAG in charge of processing partner data',
     start_date=datetime(2021, 1, 1), schedule_interval='@daily', catchup=False)
def partner():
    
    waiting_for_partner = SqlSensor(
        task_id='waiting_for_partner',
        conn_id='postgres',
        sql='sql/CHECK_PARTNER.sql',
        parameters={
            'name': 'partner_a'
        },
        success=_success_criteria,
        failure=_failure_criteria,
        fail_on_empty=False,
        poke_interval=20,
        mode='reschedule',
        timeout=60 * 5
    )
    
    @task
    def validation() -> Dict[str, str]:
        return {'partner_name': 'partner_a', 'partner_validation': True}
    
    @task
    def storing():
        print('storing')
    
    waiting_for_partner >> validation() >> storing()
    
dag = partner()
```

This DAG waits for data to be available in a Postgres database before running validation and storing tasks. The `SqlSensor` runs a SQL query and is marked successful when that query returns data. Specifically, when the result is not in the set (0, '0', '', None). The `SqlSensor` task in the example DAG (`waiting_for_partner`) runs the `CHECK_PARTNER.sql` script every 20 seconds (the `poke_interval`) until the data is returned. The `mode` is set to `reschedule`, meaning between each 20 second interval the task will not take a worker slot. The `timeout` is set to 5 minutes, and the task fails if the data doesn't arrive within that time. When the `SqlSensor` criteria is met, the DAG moves to the downstream tasks. You can find the full code for this example in the [webinar-sensors repo](https://github.com/marclamberti/webinar-sensors).

## Sensor best practices

When using sensors, keep the following in mind to avoid potential performance issues:

- Always define a meaningful `timeout` parameter for your sensor. The default for this parameter is seven days, which is a long time for your sensor to be running. When you implement a sensor, consider your use case and how long you expect the sensor to wait and then define the sensor's timeout accurately.
- Whenever possible and especially for long-running sensors, use the `reschedule` mode so your sensor is not constantly occupying a worker slot. This helps avoid deadlocks in Airflow where sensors take all of the available worker slots.
- If your `poke_interval` is very short (less than about 5 minutes), use the `poke` mode. Using `reschedule` mode in this case can overload your scheduler.
- Define a meaningful `poke_interval` based on your use case. There is no need for a task to check a condition every 30 seconds (the default) if you know the total amount of wait time will be 30 minutes.

## Smart sensors

Smart sensors were deprecated in Airflow 2.2.4. They are complex to implement and not widely used. Astronomer recommends using deferrable operators instead.

[Smart sensors](https://airflow.apache.org/docs/apache-airflow/stable/concepts/smart-sensors.html) are a relatively new feature released with Airflow 2.0, where sensors are executed in batches using a centralized process. This eliminates a major drawback of classic sensors, which use one process for each sensor and therefore can consume considerable resources at scale for longer running tasks. With smart sensors, sensors in your DAGs are registered to the metadata database, and then a separate DAG fetches those sensors and manages processing them. 

![Smart Sensors](/img/guides/smart_sensors_architecture.png)

To use smart sensors with an applicable Airflow version:

1. Update your Airflow config with the following environment variables. If you're using Astronomer, you can add them to your Dockerfile with the code below.

    ```bash
    ENV AIRFLOW__SMART_SENSOR__USE_SMART_SENSOR=True
    ENV AIRFLOW__SMART_SENSOR__SHARD_CODE_UPPER_LIMIT=10000
    ENV AIRFLOW__SMART_SENSOR__SHARDS=1
    ENV AIRFLOW__SMART_SENSOR__SENSORS_ENABLED=SmartExternalTaskSensor
    ```

    The `SHARD_CODE_UPPER_LIMIT` parameter helps determine how your sensors are distributed amongst your smart sensor jobs. The `SHARDS` parameters determine how many smart sensor jobs will run concurrently in your Airflow environment. This should be scaled up as you have more sensors. Finally, the `SENSORS_ENABLED` parameter should specify the Python class you will create to tell Airflow that certain sensors should be treated as smart sensors (more on this in Step 2).

2. Create your smart sensor class. Create a file in your `plugins/` directory and define a class for each type of sensor you want to make smart. In this example, smart sensors are implemented with the `FileSensor`, and the class looks like this:

    ```python
    from airflow.sensors.filesystem import FileSensor
    from airflow.utils.decorators import apply_defaults
    from typing import Any

    class SmartFileSensor(FileSensor):
        poke_context_fields = ('filepath', 'fs_conn_id') # <- Required

        @apply_defaults
        def __init__(self,  **kwargs: Any):
            super().__init__(**kwargs)

        def is_smart_sensor_compatible(self): # <- Required
            result = (
                not self.soft_fail
                and super().is_smart_sensor_compatible()
            )
            return result
    ```

    The class should inherit from the sensor class you are updating. For example, `FileSensor`. It must include `poke_context_fields`, which specifies the arguments needed by your sensor, and the `is_smart_sensor_compatible` method, which tells Airflow this type of sensor is a smart sensor. When using smart sensors you cannot use soft fail or any callbacks.

    The implementation of this class varies depending on which sensor you are using. For an example with the more complicated `ExternalTaskSensor`, see the [webinar-sensors repo](https://github.com/marclamberti/webinar-sensors).

3. Deploy your code to Airflow and turn on the `smart_sensor_group_shard_0` DAG to run your smart sensors. You might have more than one smart sensor DAG if you set your `SHARDS` parameter to greater than one. 

## Deferrable operators

[Deferrable operators](https://airflow.apache.org/docs/apache-airflow/stable/concepts/deferring.html) (sometimes referred to as asynchronous operators) were released with Airflow 2.2 and are designed to eliminate the problem of any operator or sensor taking up a full worker slot for the entire time they are running. In other words, they solve the same problems as smart sensors, but for a much wider range of use cases. 

For DAG authors, using built-in deferrable operators is no different from using regular operators. You need to ensure you have a `triggerer` process running in addition to your Scheduler. Currently, the `DateTimeSensorAsync` and `TimeDeltaSensorAsync` sensors are built-in to OSS Airflow. Additional deferrable operators will be released in future Airflow versions. For more on writing your own deferrable operators, see [Smart Sensors](https://airflow.apache.org/docs/apache-airflow/stable/concepts/deferring.html#smart-sensors).
