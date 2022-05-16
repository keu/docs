---
sidebar_label: 'CLI Command Reference'
title: 'Astro CLI Command Reference'
id: cli-reference
description: Learn about every command that you can run with the Astro CLI.
---

import {siteVariables} from '@site/src/versions';

## Overview

The Astro CLI is the easiest way to run Apache Airflow on your local machine. From the CLI, you can run a local Apache Airflow environment with a dedicated Webserver, Scheduler and Postgres Database. If you're an Astro user, you can also create and manage users, Workspaces, Deployments, and more.

This document contains information about all commands and settings available in the Astro CLI, including examples and flags. To install the Astro CLI, see [Install the CLI](install-cli.md).

:::info

All reference documentation is based on the latest available version of the Astro CLI. To see the differences across various CLI versions, see the [Astro CLI Release Notes](cli-release-notes.md).

:::

## Core Commands

We expect that you'll use these commands most often when managing your Astro projects and Deployments:

- [`astro auth login`](cli-reference/astro-auth-login.md)
- [`astro dev init`](cli-reference/astro-dev-init.md)
- [`astro dev start`](cli-reference/astro-dev-start.md)
- [`astro dev stop`](cli-reference/astro-dev-stop.md)
- [`astro deploy`](cli-reference/astro-deploy.md)

Each of these commands has a dedicated documentation page with additional notes and examples. As we expand functionality for the Astro CLI, new commands will be listed here.

## Global Options

The Astro CLI has one global flag that can be used with any command:

- `-h`, `--help`: Output more information about a given command to the CLI.
