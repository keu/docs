---
sidebar_label: 'KubernetesPodOperator'
title: "Run the KubernetesPodOperator on Astronomer Cloud"
id: kubernetespodoperator
---

## Overview

This guide provides steps for configuring and running the KubernetesPodOperator on DAGs deployed to Astronomer Cloud.

The [KubernetesPodOperator](https://airflow.apache.org/docs/apache-airflow-providers-cncf-kubernetes/stable/operators.html) is one of Apache Airflow's most powerful operators. Similar to the Kubernetes Executor, this operator talks to the Kubernetes API to dynamically launch a pod in Kubernetes for each task that needs to run and terminates each pod once the task is completed. This results in an isolated, containerized execution environment for each task that is separate from tasks otherwise being executed by Celery workers. The KubernetesPodOperator enables you to:

- Execute a custom Docker image per task with Python packages and dependencies that would otherwise conflict with the rest of your Deployment's dependencies. This includes Docker images in a private registry or repository.
- Specify CPU and Memory as task-level limits or minimums to optimize costs and performance.
- Write task logic in a language other than Python. This gives you flexibility and can enable new use cases across teams.
- Scale task growth horizontally in a way that is cost-effective, dynamic, and minimally dependent on Worker resources.
- Access images hosted in private Docker repositories.
- Set Kubernetes-native configurations in a YAML file, including volumes, secrets, and affinities.

On Astronomer Cloud, the Kubernetes infrastructure required to run the KubernetesPodOperator is built into every Cluster in the Data Plane and is managed by Astronomer.

## Prerequisites

To use the KubernetesPodOperator, you need:

- An [Astronomer project](create-project.md).
- An Astronomer [Deployment](configure-deployment.md).

## Set Up the KubernetesPodOperator

To use the KubernetesPodOperator in a DAG, add the following import statements and instantiation to your DAG file:

```python
from airflow.contrib.operators.kubernetes_pod_operator import kubernetes_pod_operator

# Pulls environment information from Astronomer Cloud
from airflow import configuration as conf
...

namespace = conf.get('kubernetes', 'NAMESPACE')
k = kubernetes_pod_operator.KubernetesPodOperator(
    namespace=namespace,
    image="<your-docker-image>",
    cmds=["<commands-for-image>"],
    arguments=["<arguments-for-image>"],
    labels={"<pod-label>": "<label-name>"},
    name="<pod-name>",
    is_delete_operator_pod=True,
    in_cluster=True,
    task_id="<task-name>",
    get_logs=True)
```

For each instantiation of the KubernetesPodOperator, you must specify the following values:

- `namespace = conf.get('kubernetes', 'NAMESPACE')`: Every Astronomer Deployment runs on its own Kubernetes namespace within a Cluster. Information about this namespace can be programmatically imported as long as you set this variable.
- `image`: This is the Docker image that the operator will use to run its defined task, commands, and arguments. The value you specify is assumed to be an image tag that's publicly available on [Docker Hub](https://hub.docker.com/). To pull an image from a private registry, read [Pull Images from a Private Registry](kubernetespodoperator.md#pull-images-from-a-private-registry).
- `in_cluster=True`: When this value is set, your task will run within the Cluster from which it's instantiated on Astronomer. This ensures that the Kubernetes pod running your task has the correct permissions within the Cluster.
- `is_delete_operator_pod=True`: This setting ensures that once a KubernetesPodOperator task is complete, the Kubernetes Pod that ran that task is terminated. This ensures that there are no unused pods in your Cluster taking up resources.

This is the minimum configuration required to run tasks with the KubernetesPodOperator on Astronomer Cloud. To further customize the way your tasks are run, see the topics below.

## Configure Task-Level Pod Resources

Astronomer Cloud automatically allocates resources to Pods created by the KubernetesPodOperator. Resources used by the KubernetesPodOperator are not limited, meaning that the operator could theoretically provision all your Cluster's available remaining CPU and memory to complete a task. Because of this, we recommend managing the KubernetesPodOperator's resource usage by specifying [compute resource requests and limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) on a per-task basis.

To do so, define a dictionary of compute resources in your DAG. For example, applying the following dictionary to a Pod would ensure that the Pod runs with exactly 800m of CPU and 3Gi of memory at all times:

```python
compute_resources = \
  {'request_cpu': '800m',
  'request_memory': '3Gi',
  'limit_cpu': '800m',
  'limit_memory': '3Gi'}
```

To use a dictionary, specify the `resources` variable in your instantiation of the KubernetesPodOperator:

```python {11}
with dag:
    k = KubernetesPodOperator(
        namespace=namespace,
        image="hello-world",
        labels={"foo": "bar"},
        name="airflow-test-pod",
        task_id="task-one",
        in_cluster=in_cluster, # if set to true, will look in the cluster, if false, looks for file
        cluster_context='docker-for-desktop', # is ignored when in_cluster is set to True
        config_file=config_file,
        resources=compute_resources,
        is_delete_operator_pod=True,
        get_logs=True)
```

## Pull Images from a Private Registry

By default, the KubernetesPodOperator expects to pull an image that's hosted publicly on Dockerhub. If you want to pull images from a private registry, complete the setup in this topic.

### Prerequisites

To complete this setup, you need:

- A private registry that hosts your images.
- kubectl.
- An Astronomer Cloud project.
- A Deployment hosting your project.

### Step 1: Create a Kubernetes Secret

To securely use private Docker images on Astronomer Cloud, you need to create a Kubernetes secret for accessing your private Docker registry. To do this, complete one of the following two setups:

#### Option 1: Manually Create a Kubernetes Secret

1. Follow the [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-line) to create a Kubernetes secret for accessing your private registry. Note the name of the secret for the next step.

2. Run the following command to confirm that the `dockerconfigjson` file was created correctly:

    ```sh
    kubectl get secret <secret-name> --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
    ```

    Copy this output.

3. Send the output from Step 2 and the name of the Cluster that you are configuring to Astronomer Support. From here, Astronomer Support  will add your secret to the Cluster.

#### Option 2: Let Astronomer Create a Kubernetes Secret

Instead of creating a Kubernetes secret yourself, you can send Astronomer the following credentials:

- Astronomer Cluster
- Docker username
- Docker password
- Docker email
- Docker server (only if other than Dockerhub)

Astronomer Support will use this information to directly create a Kubernetes secret and `dockerconfigjson` file in the specified Cluster.

### Step 2: Run the KubernetesPodOperator

Once Astronomer has added the Kubernetes secret to your Cluster, you will be notified and provided with the name of the secret.

From here, you can use the KubernetesPodOperator with your private images by importing Kubernetes client Models and specifying `image_pull_secrets` in your operator instantiation:

```python {1,6}
from kubernetes.client import models as k8s

k = kubernetes_pod_operator.KubernetesPodOperator(
    namespace=namespace,
    image="ubuntu:16.04",
    image_pull_secrets=[k8s.V1LocalObjectReference('<secret-name>')],
    cmds=["bash", "-cx"],
    arguments=["echo", "10", "echo pwd"],
    labels={"foo": "bar"},
    name="airflow-test-pod",
    is_delete_operator_pod=True,
    in_cluster=True,
    task_id="task-two",
    get_logs=True)
```
