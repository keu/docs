---
title: 'Astronomer Enterprise v0.28 Release Notes'
sidebar_label: 'Astronomer Enterprise'
id: release-notes
description: Astronomer Enterprise release notes.
---

## Overview

<!--- Version-specific -->

This document includes all release notes for Astronomer Enterprise v0.28.

Astronomer v0.28 is the latest Stable version of Astronomer Enterprise, while v0.25 remains the latest long-term support (LTS) version. To upgrade to Astronomer v0.28 from v0.26+, read [Upgrade to a Stable Version](upgrade-astronomer-stable.md). For more information about Enterprise release channels, read [Release and Lifecycle Policies](release-lifecycle-policy.md). To read release notes specifically for the Astronomer CLI, see [Astronomer CLI Release Notes](cli-release-notes.md).

We're committed to testing all Astronomer Enterprise versions for scale, reliability and security on Amazon EKS, Google GKE and Azure AKS. If you have any questions or an issue to report, don't hesitate to [reach out to us](https://support.astronomer.io).

## v0.28.0

Release date: February 11, 2022

### Import Identity Provider User Groups as Teams

You now can import existing identity provider (IDP) groups into Astronomer Enterprise as Teams, which are groups of Astronomer users that have the same set of permissions to a given Workspace or Deployment. Importing existing IDP groups as Teams enables swift onboarding to Astronomer and better control over multiple user permissions.

For more information about configuring this feature, read [Import IDP Groups](import-idp-groups.md). To learn more about adding and setting permissions for Teams via the Astronomer UI, read [User Permissions](workspace-permissions.md#via-teams).

### Apply Validation Webhooks to Deployment Creation

You can now configure Astronomer to apply a custom validation webhook whenever a user attempts to create a new Astronomer Deployment.

This feature can be configured in the following section of your `config.yaml` file:

```yaml
houston:
  deployments:
    namespaceFreeFormEntry: true #true|false
    preDeploymentValidationHook: http://my-provision-hook.com/prod-us
    preDeploymentValidationHookTimeout: 30000 # 30 sec
```

For example, a validation webhook can reject Deployment creation for any of the following reasons:

- The namespace for a Deployment is already in use.
- The namespace for a Deployment is in an incorrect format.
- The user creating a Deployment is unauthorized to complete this action.

### Additional Improvements

- Astronomer now supports `prefer` and `require` SSL modes for connecting to PGBouncer. You can set this SSL mode via the `global.ssl.mode` value in your `config.yaml` file. Note that in v0.28.0, this feature works only with AWS and Azure.
- All metrics dashboards have been upgraded to Grafana 8.
- You can now set [Grafana environment variables](https://grafana.com/docs/grafana/latest/administration/configuration/#override-configuration-with-environment-variables) using the `grafana.extraEnvVars` setting in your `config.yaml` file.
- Added a new **Ephemeral Storage Overwrite Gigabytes** slider to the Git Sync configuration screen. You can configure this slider to allocate more memory for syncing larger Git repos.
- Added a new **Sync Timeout** slider to the Git Sync configuration screen. You can configure this slider to set a maximum allowed length of time for syncing a Git repo.

### Bug Fixes

- Removed root user permissions for authSidecar
- Added AWS RDS certificates to list of trusted certificates
- Removed support for Kubernetes 1.18
- Fixed some confusing behavior with the Git-Sync **SSH Key** field in the UI  
- Fixed an issue where the Astronomer platform and Airflow could not communicate in environments where inter-namespace communication is disabled
- Fixed an issue where users would frequently get 502 errors when logging in to the Astronomer UI
- Fixed an issue where users would get timeout issues when attempting to log in to an Astronomer installation on OpenShift
