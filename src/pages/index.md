---
title: 'Astronomer Docs'
id: home
slug: /
description: 'Learn everything you need to know about Astro and Apache Airflow™'
---

import LinkCardGrid from '@site/src/components/LinkCardGrid';
import LinkCard from '@site/src/components/LinkCard';
import AstroCard from '@site/src/components/AstroCard';

<img src="/img/home-logos@2x.png" width="145" height="48" style={{marginBottom: "0.5rem"}} />

# Astronomer Docs

<p class="DocItem__header-description">Learn everything you need to know about Astro and Apache Airflow™</p>

---

<AstroCard />

## Getting started

<LinkCardGrid>
  <LinkCard topIcon label="Get started with the Astro CLI" description="The Astro CLI is the command line interface for data orchestration. It's the easiest way to get started with Apache Airflow and can be used with all Astronomer products." href="/learn/get-started-with-airflow" icon="/img/code-icon.svg" />
  <LinkCard topIcon label="Understand Airflow concepts" description="Learn about the fundamentals of how Airflow works and best practices for running it at scale." href="/learn/category/concepts" icon="/img/airflow-logo-85x85.png" />
  <LinkCard topIcon label="Explore tutorials" description="Follow step-by-step instructions to get Airflow up and running for any use case." href="/learn/category/tutorials" icon="/img/doc-icon.svg" />
</LinkCardGrid>

## What's new?

<LinkCardGrid>
  <LinkCard truncate label="Use the Astro Python SDK" description="Write a DAG with the Astro Python SDK" href="/learn/get-started-with-airflow" />
  <LinkCard truncate label="Deploy code" description="Deploy Code to Astro" href="/learn/get-started-with-airflow" />
  <LinkCard truncate label="Release notes" description="Astro CLI release notes" href="/learn/get-started-with-airflow" />
</LinkCardGrid>
