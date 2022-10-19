---
sidebar_label: 'Architecture'
title: 'Astro architecture'
id: astro-architecture
description: Astro uses a multi-plane structure to help make Airflow more secure and reliable. Use this doc to learn how the control plane and data plane work together on the cloud.
---


Astro uses a multi-plane structure to help make Airflow more secure and reliable. The control plane is entirely managed and hosted by Astronomer, while the data plane can run in either your cloud or Astronomer's cloud. The following diagram outlines how the control plane, data plane, and users are connected to enable Astro.

![Astro architecture overview](/img/docs/architecture-overview.png)

