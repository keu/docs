---
sidebar_label: 'Custom Cloud Roles'
title: "Custom Cloud Roles"
id: custom-cloud-roles
description: Custom cloud roles used by Astro for Hybrid Runtimes
---
# Astro's Custom Cloud Roles

Our model for Hybrid Runtimes is based on access into a target cloud account. This access is performed using custom cloud IAM roles supporting all Astro features while only granting required permissions. The following sections describe the roles for each cloud provider.

## GCP

The following table lists Astro features the the permissions required for a fully managed service. It lists permissions used by the deployment user for Astro.

| Feature                                                      | Permission                                       |
| ------------------------------------------------------------ | ------------------------------------------------ |
| Block  devices for Astro compute and database instances are encrypted; keys are  managed in CloudKMS | cloudkms.cryptoKeys.create                       |
|                                                              | cloudkms.cryptoKeys.get                          |
|                                                              | cloudkms.keyRings.create                         |
|                                                              | cloudkms.keyRings.setIamPolicy                   |
| Astro  Runtime MetadataDBs are hosted on a cloud-native SQL instance. | cloudsql.instances.create                        |
|                                                              | cloudsql.instances.delete                        |
|                                                              | cloudsql.instances.get                           |
|                                                              | cloudsql.users.create                            |
|                                                              | cloudsql.users.delete                            |
| Required  to manage IP addresses of Astro nodes.             | compute.addresses.create                         |
|                                                              | compute.addresses.delete                         |
|                                                              | compute.addresses.get                            |
|                                                              | compute.addresses.list                           |
| Require  to manage a single public IP address for Astro Runtime Web/API ingress. | compute.globalAddresses.createInternal           |
|                                                              | compute.globalAddresses.deleteInternal           |
|                                                              | compute.globalAddresses.get                      |
|                                                              | compute.globalAddresses.use                      |
| Required  to enable our CRE team to assist you in enabling and managing VPN connections  to your data sources. | compute.externalVpnGateways.create               |
|                                                              | compute.externalVpnGateways.delete               |
|                                                              | compute.externalVpnGateways.get                  |
|                                                              | compute.externalVpnGateways.list                 |
|                                                              | compute.externalVpnGateways.setLabels            |
|                                                              | compute.externalVpnGateways.use                  |
|                                                              | compute.targetVpnGateways.create                 |
|                                                              | compute.targetVpnGateways.delete                 |
|                                                              | compute.targetVpnGateways.get                    |
|                                                              | compute.targetVpnGateways.list                   |
|                                                              | compute.targetVpnGateways.setLabels              |
|                                                              | compute.targetVpnGateways.use                    |
|                                                              | compute.vpnGateways.create                       |
|                                                              | compute.vpnGateways.delete                       |
|                                                              | compute.vpnGateways.get                          |
|                                                              | compute.vpnGateways.list                         |
|                                                              | compute.vpnGateways.setLabels                    |
|                                                              | compute.vpnGateways.use                          |
|                                                              | compute.vpnTunnels.create                        |
|                                                              | compute.vpnTunnels.delete                        |
|                                                              | compute.vpnTunnels.get                           |
|                                                              | compute.vpnTunnels.list                          |
|                                                              | compute.vpnTunnels.setLabels                     |
| Required  to manage firewalls supporting Astro VPC.          | compute.firewalls.create                         |
|                                                              | compute.firewalls.delete                         |
|                                                              | compute.firewalls.get                            |
| Creating  and managing the network infrastructure for all Astro nodes. | compute.globalForwardingRules.create   |
|                                                              | compute.globalForwardingRules.delete             |
|                                                              | compute.globalForwardingRules.get                |
|                                                              | compute.globalForwardingRules.pscCreate          |
|                                                              | compute.globalForwardingRules.pscDelete          |
|                                                              | compute.globalForwardingRules.pscSetLabels       |
|                                                              | compute.globalForwardingRules.setLabels          |
|                                                              | compute.networks.addPeering                      |
|                                                              | compute.networks.create                          |
|                                                              | compute.networks.delete                          |
|                                                              | compute.networks.get                             |
|                                                              | compute.networks.listPeeringRoutes               |
|                                                              | compute.networks.removePeering                   |
|                                                              | compute.networks.updatePeering                   |
|                                                              | compute.networks.updatePolicy                    |
|                                                              | compute.networks.use                             |
|                                                              | compute.routers.create                           |
|                                                              | compute.routers.delete                           |
|                                                              | compute.routers.get                              |
|                                                              | compute.subnetworks.create                       |
|                                                              | compute.subnetworks.delete                       |
|                                                              | compute.subnetworks.get                          |
| Used to  manage the status of deployments.                   | compute.globalOperations.get                     |
|                                                              | compute.regionOperations.get                     |
| Required  by our CRE team to ensure target deployment regions are accessible. | compute.regions.get                              |
|                                                              | compute.regions.list                             |
| Astro  comprises various Kubernetes extensions used to manage Airflow resources in a  cloud-native way. This requires permissions to add and manage custom API  objects and webhooks. | container.apiServices.create                     |
|                                                              | container.apiServices.delete                     |
|                                                              | container.apiServices.get                        |
|                                                              | container.apiServices.getStatus                  |
|                                                              | container.apiServices.list                       |
|                                                              | container.apiServices.update                     |
|                                                              | container.apiServices.updateStatus               |
|                                                              | container.customResourceDefinitions.create       |
|                                                              | container.customResourceDefinitions.delete       |
|                                                              | container.customResourceDefinitions.get          |
|                                                              | container.customResourceDefinitions.getStatus    |
|                                                              | container.customResourceDefinitions.list         |
|                                                              | container.customResourceDefinitions.update       |
|                                                              | container.customResourceDefinitions.updateStatus |
|                                                              | container.mutatingWebhookConfigurations.create   |
|                                                              | container.mutatingWebhookConfigurations.delete   |
|                                                              | container.mutatingWebhookConfigurations.get      |
|                                                              | container.mutatingWebhookConfigurations.list     |
|                                                              | container.mutatingWebhookConfigurations.update   |
|                                                              | container.thirdPartyObjects.create               |
|                                                              | container.thirdPartyObjects.delete               |
|                                                              | container.thirdPartyObjects.get                  |
|                                                              | container.thirdPartyObjects.list                 |
|                                                              | container.thirdPartyObjects.update               |
|                                                              | container.validatingWebhookConfigurations.create |
|                                                              | container.validatingWebhookConfigurations.delete |
|                                                              | container.validatingWebhookConfigurations.get    |
|                                                              | container.validatingWebhookConfigurations.list   |
|                                                              | container.validatingWebhookConfigurations.update |
| Required  to manage custom least privilege Kubernetes cluster roles for Astro  operation. | container.clusterRoleBindings.create             |
|                                                              | container.clusterRoleBindings.delete             |
|                                                              | container.clusterRoleBindings.get                |
|                                                              | container.clusterRoleBindings.list               |
|                                                              | container.clusterRoleBindings.update             |
|                                                              | container.clusterRoles.bind                      |
|                                                              | container.clusterRoles.create                    |
|                                                              | container.clusterRoles.delete                    |
|                                                              | container.clusterRoles.escalate                  |
|                                                              | container.clusterRoles.get                       |
|                                                              | container.clusterRoles.list                      |
|                                                              | container.clusterRoles.update                    |
|                                                              | container.serviceAccounts.create                 |
|                                                              | container.serviceAccounts.createToken            |
|                                                              | container.serviceAccounts.delete                 |
|                                                              | container.serviceAccounts.get                    |
|                                                              | container.serviceAccounts.list                   |
|                                                              | container.serviceAccounts.update                 |
|                                                              | container.roleBindings.create                    |
|                                                              | container.roleBindings.delete                    |
|                                                              | container.roleBindings.get                       |
|                                                              | container.roleBindings.list                      |
|                                                              | container.roleBindings.update                    |
|                                                              | container.roles.bind                             |
|                                                              | container.roles.create                           |
|                                                              | container.roles.delete                           |
|                                                              | container.roles.escalate                         |
|                                                              | container.roles.get                              |
|                                                              | container.roles.list                             |
|                                                              | container.roles.update                           |
| Required  to create and manage the Astro cluster hosting Astro Runtimes. | container.clusters.create                        |
|                                                              | container.clusters.delete                        |
|                                                              | container.clusters.get                           |
|                                                              | container.clusters.update                        |
| Astro  offers customers comprehensive secret and configuration management  capabilities. The listed permissions are required to translate those  transparently into underlying Kubernetes primitives. | container.configMaps.create                      |
|                                                              | container.configMaps.delete                      |
|                                                              | container.configMaps.get                         |
|                                                              | container.configMaps.list                        |
|                                                              | container.configMaps.update                      |
|                                                              | container.secrets.create                         |
|                                                              | container.secrets.delete                         |
|                                                              | container.secrets.get                            |
|                                                              | container.secrets.list                           |
|                                                              | container.secrets.update                         |
| Required  permissions to manage Astro and Astro Runtime workloads within the cluster. | container.daemonSets.create                      |
|                                                              | container.daemonSets.delete                      |
|                                                              | container.daemonSets.get                         |
|                                                              | container.daemonSets.getStatus                   |
|                                                              | container.daemonSets.list                        |
|                                                              | container.daemonSets.update                      |
|                                                              | container.daemonSets.updateStatus                |
|                                                              | container.deployments.create                     |
|                                                              | container.deployments.delete                     |
|                                                              | container.deployments.get                        |
|                                                              | container.deployments.getScale                   |
|                                                              | container.deployments.getStatus                  |
|                                                              | container.deployments.list                       |
|                                                              | container.deployments.rollback                   |
|                                                              | container.deployments.update                     |
|                                                              | container.deployments.updateScale                |
|                                                              | container.deployments.updateStatus               |
|                                                              | container.namespaces.create                      |
|                                                              | container.namespaces.delete                      |
|                                                              | container.namespaces.finalize                    |
|                                                              | container.namespaces.get                         |
|                                                              | container.namespaces.getStatus                   |
|                                                              | container.namespaces.list                        |
|                                                              | container.namespaces.update                      |
|                                                              | container.namespaces.updateStatus                |
|                                                              | container.operations.get                         |
|                                                              | container.priorityClasses.create                 |
|                                                              | container.priorityClasses.delete                 |
|                                                              | container.priorityClasses.get                    |
|                                                              | container.priorityClasses.list                   |
|                                                              | container.priorityClasses.update                 |
| Astro  workloads are hardened which is enforced by corresponding policies. The  listed permissions are required to manage the policies. | container.podSecurityPolicies.create             |
|                                                              | container.podSecurityPolicies.delete             |
|                                                              | container.podSecurityPolicies.get                |
|                                                              | container.podSecurityPolicies.list               |
|                                                              | container.podSecurityPolicies.update             |
|                                                              | container.podSecurityPolicies.use                |
| Required  to manage the Kubernetes-internal overlay network. | container.ingresses.create                       |
|                                                              | container.ingresses.delete                       |
|                                                              | container.ingresses.get                          |
|                                                              | container.ingresses.getStatus                    |
|                                                              | container.ingresses.list                         |
|                                                              | container.ingresses.update                       |
|                                                              | container.ingresses.updateStatus                 |
|                                                              | container.services.create                        |
|                                                              | container.services.delete                        |
|                                                              | container.services.get                           |
|                                                              | container.services.getStatus                     |
|                                                              | container.services.list                          |
|                                                              | container.services.proxy                         |
|                                                              | container.services.update                        |
|                                                              | container.services.updateStatus                  |
| Astro  deployments leverage cloud-native orchestration and infrastructure-as-code  capabilities. The listed privileges are required to access those. | deploymentmanager.deployments.cancelPreview      |
|                                                              | deploymentmanager.deployments.create             |
|                                                              | deploymentmanager.deployments.delete             |
|                                                              | deploymentmanager.deployments.get                |
|                                                              | deploymentmanager.deployments.list               |
|                                                              | deploymentmanager.deployments.stop               |
|                                                              | deploymentmanager.deployments.update             |
|                                                              | deploymentmanager.manifests.get                  |
|                                                              | deploymentmanager.manifests.list                 |
|                                                              | deploymentmanager.operations.get                 |
|                                                              | deploymentmanager.operations.list                |
|                                                              | deploymentmanager.resources.get                  |
|                                                              | deploymentmanager.resources.list                 |
|                                                              | deploymentmanager.typeProviders.create           |
|                                                              | deploymentmanager.typeProviders.delete           |
|                                                              | deploymentmanager.typeProviders.get              |
|                                                              | deploymentmanager.typeProviders.getType          |
|                                                              | deploymentmanager.typeProviders.list             |
|                                                              | deploymentmanager.typeProviders.listTypes        |
|                                                              | deploymentmanager.typeProviders.update           |
|                                                              | deploymentmanager.types.create                   |
|                                                              | deploymentmanager.types.delete                   |
|                                                              | deploymentmanager.types.get                      |
|                                                              | deploymentmanager.types.list                     |
|                                                              | deploymentmanager.types.update                   |
| Astro  creates DNS entries for the network ingress.          | dns.changes.create                               |
|                                                              | dns.changes.get                                  |
|                                                              | dns.managedZones.create                          |
|                                                              | dns.managedZones.delete                          |
|                                                              | dns.managedZones.get                             |
|                                                              | dns.managedZones.list                            |
|                                                              | dns.managedZones.update                          |
|                                                              | dns.resourceRecordSets.create                    |
|                                                              | dns.resourceRecordSets.delete                    |
|                                                              | dns.resourceRecordSets.list                      |
| Astro  creates purpose-bound least privilege roles for individual services,  requiring the listing privileges. | iam.roles.create                                 |
|                                                              | iam.roles.delete                                 |
|                                                              | iam.roles.get                                    |
|                                                              | iam.roles.list                                   |
|                                                              | iam.roles.update                                 |
| Astro  creates log data for customers and their DAGs in the cloud account for easy  accessibility. | logging.buckets.get                              |
|                                                              | logging.buckets.list                             |
|                                                              | logging.exclusions.get                           |
|                                                              | logging.exclusions.list                          |
|                                                              | logging.links.get                                |
|                                                              | logging.links.list                               |
|                                                              | logging.locations.get                            |
|                                                              | logging.locations.list                           |
|                                                              | logging.logEntries.list                          |
|                                                              | logging.logMetrics.get                           |
|                                                              | logging.logMetrics.list                          |
|                                                              | logging.logs.list                                |
|                                                              | logging.logServiceIndexes.list                   |
|                                                              | logging.logServices.list                         |
|                                                              | logging.operations.get                           |
|                                                              | logging.operations.list                          |
|                                                              | logging.queries.create                           |
|                                                              | logging.queries.delete                           |
|                                                              | logging.queries.get                              |
|                                                              | logging.queries.list                             |
|                                                              | logging.queries.listShared                       |
|                                                              | logging.queries.update                           |
|                                                              | logging.sinks.get                                |
|                                                              | logging.sinks.list                               |
|                                                              | logging.usage.get                                |
|                                                              | logging.views.get                                |
|                                                              | logging.views.list                               |
| Required  to determine whether all required GCP services are available. | servicemanagement.services.get                   |
|                                                              | servicemanagement.services.list                  |
|                                                              | serviceusage.quotas.get                          |
|                                                              | serviceusage.services.get                        |
|                                                              | serviceusage.services.list                       |
| Astro  publishes log data to native cloud storage for consumption by the customer. | storage.objects.create                           |
|                                                              | storage.objects.delete                           |
|                                                              | storage.objects.get                              |
|                                                              | storage.objects.list                             |
|                                                              | storage.objects.update                           |
| Required  by Astronomer's CRE team to assisst customers with migrations. | storage.buckets.get                              |
|                                                              | storagetransfer.jobs.create                      |
|                                                              | storagetransfer.jobs.delete                      |
|                                                              | storagetransfer.jobs.get                         |
|                                                              | storagetransfer.jobs.list                        |
|                                                              | storagetransfer.jobs.run                         |
|                                                              | storagetransfer.jobs.update                      |
| Required  to determine whether Astro has access into the dataplane account. | resourcemanager.projects.getIamPolicy            |
| Required  to assign custom roles to newly created service accounts. | resourcemanager.projects.setIamPolicy            |
| Required  to gather information about the used project for troubleshooting | resourcemanager.projects.get                     |

Astro on GCP leverages [GCP's Resource Manager](https://cloud.google.com/resource-manager) to deploy services in a standardized and reproducible way following the cloud provider's best practices. Resource Manager utilizes a built-in GCP account for its deployment, [Google API Service Agent](https://cloud.google.com/compute/docs/access/service-accounts#google_apis_service_agent). This service agent will be used by any Resource Manager deployment, however, the table below describes the permissions used by Astro's custom Service Agent role: 

| Feature                                                      | Permission                                  |
| ------------------------------------------------------------ | ------------------------------------------- |
| Create  and manage compute resources for Astro cluster.      | compute.disks.create                        |
|                                                              | compute.disks.delete                        |
|                                                              | compute.disks.get                           |
|                                                              | compute.disks.list                          |
|                                                              | compute.disks.setLabels                     |
|                                                              | compute.disks.update                        |
|                                                              | compute.disks.use                           |
|                                                              | compute.instanceGroups.update               |
|                                                              | compute.instances.attachDisk                |
|                                                              | compute.instances.create                    |
|                                                              | compute.instances.createTagBinding          |
|                                                              | compute.instances.delete                    |
|                                                              | compute.instances.deleteTagBinding          |
|                                                              | compute.instances.detachDisk                |
|                                                              | compute.instances.get                       |
|                                                              | compute.instances.list                      |
|                                                              | compute.instances.listTagBindings           |
|                                                              | compute.instances.setLabels                 |
|                                                              | compute.instances.setMachineType            |
|                                                              | compute.instances.setMetadata               |
|                                                              | compute.instances.setName                   |
|                                                              | compute.instances.setServiceAccount         |
|                                                              | compute.instances.setTags                   |
|                                                              | compute.instances.update                    |
|                                                              | compute.instances.updateNetworkInterface    |
|                                                              | compute.instances.use                       |
|                                                              | compute.networks.list                       |
|                                                              | compute.subnetworks.list                    |
|                                                              | compute.subnetworks.update                  |
|                                                              | compute.subnetworks.use                     |
| Manage  DNS entries for both ingress and cluster-internal.   | dns.changes.list                            |
|                                                              | dns.dnsKeys.get                             |
|                                                              | dns.dnsKeys.list                            |
|                                                              | dns.gkeClusters.bindDNSResponsePolicy       |
|                                                              | dns.gkeClusters.bindPrivateDNSZone          |
|                                                              | dns.managedZoneOperations.get               |
|                                                              | dns.managedZoneOperations.list              |
|                                                              | dns.managedZones.getIamPolicy               |
|                                                              | dns.networks.bindDNSResponsePolicy          |
|                                                              | dns.networks.bindPrivateDNSPolicy           |
|                                                              | dns.networks.bindPrivateDNSZone             |
|                                                              | dns.networks.targetWithPeeringZone          |
|                                                              | dns.networks.useHealthSignals               |
|                                                              | dns.policies.create                         |
|                                                              | dns.policies.delete                         |
|                                                              | dns.policies.get                            |
|                                                              | dns.policies.getIamPolicy                   |
|                                                              | dns.policies.list                           |
|                                                              | dns.policies.update                         |
|                                                              | dns.projects.get                            |
|                                                              | dns.resourceRecordSets.get                  |
|                                                              | dns.resourceRecordSets.update               |
|                                                              | dns.responsePolicies.create                 |
|                                                              | dns.responsePolicies.delete                 |
|                                                              | dns.responsePolicies.get                    |
|                                                              | dns.responsePolicies.list                   |
|                                                              | dns.responsePolicies.update                 |
|                                                              | dns.responsePolicyRules.create              |
|                                                              | dns.responsePolicyRules.delete              |
|                                                              | dns.responsePolicyRules.get                 |
|                                                              | dns.responsePolicyRules.list                |
|                                                              | dns.responsePolicyRules.update              |
|                                                              | cloudasset.assets.listDnsManagedZones       |
| GKE  mapped Kubernetes service accounts to GKE IAM service accounts. The listed  permissions are required to create custom Kubernetes service accounts. | iam.serviceAccounts.actAs                   |
|                                                              | iam.serviceAccounts.create                  |
|                                                              | iam.serviceAccounts.delete                  |
|                                                              | iam.serviceAccounts.get                     |
|                                                              | iam.serviceAccounts.getIamPolicy            |
|                                                              | iam.serviceAccounts.list                    |
|                                                              | iam.serviceAccounts.setIamPolicy            |
|                                                              | iam.serviceAccounts.update                  |
| Service  discovery and management of all Astro and Astro Runtime services. | servicedirectory.namespaces.create          |
|                                                              | servicedirectory.namespaces.delete          |
|                                                              | servicedirectory.namespaces.get             |
|                                                              | servicedirectory.namespaces.list            |
|                                                              | servicedirectory.namespaces.update          |
|                                                              | servicenetworking.services.addPeering       |
|                                                              | servicenetworking.services.addSubnetwork    |
|                                                              | servicenetworking.services.deleteConnection |
|                                                              | servicenetworking.services.get              |
|                                                              | servicenetworking.services.use              |
| Creation  and management of storage buckets for log data which is provided to the  customer about their cluster and DAG states. | storage.buckets.create                      |
|                                                              | storage.buckets.createTagBinding            |
|                                                              | storage.buckets.delete                      |
|                                                              | storage.buckets.deleteTagBinding            |
|                                                              | storage.buckets.getIamPolicy                |
|                                                              | storage.buckets.list                        |
|                                                              | storage.buckets.listEffectiveTags           |
|                                                              | storage.buckets.listTagBindings             |
|                                                              | storage.buckets.setIamPolicy                |
|                                                              | storage.buckets.update                      |