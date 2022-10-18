---
sidebar_label: 'Manage Workspaces'
title: 'Manage Workspaces on Astro'
id: manage-workspaces
description: Create, delete, and update Workspaces on Astro.
---

Workspaces are collections of Deployments that can be accessed by a specific group of users. You can use Workspaces to group Deployments that share a business use case or environment trait. For example, you might create one Workspace that stores all of your production pipelines and another Workspace that stores all of your development pipelines.

## Create a Workspace

:::info

To create a Workspace, you must have an [Organization-level](user-permissions.md#organization-roles) role.

:::

To create a Workspace, click the **Add Workspace** button from the **Overview** tab.

![Add Workspace button in the Cloud UI](/img/docs/add-workspace.png)

During this initial setup, you can configure a Workspace's name and description. All further Workspace configuration is completed in the Workspace view.

## Workspace View

To to enter your Workspace, click the Workspace in the **Overview** tab. When you click into a Workspace and see a list of that Workspace's Deployments, you are in the **Workspace view** of the Cloud UI. The Workspace view contains several pages for managing your Workspace which are accessible from a sidebar on the left of the screen:

- **Deployments:** Create new Deployments and see key metrics about existing Deployments in the Workspace. For more information, see [Create a Deployment](create-deployment.md).
- **DAGs:** View metrics about individual DAGs across your Workspace. For more information, see [Deployment metrics](deployment-metrics.md#dag-runs).
- **Workspace Settings:** Update Workspace details, including Workspace user permissions, the Workspace name, and the Workspace description.

## Manage Workspace Users

As a Workspace Admin, you can add or remove users from your Workspace at any time. Before adding a user, make sure that the user is an existing member of your Organization. If the user is not, [invite them to Astro](add-user.md#add-a-user-to-an-organization) before following the steps below.

1. In the Workspace view, go to the **Access** page.
2. Click **Add member**.
3. Specify the user's email and role within the Workspace. For more information about Workspace roles and permissions, see [User permissions](user-permissions.md).

After adding the user, the user will see the Workspace listed on the **Overview** page of the Cloud UI. They will also appear as an active Workspace member in the **Access** tab. For more information about inviting users to Astronomer, see [Add a user](add-user.md).

### Update or Remove a Workspace User

1. Open a Workspace and click **Workspace Settings**.
2. Click the **Edit** button next to the user's entry in the **Member** table:

    ![Edit Workspace user button](/img/docs/edit-workspace-user.png)

From here, you can either update a user's Workspace role or remove the user from the Workspace.

## Update Workspace details

1. Open the Workspace in the Cloud UI
2. Click **Workspace Settings**, then click **Details**.
3. Click **Edit Details** and make changes. To save your changes, click **Update**.

### Delete a Workspace

To delete a Workspace, click **Delete Workspace** in the **Workspace Settings** page. Note that you can delete a Workspace only if there are no active Deployments in the Workspace.

![Delete Workspace button](/img/docs/delete-workspace.png)
