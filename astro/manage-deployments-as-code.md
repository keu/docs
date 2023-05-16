---
sidebar_label: 'Manage Deployments as code'
title: 'Manage Deployments as code'
id: manage-deployments-as-code
description: "Manage an Astro Deployment with a JSON or YAML file."
---

To manage Deployments as code or programmatically you can use Astro CLI allowing for faster turnaround time and easy management. This method at a minimum requires some settings and rest are used as per the cluster defaults or the smart defaults. This section will explain how to use Astro CLI to manage your Deployments either using simple commands or configuration files. 

You can export configuration settings of an existing deployment to a `JSON` or `YAML` file format and use it as a deployment file or a template file. This configuration includes worker queues, environment variables, and Astro Runtime version. We will be using these two terms in this section:

- A ***deployment file*** is a configuration file which contains the *details* and *metadata* for a Deployment and can be used to update an existing Deployment.
- A ***template file*** is a configuration file which contains the *details* for a given Deployment that can be re-used as a deployment file by adding the `name` field.

You might want to create or update deployments programmatically in the following scenarios:

| Scenario | Approach | 
|----------|----------|
| You want to create a deployment using CI/CD | [Create a Deployment using Astro CLI](#create-a-deployment-using-astro-cli) | 
| You have large number of deployments and want to re-use your Deployment configuration via version control | [Create a template file](#create-a-deployment-template-file) to use across multiple deployments |
| You want to use your current Dev or Prod Deployment as a template for another project | [Create a template file from current Deployment](#create-a-deployment-template-file) and [create a new Deployment](#create-a-deployment-using-a-template-file) using Astro CLI | 
| You want to rely on CI/CD or automated processes to make modifications to your Deployments | [Update your Deployment file](#update-a-deployment-using-a-deployment-file) and apply using Astro CLI | 


For more details about each section of configuration file, refer to [Deployment file reference](#deployment-file-reference).

## Prerequisites

- [Install Astro CLI](cli/install-cli.md)
- [Login using Astro CLI](cli/astro-login.md) for local or [Workspace API Token](workspace-api-tokens.md#use-a-workspace-api-token-with-the-astro-cli) for CI/CD

:::info
You can also use [Deployment API keys](api-keys.md) for managing Deployments programmatically if you want to manage each Deployment using separate credentials. But they will be phased out in favour of Deployment API tokens soon. 
:::

## Create a Deployment using Astro CLI

You can create an Astro Deployment by passing the required parameters for a new Deployment directly via the Astro CLI for automating via CI/CD. Important points to keep in mind when you use this method:

- Only deployment name and cluster id are required to create a deployment with the default configurations. 
- The smart defaults are auto-selected for your Deployment including the latest Astro Runtime and Celery executor when you don't specify them.
- If the Workspace is not set explicitly, either the Workspace currently set in your local Astro project is used or the command prompts you to select a Workspace. Hence, it is advised to always specify the Workspace you want to use.
- You cannot add extra worker queues when you create a Deployment just like Cloud UI.

```bash
## create a deployment with the default settings and default workspace in your Astro project
astro deployment create --name="my_test_deployment" --cluster-id="my_cluster_id"

## create a deployment in a given workspace with the default settings
astro deployment create --name="my_test_deployment" --cluster-id="my_cluster_id" --workspace-id="my_workspace_id"
```

For more information on how to `create` a deployment, see [Astro CLI command reference](/cli/astro-deployment-create.md)

## Create a Deployment template file

You can `inspect` an existing Deployment with the Astro CLI to create a template file of its configurations. A template file is created in YAML or JSON format and includes all information about a Deployment except for its name, description, and metadata. You can use template files to programmatically create new Deployments based on configurations from an existing Deployment.

To create a template file, refer the following commands: 

```bash
# save the template to a YAML file
astro deployment inspect -n my-deployment-name --template  > my-deployment-template.yaml

# save the template to a JSON file
astro deployment inspect -n my-deployment-name --template --output json > my-deployment-template.json

# print the template to your terminal
astro deployment inspect -n my-deployment-name --template
```

For more information on how to `inspect` a Deployment, see [Astro CLI command reference](/cli/astro-deployment-inspect.md).

## Create a Deployment using a template file

You can create a Deployment according to the configurations specified in a given template file using Astro CLI. Before you do, keep the following in mind:

- The fields `name`, `cluster_name` and `workspace_name` are the required fields in the template file. Deployment names must be unique within a single Workspace. 
- The CLI will create the Deployment using default values for each unspecified configuration. These default values are the same default values that are used when you create a Deployment from the Cloud UI.
- When you create a template file from an existing Deployment, configuration for all the worker queues is copied in the template file. You can either keep all of them or remove them. If no worker queues are defined in the template file, only the default worker queue is created with the default node type for the cluster. 
- When creating a new worker queue, the `name` and `worker_type` fields are required.
- When creating environment variables in the template file, each variable must include a `key` and a `value` in the `environment_variables` section.

After you update the exsiting template file, you can create a new Deployment as below:

1. Run:

    ```bash
    astro deployment create --deployment-file <deployment-template-file-name>
    ```

2. Optional. Confirm that your Deployment was successfully created by running the following command in your current Workspace:

   ```bash
   astro deployment list
   ```
   
   You can also go to your Workspace page in the Cloud UI.

3. Optional. Reconfigure any Airflow connections or variables for the Deployment that you created using the `environment_variables` section in the template file. See [Manage connections in Airflow](https://docs.astronomer.io/learn/connections).

## Update a Deployment using a deployment file

:::warning 

You must push a complete Deployment file that lists all valid configurations whenever you update a Deployment with a Deployment file. If a configuration exists on Astro but doesn't exist in your Deployment file, such as a worker queue, that configuration is deleted when you push your Deployment file. 

:::

A Deployment file is a complete snapshot of an existing Deployment at the point you inspected it. It's similar to a template file, but also contains your Deployment's name, description, and metadata. You can use a Deployment file to update an existing Deployment with a new set of configurations using Astro CLI.

### Important considerations

- You can’t change the cluster or Workspace the Deployment runs on. To transfer a Deployment to a different Workspace, use Cloud UI. See [Transfer a Deployment](configure-deployment-resources.md#transfer-a-deployment-to-another-workspace).
- You can't change the Astro Runtime version of the Deployment. To upgrade Astro Runtime, you must update the Dockerfile in your Astro project. See [Upgrade Astro Runtime](upgrade-runtime.md).
- Worker queues and environment variables are updated to match the corresponding sections in the Deployment file. Any existing worker queues or environment variables that are specified in the Cloud UI but not in the Deployment file are deleted.

### Generate a deployment file 

You can generate a deployment file with the current configurations for a Deployment using Astro CLI. This deployment file can be then be checked-in to a version control system like GitHub for tracking the changes and can be used as part of the CI/CD process to apply changes to a Deployment. To generate a deployment file, run the following command:

  ```bash
  astro deployment inspect -n my-deployment-name > my-deployment-file.yaml
  ```

### Update a Deployment

1. Modify the Deployment file and save your changes. You can modify any value in the `environment_variables` and `worker_queues` sections, and most values in the `configuration` section.

2. Update your Deployment according to the configurations in the Deployment file:

  ```bash
  astro deployment update --deployment-file my-deployment-file.yaml
  ```

3. Optional. Confirm that your Deployment was updated successfully by running the following command. You can also go to the Deployment page in the Cloud UI to confirm the new values.

  ```bash
  astro deployment inspect -n my-deployment-name
  ```

## Deployment file reference

When you `inspect` a Deployment, a deployment file is created with the following sections:

- `environment_variables`
- `configuration`
- `worker_queues`
- `alert_emails`
- `metadata`

All information in the template file is also available in the Cloud UI. See the following template file as an example.

```yaml
deployment:
    environment_variables:
        - is_secret: false
          key: ENVIRONMENT
          value: Dev
        - is_secret: true
          key: AWS_ACCESS_KEY_ID
          value: ""
    configuration:
        # Name and description are replaced with placeholder values (`""`) in a template file. Manually specify these values when you create a new Deployment.
        name: ""
        description: ""
        runtime_version: 7.1.0
        dag_deploy_enabled: true
        executor: CeleryExecutor
        scheduler_au: 5
        scheduler_count: 1
        cluster_name: AWS Cluster
        workspace_name: Data Science Workspace
    worker_queues:
        - name: default
          max_worker_count: 10
          min_worker_count: 1
          worker_concurrency: 16
          worker_type: m5.xlarge
        - name: machine-learning-tasks
          max_worker_count: 4
          min_worker_count: 0
          worker_concurrency: 10
          worker_type: m5.8xlarge
    alert_emails:
        - paola@cosmicenergy.io
        - viraj@cosmicenergy.io
# This section is only populated when you inspect a Deployment without creating a template. It is useful when you want to create the specific deployment's deployment file.
# Do not configure metadata when you create a new Deployment from a template. 
    metadata:
        deployment_id: 
        workspace_id: 
        cluster_id: 
        release_name: 
        airflow_version: 
        status: 
        created_at: 
        updated_at: 
        deployment_url: 
        webserver_url: 
```

#### `environment_variables`

You can create, update, or delete environment variables in the `environment_variables` section of the template file. This is equivalent to configuring environment variables in the **Variables** page of a Deployment in the Cloud UI.

When you `inspect` a Deployment, the value of any environment variable that is set as secret in the Cloud UI will not appear in the template file. To set any new or existing environment variables as secret in the file, you can specify `is_secret: true` next to the key and value. 

:::tip 
Astronomer recommends that you update the secret values manually in the Cloud UI and leave them blank in the file. This ensures that you do not commit secret values to a version control tool in plain-text.
:::

See [Environment variables](environment-variables.md).

#### `configuration`

The `configuration` section contains all basic settings that you can configure from the Deployment **Details** page in the Cloud UI. See:

- [Create a Deployment](create-deployment.md#create-a-deployment).
- [Update a Deployment name and description](configure-deployment-resources.md#update-a-deployment-name-and-description).
- [Scheduler resources](configure-deployment-resources.md#scheduler-resources).

#### `worker_queues`

The `worker_queues` section defines the worker queues for a Deployment. All Deployment files must include configuration for a `default` worker queue. If you don't enter specific values for the `default` worker queue, default values based on the worker types available on your cluster are applied.

See [Worker queues](configure-worker-queues.md).

#### `metadata`

The metadata section is only generated when you generate a deployment file for an existing Deployment without the `template` flag. This section is auto-generated and should not be edited by the user.

## See also

- [Deploy Code](deploy-code.md)
- [Choose a CI/CD Strategy for deploying code to Astro](set-up-ci-cd.md)
