---
sidebar_label: 'Glossary'
title: 'Astro glossary'
id: astro-glossary
description: A quick reference for terms you'll encounter on Astro.
---
The following table contains definitions for all of the key terms and concepts you'll come across on Astro. For a glossary of Apache Airflow terms, see [Airflow glossary](https://docs.astronomer.io/learn/airflow-glossary).

| Term | Definition |
|------|-------------|
| API key | An API key is a unique key ID and secret that grants programmatic access to a Deployment. Astro does not support API keys at the Workspace or Organization level. API keys will soon be deprecated in favor of API tokens. |
| API token | An API token is an alphanumeric token that grants programmatic access to Astro for automated workflows. An API token can be scoped to an [Organization](organization-api-tokens.md) or a [Workspace](workspace-api-tokens.md)." |
| Astro | [Astro](https://www.astronomer.io/product/) is a SaaS application that provides fully managed Apache Airflow environments for teams of all sizes. To get started, [start a trial](https://www.astronomer.io/try-astro/).. |
| Astro alerts | [Astro alerts](alerts.md) are customizable notifications that can alert teams of disruptions on Astro Deployments. Astro alerts are configured in the Cloud UI and integrate with tools like Slack and Pagerduty. Unlike Airflow alerts, Astro alerts require no changes to DAG code. |
| Astro CLI | The [Astro CLI](cli/overview.md) is an open source command line interface built by Astronomer. You can use the Astro CLI to run Apache Airflow locally or interact programmatically with Astronomer products. |
| Astro Hosted | [Astro Hosted](astro-architecture.md) is a distribution of Astro where the infrastructure required to run Airflow is fully managed by Astronomer in Astronomer's cloud. It is recommended for most teams running Airflow. |
| Astro Hybrid | [Astro Hybrid](hybrid-overview.md) is a distribution of Astro where the infrastructure required to run Airflow is fully managed by Astronomer but hosted in your cloud and paid for by your organization. It is recommended for security-conscious teams running at scale. |
| Astro project | An [Astro project](develop-project.md) contains the set of files necessary to run Airflow either locally or on Astro, including dedicated folders for the DAG files, plugins, and dependencies. Create a new Astro project by running `astro dev init` with the [Astro CLI](https://docs.astronomer.io/astro/cli/overview). |
| Astro Runtime | [Astro Runtime](runtime-image-architecture.md) is a Docker image for running Airflow that's built and maintained by Astronomer. Every Astro project and Deployment is configured with a version of Astro Runtime. Compared to the Apache Airflow Docker image, Astro Runtime additionally includes smart Airflow configurations, pre-installed packages, a security manager for role-based access control (RBAC), and expedited vulnerability fixes. |
| Astronomer Software | [Astronomer Software](https://docs.astronomer.io/software) is Astronomer's commercial software offering for running Apache Airflow on Kubernetes in a private cloud or airgapped environment. The infrastructure required to run the service is hosted and managed entirely by your organization instead of by Astronomer. It is only recommended for extremely security conscious organizations running at a unique level of scale. |
| Cell | A [cell](cloud-ide/quickstart.md#step-3-create-a-python-cell) is a UI-based abstraction of an Airflow task that serves as the building block for DAGs written with the Astro Cloud IDE. Cells can run Python code, SQL code, or an Airflow operator. |
| Cloud UI | The Cloud UI is the user interface for Astro. From the Cloud UI, users can manage Organizations, Workspaces, and Deployments, as well as write DAGs in the Astro Cloud IDE. The Cloud UI is available at `https://cloud.astronomer.io`. |
| Cluster | An Astro cluster is a Kubernetes cluster that hosts the infrastructure required to run Deployments. Clusters can be [standard](https://docs.astronomer.io/astro/resource-reference-hosted#dedicated-cluster-configurations) or [dedicated](https://docs.astronomer.io/astro/resource-reference-hosted#standard-cluster-configurations). |
| Dedicated Cluster | A [dedicated cluster](create-dedicated-cluster.md) is a cluster type available on Astro Hosted. It is a single-tenant cluster hosted on Astronomer's cloud that exclusively runs Deployments from a single Organization. |
| Control Plane | The Astro control plane is Astro's interface for managing Airflow environments running in the cloud. The Cloud UI or the Astro CLI is used to interact with the control plane. It provides end-to-end visibility, control, and management of users, teams, Workspaces, Deployments, metrics, and logs.|
| DAG Bundle Version | A DAG Bundle Version is a unique timestamp generated by the Astro CLI after a user completes a DAG-only deploy and identifies the version of code that Astro is running. This value exists only when [DAG-only deploys](deploy-code.md#deploy-dags-only) are enabled for a Deployment. |
| Data lineage | [Data lineage](data-lineage-concepts.md) is the concept of tracking and observing data flowing through a data pipeline. Data lineage can be used to understand data sources, troubleshoot run failures, manage personally identifiable information (PII), and ensure compliance with data regulations. Astro includes data lineage features in the Cloud UI.  |
| Data plane | The data plane is a component of [Astro Hybrid](hybrid-overview.md). It is a single-tenant foundation in a customer's cloud that runs multiple Airflow environments across clusters, regions, and clouds. |
| Deploy | A [deploy](deploy-code.md) is the process of pushing code to a Deployment on Astro. A code push can include either a complete Astro project or DAG code.
| Deployment | An [Astro Deployment](create-deployment.md) is an Airflow environment that is powered by all core Airflow components, including schedulers and workers. Astro users can deploy DAGs to a Deployment, and can have one or more Deployments within a Workspace. |
| Environment variable| An [environment variable](environment-variables.md) is a key-value pair that defines a configuration or value for a Deployment.  |
| High availability (HA) | [High availability (HA)](configure-deployment-resources.md#enable-high-availability) is a feature on Astro for ensuring that the components of a Deployment continue to run even in the event of an outage. On Astro Hosted, HA can be enabled or disabled per Deployment. |
| Namespace | A [namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) is a Kubernetes component which isolates Airflow environments within a Kubernetes cluster. Each Deployment uses a separate namespace to isolate resources. |
| Organization | An Organization is the highest management level on Astro. An Organization contains Workspaces, which are collections of Deployments, or Airflow environments, that are typically owned by a single team.  |
| Pipeline | A [pipeline](cloud-ide/quickstart.md#step-2-create-a-pipeline) is a notebook-style configuration for DAGs which is available in the Astro Cloud IDE. A pipeline can include traditional Airflow operators, as well as Python and SQL functions that are executed through the Astro Python SDK. |
| Standard cluster | A [standard cluster](resource-reference-hosted.md#standard-cluster-configurations) is a cluster type available on Astro Hosted. It is multi-tenant and runs Deployments from multiple Organizations. |
| Worker Node | A [worker node](resource-reference-hosted.md#worker-type) is a node used to run Airflow worker Pods, which are responsible for executing Airflow tasks in the Deployments. |
| Worker Node Pool | A [worker node pool](manage-hybrid-clusters.md#about-worker-node-pools) is a Kubernetes node pool that's used to run worker nodes of the same type on Astro Hybrid. Each worker node pool has a worker type and a maximum node count.  |
| Worker Queue | A [worker queue](configure-worker-queues.md) is a set of configurations that apply to a group of workers in a Deployment running the Celery executor. Within a worker queue, users can configure worker type, worker size, and autoscaling behavior.|
| Worker Type | The worker type defines the quantity of resources a celery worker can consume. On Astro Hosted, worker types are defined in terms of Astronomer units (A5, A10, A20). Each Ax type has a different configuration for memory, cpu and default number of concurrent tasks per celery worker. On Astro Hybrid, worker types are defined by the cloud node instance type that host celery workers and KubernetesPodOperator pods. |
| Workspace | [Workspaces](manage-workspaces.md) are collections of Deployments that can be accessed by a specific group of users. Workspaces can be used to group Deployments that share a business use case or environment trait. |