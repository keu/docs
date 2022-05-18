---
sidebar_label: 'Configure the CLI'
title: 'Configure the Astro CLI'
id: configure-cli
description: Install, upgrade, and manage settings for the Astro CLI.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {siteVariables} from '@site/src/versions';

## Install the CLI

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


## Upgrade the CLI
