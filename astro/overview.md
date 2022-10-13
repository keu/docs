---
sidebar_label: 'Overview'
title: 'Astro Documentation'
id: overview
slug: /
description: Everything you need to know about Astronomer’s modern data orchestration tool for the cloud, powered by Apache Airflow.
---
import LinkCardGrid from '@site/src/components/LinkCardGrid';
import LinkCard from '@site/src/components/LinkCard';
import AstroCard from '@site/src/components/AstroCard';

<p class="DocItem__header-description">Everything you need to know about Astronomer’s modern data orchestration tool for the cloud, powered by Apache Airflow.</p>

<AstroCard />

## Run on the cloud

<LinkCardGrid>
  <LinkCard topIcon label="Create a deployment" description="A deployment is an instance of Apache Airflow." href="/astro/create-deployment" icon="/img/deployment.svg" />
  <LinkCard topIcon label="Deploy Code" description="Get your DAGs up and running on Airflow." href="/astro/deploy-code" icon="/img/code.svg" />
  <LinkCard topIcon label="Automate with CI/CD" description="Push code and deploy to Airflow on Astronomer." href="/astro/ci-cd" icon="/img/automation.svg" />
</LinkCardGrid>

## Not sure where to start?

<LinkCardGrid>
  <LinkCard label="Get started with Apache Airflow" description="Learn how to run Apache Airflow locally with open source tools." href="/learn/get-started-with-airflow" icon="/img/airflow-logo.png" />
  <LinkCard label="Write a DAG with the Astro Python SDK" description="Learn how to write an ETL pipeline with the Astro Python SDK." href="/learn/astro-python-sdk" icon="/img/astro-monogram.svg" />
</LinkCardGrid>

## Featured Astro docs

<LinkCardGrid>
  <LinkCard truncate label="Create a project" description="Create all of the necessary files to run Airflow locally or on Astro." href="/astro/create-project" />
  <LinkCard truncate label="CI/CD" description="Automate code deploys to Astro using templates for popular CI/CD tools." href="/astro/ci-cd" />
  <LinkCard truncate label="Add and remove Astro users" description="Manage your team's roles and permissions on Astro." href="/astro/add-user" />
</LinkCardGrid>
