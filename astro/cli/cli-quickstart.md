---
sidebar_label: 'Install the CLI'
title: 'Install the Astro CLI'
id: cli-quickstart
description: Install the Astro CLI, the best way to run Apache Airflow and test data pipelines on your local machine.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {siteVariables} from '@site/src/versions';

## Overview

The Astro CLI is the easiest way to run Apache Airflow on your machine.

From the CLI, you can run a local Apache Airflow environment with a dedicated Webserver, Scheduler and Postgres Database. Once you create an Astro project, you can easily customize it (e.g. add Python or OS-level packages, plugins etc.) and test it on your local machine.

## Prerequisites

To use the Astro CLI on Mac, you must have:

- [Homebrew](https://brew.sh/)
- [Docker Desktop](https://docs.docker.com/get-docker/) (v18.09 or higher).

To use the Astro CLI on Windows or Linux, you must have:

- [Docker Engine](https://docs.docker.com/engine/install/) (v0.13.1 or higher).

## Step 1: Install the Astro CLI

<Tabs
    defaultValue="mac"
    values={[
        {label: 'Mac', value: 'mac'},
        {label: 'Windows', value: 'windows'},
        {label: 'Linux', value: 'linux'},
    ]}>
<TabItem value="mac">

Install the Astro CLI by running the following command:

```sh
brew install astronomer/cloud/astro
```

</TabItem>

<TabItem value="windows">

1. In a PowerShell terminal, create a new directory for your Astro project and set it as your current directory:

    ```powershell
    mkdir my-project && cd my-project
    ```

2. Based on your CPU, run one of the following commands to download the Astro CLI executable into your project directory.

    - AMD64:

        <pre><code parentName="pre">{`Invoke-WebRequest -Uri https://goreleaserdev.blob.core.windows.net/goreleaser-test-container/releases/v${siteVariables.cliVersion}/cloud-cli_${siteVariables.cliVersion}_Windows_x86_64.tar.gz -o astrocli.tar.gz`}</code></pre>

    - ARM64:

        <pre><code parentName="pre">{`Invoke-WebRequest -Uri https://goreleaserdev.blob.core.windows.net/goreleaser-test-container/releases/v${siteVariables.cliVersion}/cloud-cli_${siteVariables.cliVersion}_Windows_arm64.tar.gz -OutFile astrocli.tar.gz`}</code></pre>

3. Run the following command to unzip the executable:

    ```sh
    tar -xvzf .\astrocli.tar.gz
    ```

4. To run the executable without specifying its file path, save `astro.exe` in a secure location on your machine and add its filepath in the Windows PATH environment variable. For more information about configuring the PATH environment variable, read [Java documentation](https://www.java.com/en/download/help/path.html).

</TabItem>

<TabItem value="linux">

1. In a Linux terminal, create a new directory for your Astro project and set it as your current directory:

    ```sh
    mkdir my-project && cd my-project
    ```

2. Based on your CPU, run one of the following commands to download the Astro CLI executable into your project directory.

    - AMD64:

        <pre><code parentName="pre">{`curl https://goreleaserdev.blob.core.windows.net/goreleaser-test-container/releases/v${siteVariables.cliVersion}/cloud-cli_${siteVariables.cliVersion}_Linux_x86_64.tar.gz -o astrocli.tar.gz`}</code></pre>

    - ARM64:

        <pre><code parentName="pre">{`curl https://goreleaserdev.blob.core.windows.net/goreleaser-test-container/releases/v${siteVariables.cliVersion}/cloud-cli_${siteVariables.cliVersion}_Linux_arm64.tar.gz -o astrocli.tar.gz`}</code></pre>

3. Run the following command to unzip the executable:

    ```sh
    tar xzf astrocli.tar.gz
    ```

4. To run the executable without specifying its file path, save `astro` in a secure location on your machine and add its filepath in the Linux `$PATH` environment variable. For more information about configuring the PATH environment variable, read [Java documentation](https://www.java.com/en/download/help/path.html).

</TabItem>

</Tabs>

## Step 2: Confirm the Install

To confirm the CLI was installed properly, run the following CLI command:

```
astro version
```

If the installation was successful, you should see the following output:

<pre><code parentName="pre">{`% astro version
Astro CLI Version: ${siteVariables.cliVersion}`}</code></pre>

## Step 3: Create an Astro Project

The CLI can create an Astro project which contains all of the files you need to run Airflow locally. To create a new Astro project:

1. Create a new directory for your Astro project:

    ```sh
    mkdir <your-astro-project-name>
    ```

2. Open the directory:

    ```sh
    cd <your-astro-project-name>
    ```

3. Run the following Astro CLI command to initialize an Astro project in the directory:

    ```sh
    astro dev init
    ```

    This command generates all of the necessary files to run Airflow locally, including Docker configurations and example DAGs.

## Step 4: Run Airflow Locally

To confirm that you successfully initialized an Astro project, run the following command from your project directory:

```sh
astro dev start
```

This command builds your project and spins up 3 Docker containers on your machine, each for a different Airflow component:

- **Postgres:** Airflow's metadata database
- **Webserver:** The Airflow component responsible for rendering the Airflow UI
- **Scheduler:** The Airflow component responsible for monitoring and triggering tasks
- **Triggerer:** The Airflow component responsible for running Triggers and signaling tasks to resume when their conditions have been met. The Triggerer is used exclusively for tasks that are run with [deferrable operators](deferrable-operators.md)

## Step 5: Access the Airflow UI

Once your project builds successfully, you can access the Airflow UI by going to `http://localhost:8080/` and logging in with `admin` for both your username and password.

:::info

It might take a few minutes for the Airflow UI to be available. As you wait for the Webserver container to start up, you might need to refresh your browser.

:::

After logging in, you should see the DAGs from your `dags` directory in the Airflow UI.

<div class="text--center">
<img src="/img/docs/sample-dag.png" alt="Example DAG in the Airflow UI" />
</div>

That's all it takes to run Airflow locally using Astro! From here, you can manage your entire local Airflow environment directly for your Astro project.

## Next Steps

Once you install the CLI, there are a few different paths you can take:

- To learn more about the available commands in the CLI, see the [CLI Command Reference] or run `astro help`.
- To develop your Astro project and configure your local Airflow environment, see [Develop Project](develop-project.md).
- If you're ready to deploy your project to a production environment on Astro, see [Deploy Code](deploy-code.md).
