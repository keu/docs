---
sidebar_label: 'HIPAA compliance'
title: "HIPAA compliance"
id: hipaa-compliance
description: Learn how Astronomer and Astro are HIPAA compliant.
---

The Health Insurance Portability and Accountability Act of 1996 (HIPAA) is United States legislation that provides data privacy and security provisions for safeguarding protected health information (PHI).

HIPAA applies to organizations that are classified as covered entities, as well as other persons or businesses, known as business associates, that provide services with the handling, transmission, storage, or processing of PHI data. By providing the managed service Astro for data orchestration of PHI data for a HIPAA covered entity or business associate, Astronomer becomes a business associate under HIPAA.

HIPAA requires covered entities or business associates that work with other business associates to produce a contract that imposes specific safeguards on the PHI that the business associate uses or discloses to provide services to a covered entity. The contract is known as a Business Associate Agreement (BAA).

## PHI data processing on the Astro data plane

Upon signing of a HIPAA Business Associate Agreement (BAA), Astronomer permits the processing of PHI data in the Astro data plane. A signed BAA between Astronomer and you, the customer, helps support your HIPAA compliance program, but it is your responsibility to have required internal processes and a security program in place that align with HIPAA requirements. Compliance with HIPAA on Astro is a shared responsibility as outlined in the BAA and the model documented below.

## Shared Responsibility Model for HIPAA compliance

Astro operates on a model of shared responsibility, which means that Astronomer employees and Astronomer customers are equally responsible for ensuring platform security and compliance. This document expands on the general [shared responsibility model](https://docs.astronomer.io/astro/shared-responsibility-model) to include specific responsibilities for HIPAA compliance. Maintaining HIPAA compliance is a joint effort that is shared by the public cloud providers, Astronomer, and the customer. Each party must fufill their individual obligations to ensure HIPAA compliance.

This document references the Astro control and data planes, which are core parts of the Astronomer hybrid deployment model:

- The control plane provides end-to-end visibility, control, and management of users, workspaces, deployments, metrics, and logs.
- The data plane is the single tenant foundation in your cloud and orchestrates your data pipelines on Astro Runtime deployments.

### Astronomer obligations

- Provide single-tenant data plane to ensure PHI data processed in the data plane is not shared or accessible by other customers.
- Provide data plane cloud infrastructure options and configuration that enforce encryption in-transit and at rest.
- Encrypt data in transit between Control and data plane.
- Encrypt data at rest in Control and data plane.
- Monitor Control and data planes for but not limited to unauthorized access, malicious activity, intrusions and threats at runtime, and unauthorized configuration changes.
- Deprovision compute and data resources when they are no longer required for task execution, so that the cloud provider can permanently remove the compute and data resources.
- Execute data plane cluster deletion when instructed by customer, so that the cloud provider can permanently remove the compute and data resources.

### Customer obligations

- Execute a Business Associate Agreement (BAA) with your public cloud provider to process PHI on cloud infrastructure.
- [Configure an Identity Provider](https://docs.astronomer.io/astro/configure-idp) (IdP) for single sign on to your Astro Organization.
- Use a [supported](https://docs.astronomer.io/astro/runtime-version-lifecycle-policy#astro-runtime-lifecycle-schedule) (preferably latest patch) version of [Astro Runtime](https://docs.astronomer.io/astro/runtime-image-architecture), to take advantage of the most recent security features and fixes.
- Use [supported and compatible versions](https://github.com/apache/airflow/blob/main/README.md#release-process-for-providers) of Airflow [Providers](https://registry.astronomer.io/providers/?page=1), to take advantage of the most recent security features and fixes.
- Create a [secrets backend](https://docs.astronomer.io/astro/secrets-backend) to access sensitive information and secrets from your data pipelines that will be used to access PHI. If you do not have a secrets backend, you must [store your environment variables as secrets](https://docs.astronomer.io/astro/environment-variables#set-environment-variables-via-the-cloud-ui).
- Ensure all PHI data that is orchestrated or processed by the data plane is encrypted at rest and in transit at all times using modern cryptographic protocols and ciphers, and at no point can be read in clear text. For example, when reading data from an RDS instance, transforming it in the data plane, and writing it out to an S3 bucket.
- Do not output PHI to [Scheduler](https://docs.astronomer.io/astro/view-logs#view-airflow-scheduler-logs) and/or [Task](https://docs.astronomer.io/astro/view-logs#view-airflow-task-logs) logs, especially in clear text.
- Do not store PHI as part of your DAG image or code.
- Do not store unencrypted PHI in XComs. Ensure encrypted PHI stored in XComs for task execution is purged following task execution.
- Ensure your [lineage metadata](https://docs.astronomer.io/astro/set-up-data-lineage) does not contain any PHI.
- Do not add, delete or modify data plane infrastructure that is provisioned and managed by Astronomer as that may be a violation of HIPAA. For example, disabling encryption of the S3 database (AWS), Cloud Storage (GCP), or Storage Account (Azure).

### Cloud provider responsibilities:

- Comply with the business associate obligations outlined in the BAA between Astronomer and cloud provider, and between the customer and cloud provider.
- Provide cloud infrastructure, specifically virtual machines, that support HIPAA compliance:
    - AWS: hardware-enabled encryption at rest and in transit with [EC2 Nitro instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html#ec2-nitro-instances)
    - GCP: [Shielded GKE nodes](https://cloud.google.com/kubernetes-engine/docs/how-to/shielded-gke-nodes) leveraging built in encryption [at rest](https://cloud.google.com/docs/security/encryption/default-encryption) and [in transit](https://cloud.google.com/docs/security/encryption-in-transit) cluster features
    - Azure: AKS managed [Virtual Machine Scale Sets](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/overview) (VMSS) leveraging built in encryption [at rest](https://docs.microsoft.com/en-us/azure/security/fundamentals/encryption-overview#encryption-of-data-at-rest) and [in transit](https://docs.microsoft.com/en-us/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit) cluster features
- Permanently delete and remove data disks, databases, object storage, and encryption keys when released or deleted by Astro.