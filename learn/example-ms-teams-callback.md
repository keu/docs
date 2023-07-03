---
title: "Microsoft Teams Notifications"
description: "Configure notifications in Microsoft teams for DAG runs and tasks using Airflow callbacks."
id: example-ms-teams-callback
sidebar_label: "MS Teams Notifications"
sidebar_custom_props: { icon: 'img/examples/ms_teams_logo.png' }
---

This example shows how to set up notifications for Airflow DAG runs and tasks in a [Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software) channel by using [Airflow callbacks](error-notifications-in-airflow.md#airflow-callbacks). Automatic notifications about DAG runs and tasks in a chat system like Microsoft teams allow you to quickly inform many members of your team about the status of your data pipelines and take action if necessary.

## Before you start

Before trying this example, make sure you have:

- [MS Teams](https://www.microsoft.com/en-us/microsoft-teams/log-in) with a Business account supporting team channels.
- The [Astro CLI](https://docs.astronomer.io/astro/cli/install-cli)
- An Astro project running locally on your computer. See [Getting started with the Astro CLI](https://docs.astronomer.io/astro/cli/get-started-cli)

## Write Airflow code with VS Code

Follow these steps to receive notifications in MS Teams for failed tasks in an example DAG. Refer to the [Airflow callbacks section](error-notifications-in-airflow.md#airflow-callbacks) of our notifications guide to learn how to set up notifications for other type of events in a DAG run.

1. Open the folder containing your Astro Project. And the contents of the `include` folder in [this GitHub repository](https://github.com/astronomer/cs-tutorial-msteams-callbacks/tree/main/include) to your `include` folder.

    ```text
    ├── .astro
    ├── dags
    └── include
        ├── hooks
        │   └── ms_teams_webhook_hook.py
        ├── operators
        │   └── ms_teams_webhook_operator.py
        ├── ms_teams_callback_functions.py
        └── ms_teams_callback_functions_with_partial.py
    ```

2. Create a [Microsoft Teams Incoming Webhook](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook?tabs=dotnet#create-incoming-webhooks-1) for the channel for which you want to receive notifications. Copy and save the webhook URL.

3. In the Airflow UI create an Airflow connection by clicking on **Admin** and then **Connections**. Create a new connection with the following parameters:

    - **Conn Id**: `ms_teams_callbacks`
    - **Conn Type**: `HTTP`
    - **Host**: `outlook.office.com/webhook/<your-webhook-id>`
    - **Schema**: `https`

    ![Connection](/img/examples/example-ms-teams-callback-connection.png)

:::info

Some corporate environments make use of outbound proxies. If you are behind an outbound proxy for internet accessput the proxy details in the **Extra** field when creating the HTTP Connection in the Airflow UI (`{"proxy":"http://my-proxy:3128"}`). 

:::

4. Import the failure callback function from the `include` folder in your DAG file.

    ```python
    from include.ms_teams_callback_functions import failure_callback
    ```

5. Set the `on_failure_callback` keyword of your DAG's `default_args` parameter to the imported `failure_callback` function.

    ```python
    @dag(
        start_date=datetime(2023, 7, 1),
        schedule="@daily",
        default_args={
            "on_failure_callback": failure_callback,
        }
    )
    ```

6. Run your DAG. Any failed task will trigger the `failure_callback` function which sends a notification message in your MS Teams channel.

By following the steps above you can configure a callback function to send notifications to your MS Teams channel for any task that fails in a specific DAG. Other pre-built callback functions are available in the files copied from the `include` folder of [this repository](https://github.com/astronomer/cs-tutorial-msteams-callbacks) and can be modified to customize the notification message. To learn more about all available callback parameters see [Airflow callbacks](error-notifications-in-airflow.md#airflow-callbacks).

![Notification](/img/examples/example-ms-teams-callback-task-fail-teams-msg.png)

## See also

- [MS Teams developer documentation](https://learn.microsoft.com/en-us/microsoftteams/platform/mstdd-landing)
- [Manage Airflow DAG notifications](error-notifications-in-airflow.md)
