---
title: 'View logs'
sidebar_label: 'View logs'
id: view-logs
description: View logs for your data pipelines both locally and on Astro.
---

View Airflow task and component logs to troubleshoot your data pipelines and better understand the behavior of your tasks and their execution environment.

:::info

If you need to forward task logs to other third-party logging tools, contact [Astronomer support](https://cloud.astronomer.io/support).

:::

## View Airflow task logs

Airflow task logs for both local Airflow environments and Deployments on Astro are available in the Airflow UI. Task logs can help you troubleshoot a specific task instance that failed or retried.

On Astro, Airflow task logs are stored in the data plane on your cloud. On Amazon Web Services (AWS), they are stored in S3. On Google Cloud Platform (GCP), they are stored in Cloud Storage. Task logs are stored indefinitely for existing Astro clusters. The task log retention policy is not currently configurable.

1.  Access the Airflow UI. To access the Airflow UI for a Deployment, open the Deployment in the Cloud UI and click **Open Airflow**. To access the Airflow UI in a local environment, open a browser and go to `http://localhost:8080`.
2. Click a DAG.
3. Click **Graph**.
4. Click a task run.
5. Click **Instance Details**.
6. Click **Log**.

## Access Airflow component logs locally

To show logs for your Airflow scheduler, webserver, or triggerer locally, run the following Astro CLI command:

```sh
astro dev logs
```

Once you run this command, the most recent logs for these components appear in your terminal window.

By default, running `astro dev logs` shows logs for all Airflow components. To see logs only for a specific component, add any of the following flags to your command:

- `--scheduler`
- `--webserver`
- `--triggerer`

To continue monitoring logs, run `astro dev logs --follow`. The `--follow` flag ensures that the latest logs continue to appear in your terminal window. For more information about this command, see [CLI Command Reference](cli/astro-dev-logs.md).

Logs for the Airflow webserver, worker, and triggerer are not available for Deployments on Astro.

## View Airflow scheduler logs

You can access the past 24 hours of scheduler logs for any Astro Deployment on the **Scheduler Logs** page of the Cloud UI. Logs are color-coded according to their type. Scheduler logs can help you understand scheduler performance and indicate if a task failed due to an issue with the scheduler. For more information on configuring the scheduler on Astro, see [Scheduler resources](configure-deployment-resources.md#scheduler-resources).

When a Deployment generates more than 500 lines of logs in 24 hours, only the most recent 500 lines are shown. If there are no scheduler logs available for a given Deployment, the following message appears:

```
No matching events have been recorded in the past 24 hours.
```

Typically, this indicates that the Deployment you selected does not currently have any DAGs running.

1. In the Cloud UI, select a Workspace.
2. Click **Logs** on the left menu.

    ![Logs icon and button](/img/docs/log-location.png)

3. Select a Deployment in the **Select a Deployment** menu.
4. Optional. Select one or more options in the **Log Level** menu and click **Apply**. These are the available options:

    - **Error**: Emitted when a process fails or does not complete. For example, these logs might indicate a missing DAG file, an issue with your scheduler's connection to the Airflow database, or an irregularity with your scheduler's heartbeat.
    - **Warn**: Emitted when Airflow detects an issue that may or may not be of concern but does not require immediate action. This often includes deprecation notices marked as `DeprecationWarning`. For example, Airflow might recommend that you upgrade your Deployment if there was a change to the Airflow database or task execution logic.
    - **Info**: Emitted frequently by Airflow to show that a standard scheduler process, such as DAG parsing, has started. These logs are frequent but can contain useful information. If you run dynamically generated DAGs, for example, these logs will show how many DAGs were created per DAG file and how long it took the scheduler to parse each of them.

5. Optional. To view the scheduler logs for another Deployment, select a different Deployment in the **Select a Deployment** menu.

## Export task logs to Datadog (_AWS only_)

Exporting task logs from AWS to Datadog allows you to centralize the management of logs and identify issues quickly.  

To export metrics to Datadog, see [Export Airflow metrics to Datadog](deployment-metrics.md#export-airflow-metrics-to-datadog).

### Prerequisites

- [AWS Command Line Interface (CLI)](https://aws.amazon.com/cli/).
- Cluster ID. Find this in the **Clusters** tab of the Cloud UI.
- Datadog API key. See [API and Application Keys](https://docs.datadoghq.com/account_management/api-app-keys/).
- A [Datadog site](https://docs.datadoghq.com/getting_started/site/) to receive the AWS task logs.

### Step 1: Create an AWS forwarder stack

Open the AWS CLI and run the following command to create the AWS forwarder stack:

 ```bash
    aws cloudformation create-stack \
--stack-name <data-plane-cluster-ID>-datadog \
--template-url http://datadog-cloudformation-template.s3.amazonaws.com/aws/forwarder/latest.yaml \
--capabilities CAPABILITY_NAMED_IAM \
--parameters ParameterKey=DdApiKey,ParameterValue=<Datadog-API-key> \
             ParameterKey=DdTags,ParameterValue="source:astronomer\,name:airflow"
 ```
The command includes a lambda function that forwards AWS task logs to the datadoghq.com Datadog site. To forward AWS task logs to a different Datadog site, add an additional parameter to the command. For example:

```bash
    aws cloudformation create-stack \
--stack-name <data-plane-cluster-ID>-datadog \
--template-url http://datadog-cloudformation-template.s3.amazonaws.com/aws/forwarder/latest.yaml \
--capabilities CAPABILITY_NAMED_IAM \
--parameters ParameterKey=DdApiKey,ParameterValue=<Datadog-API-key> \
             ParameterKey=DdTags,ParameterValue="source:astronomer\,name:airflow"
             ParameterKey=DdSite,ParameterValue=<Datadog-site>
```

### Add source identifier tags (optional)

Add tags to log messages to help you identify the source of the messages. To add source identifier tags, add an additional parameter to the command. For example:

```bash
    aws cloudformation create-stack \
--stack-name <dataplane-cluster-ID>-datadog \
--template-url http://datadog-cloudformation-template.s3.amazonaws.com/aws/forwarder/latest.yaml \
--capabilities CAPABILITY_NAMED_IAM \
--parameters ParameterKey=DdApiKey,ParameterValue=<Datadog-API-key> \
             ParameterKey=DdTags,ParameterValue="source:astronomer\,name:airflow"
             ParameterKey=DdSite,ParameterValue=<Datadog-site>
             ParameterKey=DdTags,ParameterValue="new:tags\,more:tags"
```

Specify additional tags with a comma-delimited list and use the `\` character to escape commas.

### Step 2: Verify AWS forwarder stack creation

1. Open the AWS CLI and run the following command to view a list of AWS stacks:

    ```bash
    aws cloudformation list-stacks
    ```

2. Run the following command to view a resource description for the AWS forwarder stack:

    ```bash
    aws cloudformation describe-stack-resources --<stack-name> <dataplane-cluster-ID>-datadog
    ```

    Confirm the resource description includes `<dataplane-cluster-ID>-datadog-Forwarder-Xliw1oDOFMPj)` or similar.

3. Run the following command to view a resource description for the AWS forwarder stack:

    ```bash
    aws cloudformation describe-stack-resources --<stack-name> <dataplane-cluster-ID>
    ```

    Confirm the resource description includes `airflow-logs-<dataplane-cluster-ID>`.

### Step 3: Create a notification

1. Open the AWS CLI and run the following command to return the Amazon Resource Name (ARN) for the AWS forwarder stack:

    ```bash
    aws lambda list-functions | grep -i "<lambda-name>"
    ```

2. Create a file named `notification.json` in your project directory and add the following entry:

    ```json
    {
      "LambdaFunctionConfigurations": [
        {
            "LambdaFunctionArn": "<LAMBDA ARN>",
            "Events": [
                "s3:ObjectCreated:*"
            ]
       }
    ]
    }
    ```
3. Run the following command to enable notifications for the Amazon S3 bucket containing AWS task logs:

    ```bash
        aws s3api put-bucket-notification-configuration \
        --bucket <S3-bucket-for-Airflow-logs> \
        --notification-configuration file://notification.json
    ```

### Step 4: Verify log stream functionality

1. Open the AWS CLI and run the following command to list the log streams for the AWS task logs:

    ```bash
    aws logs describe-log-streams --log-group-name '/aws/lambda/<lambda- name>' --query 'logStreams[*].logStreamName'
    ```
2. Run the following command to list log events for the AWS task log stream:

    ```bash
    aws logs get-log-events --log-group-name "/aws/lambda/<lambda- name>" --log-stream-name '<log-stream-name>'
    ```

### Update an AWS forwarder stack (optional)

1. Open the AWS CLI and run the following command to return summary information for the AWS stacks you have created:

    ```bash
    aws logs get-log-events --log-group-name "/aws/lambda/<lambda- name>" --log-stream-name '<log-stream-name>'
    ```

2. Run the following command to update the AWS forwarder stack:

    ```bash
        aws cloudformation update-stack \
        --stack-name <data-plane-cluster-ID>-datadog \
        --template-url http://datadog-cloudformation-template.s3.amazonaws.com/aws/forwarder/latest.yaml \
        --capabilities CAPABILITY_NAMED_IAM \
        --parameters ParameterKey=DdApiKey,ParameterValue=<new-Datadog-API-key> \
                    ParameterKey=DdTags,ParameterValue="<tags>" 
    ```
The example command updates the `DdApiKey` parameter with a new value.

### Delete an AWS forwarder stack

1. Open the AWS CLI and run the following command to list all Amazon S3 objects and common prefixes in all S3 buckets:

    ```bash
    aws s3 ls 
    ```
2. Run the following command to confirm notifications were enabled for the Amazon S3 bucket:

    ```bash
    aws s3api get-bucket-notification-configuration --bucket airflow-logs-<CLUSTER ID>

    # Output example
        {
        "LambdaFunctionConfigurations": [
            {
            "Id": "NWI3ZTVmNjktZTliNC00MzdkLWJjY2MtYmU3N2E3ZTEzOGJi",
            "LambdaFunctionArn": "arn:aws:lambda:us-east-1:670049755923:function:ckwqtv0zl000c0rr01u5icygi-datadog-Forwarder-O4Z80ihIkN3X",
            "Events": [
                "s3:ObjectCreated:*"
            ]
            }
        ]
        } 
    ```
3. Run the following command to disable notifications for the Amazon S3 bucket:

    ```bash
    aws s3api put-bucket-notification-configuration --bucket airflow-logs-<dataplane-cluster-ID> --notification-configuration="{}"
    ```
4. Run the following command to delete the AWS forwarder stack:

    ```bash
    aws cloudformation delete-stack --stack-name <dataplane-cluster-ID>-datadog
    ```
5. Repeat step 1 and confirm the AWS forwarder stack has the status `StackStatus: DELETE_COMPLETE`. 