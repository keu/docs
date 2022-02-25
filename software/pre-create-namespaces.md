---
title: 'Configure Pre-Created Kubernetes Namespaces for Astronomer Software'
sidebar_label: 'Pre-Create Namespaces'
id: pre-create-namespaces
description: Manually create Kubernetes namespaces for new Deployments.
---

## Overview

Hosting Astronomer Software in a multi-tenant Kubernetes cluster has some challenges. The main risks are around security, and resource contention. To help mitigate those risks, you can configure a pool of pre-created namespaces for users to install Deployments into. This pool is global, and namespaces can be used across all workspaces.

When a user creates a new deployment, they will see a list of available namespaces that are ready to be used to bootstrap their Deployment into. Once that Deployment is deleted, the namespace will be returned to the pool, and will become available for use. Our access is limited to the namespaces contained in this pool, and at any given time, the number of active Deployments will never be greater than the number of namespaces you have preallocated for Astronomer Software to use.

### Why Pre-Created Namespaces

To understand how pre-created namespace pools help, it’s important to understand how Deployment creation works. When a user creates a new Deployment via the UI or CLI, Astronomer Software will create all Airflow components that are needed, and will isolate these components in a dedicated Kubernetes namespace.

Under the hood, lots of Kubernetes resources are needed to support this, like Kubernetes secrets, roles and service accounts. Some sensitive data - such as Airflow encryption keys - are stored as Kubernetes secrets. It’s fine for the Airflow Webserver to access a secret to use its own fernet key for encryption purposes, but it’s not ok for another Airflow Deployment to access that same secret.

We protect against these kinds of scenarios by creating and using dedicated service accounts for Airflow components that need to interact with other components or the outside world, and make sure that Airflow pods only have access to the resources they need. However, to manage this process, Astronomer Software itself needs extensive permissions. In Kubernetes, there are two main levels of permissions. You can grant a service account permissions for an entire cluster, or you can grant permissions for existing namespaces.

By default, we use cluster-level permissions as we don’t yet know the number of Deployments that will be needed. This is ideal if we’re running in our own dedicated cluster, but a security risk when other applications are running in the same cluster. Our Commander service, which controls creating, updating and deleting Deployments will, by default, have permissions to interact with secrets, roles and service accounts for other applications. Depending on the business risk, this may be unacceptable.

By configuring a pool of pre-created namespaces, you create a set of namespaces with namespace-scoped roles for us to use, which means we only have access to the namespaces that you explicitly grant us access to.

The other benefit to using a Pre-Created Namespace pool is to avoid resource contention issues. Astronomer Software will by default allow users to create Deployments until there is no more unreserved space. When using a pool, you can limit the number of active Deployments running at the same time. This is especially important if you run other elastic workloads on the same cluster and need to prevent users from accidentally claiming the entire pool of unallocated resources.

## Prerequisites

- helm
- kubectl
- kubectl access to cluster hosting Astronomer Software

## Create Kubernetes Namespaces, Roles and Rolebindings for Astronomer Software

Before registering namespaces to a pool, you need to create a `namespace`, `role` and `rolebinding` in your Kubernetes cluster for Astronomer Software to use. The `rolebinding` must be scoped to the `astronomer-commander` service account and the `namespace`  you are creating. This process must be repeated for every namespace you wish to add to the pool.

1. In the namespace, role, and rolebinding sections, replace `<your-namespace-here>` with the namespace name you intend to create. Save the manifest as `commander.yaml`

    ```yaml
    apiVersion: v1
    kind: Namespace
    metadata:
      name: <your-namespace-name>
    ---
    apiVersion: rbac.authorization.k8s.io/v1
       kind: Role
       metadata:
         name: deployment-commander-role
         namespace: <your-namespace-name> # Should be namespace you are granting access to
       rules:
       - apiGroups: ["*"]
         resources: ["*"]
         verbs: ["list", "watch"]
       - apiGroups: [""]
         resources: ["configmaps"]
         verbs: ["create", "delete", "get", "list", "patch", "update", "watch"]
       - apiGroups: ["keda.k8s.io"]
         resources: ["scaledobjects"]
         verbs: ["get", "create", "delete"]
       - apiGroups: [""]
         resources: ["secrets"]
         verbs: ["create", "delete", "deletecollection", "get", "list", "patch", "update", "watch"]
       - apiGroups: [""]
         resources: ["namespaces"]
         verbs: ["get", "list", "patch", "update", "watch"]
       - apiGroups: [""]
         resources: ["serviceaccounts"]
         verbs: ["create", "delete", "get", "patch"]
       - apiGroups: ["rbac.authorization.k8s.io"]
         resources: ["roles"]
         verbs: ["*"]
       - apiGroups: [""]
         resources: ["persistentvolumeclaims"]
         verbs: ["create", "delete", "deletecollection", "get", "list", "update", "watch", "patch"]
       - apiGroups: [""]
         resources: ["pods"]
         verbs: ["get", "list", "watch"]
       - apiGroups: [""]
         resources: ["endpoints"]
         verbs: ["create", "delete", "get", "list", "update", "watch"]
       - apiGroups: [""]
         resources: ["limitranges"]
         verbs: ["create", "delete", "get", "list", "watch", "patch"]
       - apiGroups: [""]
         resources: ["nodes"]
         verbs: ["get", "list", "watch"]
       - apiGroups: [""]
         resources: ["nodes/proxy"]
         verbs: ["get"]
       - apiGroups: [""]
         resources: ["persistentvolumes"]
         verbs: ["create", "delete", "get", "list", "watch", "patch"]
       - apiGroups: [""]
         resources: ["replicationcontrollers"]
         verbs: ["list", "watch"]
       - apiGroups: [""]
         resources: ["resourcequotas"]
         verbs: ["create", "delete", "get", "list", "patch", "watch"]
       - apiGroups: [""]
         resources: ["services"]
         verbs: ["create", "delete", "get", "list", "patch", "update", "watch"]
       - apiGroups: ["apps"]
         resources: ["statefulsets"]
         verbs: ["create", "delete", "get", "list", "patch", "watch"]
       - apiGroups: ["apps"]
         resources: ["daemonsets"]
         verbs: ["create", "delete", "get", "patch"]
       - apiGroups: ["apps"]
         resources: ["deployments"]
         verbs: ["create", "delete", "get", "patch","update"]
       - apiGroups: ["autoscaling"]
         resources: ["horizontalpodautoscalers"]
         verbs: ["list", "watch"]
       - apiGroups: ["batch"]
         resources: ["jobs"]
         verbs: ["list", "watch", "create", "delete"]
       - apiGroups: ["batch"]
         resources: ["cronjobs"]
         verbs: ["create", "delete", "get", "list", "patch", "watch"]
       - apiGroups: ["extensions"]
         resources: ["daemonsets", "replicasets"]
         verbs: ["list", "watch"]
       - apiGroups: ["extensions"]
         resources: ["deployments"]
         verbs: ["create", "delete", "get", "list", "patch", "update", "watch"]
       - apiGroups: [""]
         resources: ["events"]
         verbs: ["create", "delete", "patch"]
       - apiGroups: ["extensions"]
         resources: ["ingresses"]
         verbs: ["create", "delete", "get", "patch"]
       - apiGroups: ["extensions"]
         resources: ["ingresses/status"]
         verbs: ["update"]
       - apiGroups: ["networking.k8s.io"]
         resources: ["ingresses"]
         verbs: ["get", "create", "delete", "patch"]
       - apiGroups: ["networking.k8s.io"]
         resources: ["ingresses/status"]
         verbs: ["update"]
       - apiGroups: ["networking.k8s.io"]
         resources: ["networkpolicies"]
         verbs: ["create", "delete", "get", "patch"]
       - apiGroups: ["rbac.authorization.k8s.io"]
         resources: ["rolebindings"]
         verbs: ["create", "delete", "get", "patch"]
       - apiGroups: ["authentication.k8s.io"]
         resources: ["tokenreviews"]
         verbs: ["create", "delete"]
       - apiGroups: ["authorization.k8s.io"]
         resources: ["subjectaccessreviews"]
         verbs: ["create", "delete"]
       - apiGroups: ["kubed.appscode.com"]
         resources: ["searchresults"]
         verbs: ["get"]
       - apiGroups: ["policy"]
         resources: ["poddisruptionbudgets"]
         verbs: ["create", "delete", "get"]
       ---
       apiVersion: rbac.authorization.k8s.io/v1
       kind: RoleBinding
       metadata:
         name: deployment-commander-rolebinding
         namespace: <your-namespace-name> # Should be namespace you are granting access to
       roleRef:
         apiGroup: rbac.authorization.k8s.io
         kind: Role
         name: deployment-commander-role # Should match name of Role
       subjects:
       - namespace: astronomer # Should match namespace where SA lives
         kind: ServiceAccount
         name: astronomer-commander # Should match service account name, above
       ```

2. Run `kubectl apply -f commander.yaml`
3. Repeat for every namespace you intend on adding to the pool

Please refer to the Kubernetes documentation for more information about [namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/), [roles](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#role-and-clusterrole) and [rolebindings](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding).

## Enable Pre-Created Namespace Pool, and Register Namespaces

1. Set the following values in your Astronomer Software `config.yaml`. Replace `namepsace-name*` with names of the namespaces you just created;

```yaml
global:
  # Make fluentd gather logs from all available namespaces
  manualNamespaceNamesEnabled: true
  clusterRoles: false

astronomer:
  houston:
    config:
      deployments:

        # Enable manual namespace names
        manualNamespaceNames: true
        # Pre-created namespace names
        preCreatedNamespaces:
          - name: <namespace-name1>
          - name: <namespace-name2>
          - name: <namespace-etc>

        # Allows users to immediately reuse a pre-created namespace by hard deleting the associated Deployment
        # If set to false, you'll need to wait until the cron job deletes the record from the database is added back to the pool
        hardDeleteDeployment: true

  commander:
    env:
      - name: "COMMANDER_MANUAL_NAMESPACE_NAMES"
        value: true
```

1. Save the changes in your `config.yaml` and update Astronomer Software as described in [Apply a Config Change](apply-platform-config.md)
2. You should now be able to create new Deployments using a namespace from the Pre-Created Namespace Pool

## Creating Deployments in Pre-Created Namespaces

After enabling the Pre-Created Namespace Pool, the namespaces you registered earlier will appear as an option when creating a new Deployment via the Software UI.

![Kubernetes Namespace option in the UI](https://assets2.astronomer.io/main/docs/astronomer-ui/kubernetes-namespace.png)

Alternatively, when users create deployments via the CLI, they will be prompted to select one of the available namespaces for their new Deployment.

If no namespaces are available, they will receive an error when creating new Deployments in both the CLI and UI. To reuse a pre-created namespace, they will first need to return the namespace to the pool by deleting the Deployment.

## Troubleshooting

### My Deployment is in an Unknown State

If a Deployment is not coming up, check the Commander pods for confirmation as to whether the Deployment commands have successfully executed or not. When using a Pre-Created Namespace Pool with scoped roles, it’s possible that the `astronomer-commander` service account does not have enough rights to perform a required action. If Commander was able to do its job, you should see the below reference:

```
time="2021-07-21T16:30:23Z" level=info msg="releaseName <release-name>, chart astronomer-ee/airflow,     chartVersion 0.20.0, namespace <your-namespace-name>" function=InstallRelease package=helm
time="2021-07-21T16:30:23Z" level=info msg="CHART PATH: /home/commander/.cache/helm/repository/airflow-    0.20.0.tgz\n" function=InstallRelease package=helm
```

If something went wrong, you may see a reference such as:

```
time="2022-02-17T22:52:40Z" level=error msg="serviceaccounts is forbidden: User \"system:serviceaccount:astronomer:astronomer-commander\" cannot create resource \"serviceaccounts\" in API group \"\" in the namespace <your-namespace>" function=InstallDeployment package=kubernetes
```

This example shows that Astronomer Software does not have the ability to create service accounts in the pre-created namespace. The role needs to be updated accordingly.

### My Namespace is not Returning to the Pool

Unless you are using hard deletes, pre-created namespaces may take several days to become available again after deleting the associated Deployment. To enable hard deletes, please refer to the [Delete a Deployment](configure-deployment.md#delete-a-deployment) docs.
