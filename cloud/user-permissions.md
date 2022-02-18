---
sidebar_label: "User Permissions"
title: "Manage User Permissions in Astro"
id: manage-workspaces
description: Learn about Astronomer's RBAC system and how to assign roles to users.
---

## Overview

This document provides information about all available user roles in Astro.

To better protect your data pipelines and cloud infrastructure, Astro offers role-based access control for Organizations and Workspaces. Each Astro user has a single role that defines their level access across both the Control Plane and the Data Plane.

## Workspace Roles

A Workspace role grants a user some level of access to a specific Workspace. The following Workspace roles are available:

| Permission                           | **Workspace Viewer** | **Workspace Editor** | **Workspace Admin** |
| ------------------------------------ | -------------------- | -------------------- | ------------------- |
| View Workspace users                 | ✔️                   | ✔️                   | ✔️                  |
| View all Deployments in the Cloud UI | ✔️                   | ✔️                   | ✔️                  |
| View DAGs in the Airflow UI          | ✔️                   | ✔️                   | ✔️                  |
| Push code to Deployments             |                      | ✔️                   | ✔️                  |
| Update Deployment settings           |                      | ✔️                   | ✔️                  |
| Update user roles and information    |                      |                      | ✔️                  |

### Set Workspace Roles

Workspace Admins can set user roles via the **Access** tab in the Cloud UI. For more information, see [Manage Workspaces](manage-workspaces.md#manage-workspace-users).

## Organization Roles

| Permission                           | **Organization Member** | **Organization Billing Admin** | **Organization Owner** |
| ------------------------------------ | -------------------- | -------------------- | ------------------- |
| Workspace Admin permissions to all Workspaces                 | ✔️                   | ✔️                   | ✔️                  |
| View all Deployments in the Cloud UI | ✔️                   | ✔️                   | ✔️                  |
| View DAGs in the Airflow UI          | ✔️                   | ✔️                   | ✔️                  |
| Push code to Deployments             |                      | ✔️                   | ✔️                  |
| Update Deployment settings           |                      | ✔️                   | ✔️                  |
| Update user roles and information    |                      |                      | ✔️                  |

### Update Organization Roles
