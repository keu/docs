---
title: "Execute Talend Jobs with Airflow"
description: "Trigger remote jobs in Talend from your Apache Airflow DAGs."
id: airflow-talend-integration
sidebar_label: "Talend"
---

[Talend](https://www.talend.com/) is a popular tool for data integration and data management. Airflow provides a centralized platform for data orchestration, job monitoring, and issue resolution. Using the tools together eliminates the need to migrate existing jobs to Python code and you can combine Talend jobs and other tasks in the same DAG.

In this tutorial, you'll learn how Talend and Airflow work well together.

## Implementation

To execute Talend jobs with Airflow, you can use one of the following methods:

- Use the Talend Cloud API and execute the job using the [SimpleHttpOperator](https://registry.astronomer.io/providers/http/modules/simplehttpoperator).
- Containerize your Talend jobs and execute them using the [KubernetesPodOperator](https://registry.astronomer.io/providers/kubernetes/modules/kubernetespodoperator).

The method that is most suitable for your organization is determined by your existing Talend setup and workflow requirements. This table lists the advantages and disadvantages for each methodology. 

|Method      |**Docker + KubernetesPodOperator**                                                                                                                                                                    |**API + SimpleHttpOperator**                                                                                                            |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
|Advantages        | - Allows for containerization and improves efficiency, flexibility, and scaling.  Allows for downstream dependencies <br/> - Job logs are available in the Airflow UI| - Easily implemented without the need  for specialized knowledge or tools.                                              |
|Disadvantages        | - Talend Studio is required to containerize jobs  More complicated to setup                                                                                                   | - Not well suited for triggering jobs with downstream dependencies <br/> - Logs from Talend job are not automatically sent to Airflow. |
|Requirements| - Talend Studio license Docker registry <br/> - Kubernetes                                                                                                 | - Talend cloud license that allows API access                                                                                  |

<br/>

## Make requests to the Talend Cloud API in Airflow

You can run Talend jobs by calling the Talend Cloud API with the Airflow `SimpleHttpOperator`. This method is ideal if you have Talend Cloud jobs that don't have downstream dependencies.

If you are unfamiliar with the Talend Cloud API, see the following documentation:

- [Talend Public API Docs](https://community.talend.com/s/article/Using-the-Talend-Cloud-Management-Console-Public-API-O2Ndn)
- [Talend UI Docs](https://api.us-west.cloud.talend.com/tmc/swagger/swagger-ui.html#!/)

:::info

The code in this example can be found in the [Astronomer Registry](https://registry.astronomer.io/dags/talend-api).

:::

### Get Started with the Talend Cloud API

Make sure the job you want to execute is present in the Talend Management Console as shown in the following image. For this example, you'll execute a sample `SayHello` job.

![Say Hello Job](/img/guides/talend_api_1.png)

1. Copy the Task ID for the job. This Task ID is passed to the API to trigger the job.

![Task ID](/img/guides/talend_api_2.png)

2. Select a user and then go to **Profile Preferences** > **Personal Access Tokens** and then add a personal access token. A personal access token is required for API authentication .

![Token](/img/guides/talend_api_3.png)


### Use the Talend API with Airflow

You can reach the Talend API from Airflow using the `SimpleHttpOperator`. In this example you'll use Airflow to execute a Talend job. There are many other actions you can perform with the Talend API. They can be implemented with a methodology similar to what is presented here. Also, the `SimpleHttpOperator` is one of the many ways you can make Talend API calls in Airflow.

:::info

In Airflow 2.0 and later, provider packages are separate from the core of Airflow. If you are running Airflow 2.0 or later on an Astro Runtime image, the [HTTP Provider](https://registry.astronomer.io/providers/http) package is  included. If you're not using Astronomer, you might need to install the package separately to use the hooks, operators, and connections described here. To learn more, see the [Apache Airflow documentation](https://airflow.apache.org/docs/apache-airflow-providers/index.html).

:::

Set up an Airflow connection to connect to the API. The connection should be an HTTP type, and should appear similar to following image:

![Talend Connection](guides/img/airflow_talend_5.png)

The host name is the Talend Cloud API URL. The **Extras** field should contain your authorization string, with `Bearer` followed by your personal access token.

Create and run the example DAG.

```python
from airflow import DAG
from airflow.operators.http_operator import SimpleHttpOperator
from datetime import datetime, timedelta
import json

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2019, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG('talend_api_jobs',
          schedule_interval='@once',
          default_args=default_args
          ) as dag:

    talend1 = SimpleHttpOperator(
        task_id='talend_api',
        method='POST',
        http_conn_id='talend_api',
        endpoint='/tmc/v2.2/executions',
        data=json.dumps({"executable": "5fb2f5126a1cd451b07bee7a"}),
    )
```

This DAG has a single `SimpleHttpOperator` that sends a POST request to the Talend API to trigger a job. For `http_conn_id`, enter the connection ID you created previously. The `endpoint` is the Talend Cloud API executions endpoint for your region. For `data`, enter the Task ID described in the previous section formatted in JSON.

After you run this DAG in Airflow, you should see a successful log entry that looks similar to this image:

![Success log](/img/guides/airflow_talend_6.png)

The Talend Management Console appears similar to the following image when the job is running:

![Talend Running Job](/img/guides/airflow_talend_7.png)

The API call triggers the job and the Airflow task is marked successful as soon as a response is received from the AP. This result is not associated with job completion. If you have downstream tasks that need the Talend job to be completed, you need to use another method such as `KubernetesPodOperator`, or design another workflow that manages this dependency.

## Execute Talend Jobs with KubernetesPodOperator

You can run Talend jobs with Airflow by containerizing them and running the containers with the `KubernetesPodOperator`. This is a good option if you are using Talend studio, or if you have tasks that are dependent on the completion of your Talend jobs.

:::info

The code shown in this example is available in the [Astronomer Registry](https://registry.astronomer.io/dags/talend-containers).

:::

### Containerize Talend jobs

Existing Talend jobs and can be can be containerized with docker and pushed to a repository with Talend Studio.

1. Go to Talend studio, right-click the job you want to containerize, and then select the publish feature.

![Talend UI](/img/guides/talend_ui_1.png)

A **Push Docker Image to Registry** dialog appears. 

2. In the **Export Type** list, select **Docker Image**.

![Talend UI 2](/img/guides/talend_ui_2.png)

3. Click **Next** and complete the following fields:

- **Image name**: The name of your repository (in this example, `talendjob`)
- **Image tag**: The image tag (in this example, `0.1.0`)
- **Registry** The location of your registry
- **Username**: Your DockerHub username
- **Password**: Your DockerHub Password

If you are using a remote Docker host, you need to find the IP address Docker is running on and use TCP to connect. For example put `tcp://<docker-host-ip>` in the input box to the side of 'Remote'.

![Talend UI 3](/img/guides/talend_ui_3.png)

Then, configure the following additional parameters:

- **Image name**: The name of your repository (in this example, `talendjob`)
- **Image tag**: The image tag (in this example, `0.1.0`)
- **Registry** The location of your registry
- **Username**: Your DockerHub username
- **Password**: Your DockerHub Password

4. Click **Finish**.  The job is converted to Docker image and pushed to the specified registry. In this example the job was pushed to `https://hub.docker.com/repository/docker/user/talendjob`.

5. Run the following command to run the job locally:

`docker run user/talendjob:0.1.0`

If you ran the command on the terminal, you should see the output `hello`. You can now pull and run this image from Airflow.

### Orchestrate containerized Talend jobs with Airflow

After your Talend jobs are containerized and pushed to a registry, you can create a DAG to orchestrate them.

This example DAG executes two Talend jobs, one of which is dependent on the other, and then sends an email notification if the jobs are successful:

```python
from airflow import DAG
from datetime import datetime, timedelta
from airflow.contrib.operators.kubernetes_pod_operator import KubernetesPodOperator
from airflow.operators.email_operator import EmailOperator
from airflow import configuration as conf

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2019, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

namespace = conf.get('kubernetes', 'NAMESPACE')

# This will detect the default namespace locally and read the
# environment namespace when deployed to Astronomer.
if namespace =='default':
    config_file = '/usr/local/airflow/include/.kube/config'
    in_cluster=False
else:
    in_cluster=True
    config_file=None

# Define recipient emails for successful completion notification
email_to = ["noreply@astronomer.io"]

with DAG('talend_jobs',
          schedule_interval='@once',
          default_args=default_args
          ) as dag:

    talend1 = KubernetesPodOperator(
                namespace=namespace,
                image="your-repo/talendjob:hello",
                name="talend-test-hello",
                task_id="hello-world",
                in_cluster=in_cluster, # if set to true, will look in the cluster, if false, looks for file
                cluster_context='docker-desktop', # is ignored when in_cluster is set to True
                config_file=config_file,
                is_delete_operator_pod=True,
                get_logs=True
            )

    talend2 = KubernetesPodOperator(
                namespace=namespace,
                image="your-repo/talendjob:random",
                name="talend-test-random",
                task_id="random",
                in_cluster=in_cluster,
                cluster_context='docker-desktop',
                config_file=config_file,
                is_delete_operator_pod=True,
                get_logs=True
            )

    send_email = EmailOperator(
                    task_id='send_email',
                    to=email_to,
                    subject='Talend Jobs Completed Successfully',
                    html_content='<p>Your containerized Talend jobs have completed successfully. <p>'
                )


    talend1 >> talend2 >> send_email
```

The first half of the code imports packages and sets the DAG up to work with Kubernetes. Each Talend job is its own task using the `KubernetesPodOperator`. In this case, the two tasks correlate to two Talend jobs, `talend1` and `talend2`.

In each task, the `image` is the name of the image of the containerized job saved to a registry as described previously. In this example, the image is pulled from DockerHub. By default, this is where the `KubernetesPodOperator` looks for the provided image name. If you want to pull an image from a private registry such as ECR or GCR see the [Apache Airflow documentation](https://airflow.readthedocs.io/en/latest/howto/operator/kubernetes.html#how-to-use-private-images-container-registry).

This is a straightforward example and you don't need to provide any additional arguments to run the image. If you need to add additional arguments, you can specify them in the operator's parameters.

The `send_email` task notifies you that the tasks completed successfully. The final lines of code define task dependencies.

If you deploy this code to Astronomer and go to the Airflow UI, you should see a DAG that looks similar to the following image:

![Airflow Talend DAG](/img/guides/airflow_talend_1.png)

After your Talend jobs are containerized, they can be orchestrated and given dependencies using Airflow.

## Troubleshooting common issues

### Error when building images with Docker on Mac

If you receive the error message `Cannot run program "docker-credential-desktop"` when building an image from a job using a local docker host on Mac, it might be due to an outdated Java plugin on Talend Studio V7.3.1  

You will need to edit your `.docker/config.json`. The file is located at `~/.docker/config.json`. Delete the line `"credsStore" : "desktop"` from you config.json :

```json
{
  "credsStore" : "desktop"
}
```

This will stop the error from happening when building images from Talend jobs with your local docker host.

### SMTP configuration

If you are running the specific example DAG provided in the `KubernetesPodOperator` section, SMTP needs to be configured on your Airflow instance in order for the `send_email` task to work. This requires an SMTP server that  allows a credentialed application to send emails. If you have that, you can connect it to Airflow using the following environment variables:

```yaml
AIRFLOW__SMTP__SMTP_HOST=smtp.gmail.com
AIRFLOW__SMTP__SMTP_PORT=587
AIRFLOW__SMTP__SMTP_USER=your-mail-id@gmail.com
AIRFLOW__SMTP__SMTP_PASSWORD=yourpassword
AIRFLOW__SMTP__SMTP_MAIL_FROM=your-mail-id@gmail.com
```
