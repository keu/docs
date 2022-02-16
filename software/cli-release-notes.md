---
sidebar_label: 'Astronomer Software CLI'
title: 'Astronomer Software CLI Release Notes'
id: cli-release-notes
description: Release notes for the Astronomer Software CLI.
---

## Overview

<<<<<<< HEAD:software/cli-release-notes.md
This document provides a summary of all changes made to the [Astronomer Software CLI](cli-quickstart.md). For general product release notes, go to [Astronomer Software Release Notes](release-notes.md).
=======
This document provides a summary of all changes made to the [Astronomer CLI](cli-quickstart.md) for the v0.28.x series of Astronomer Enterprise. For general product release notes, go to [Astronomer Enterprise Release Notes](release-notes.md).
>>>>>>> 419ab29de486ef0d6398c21630351fa7d179ea0c:enterprise/cli-release-notes.md

If you have any questions or a bug to report, don't hesitate to reach out to us via Slack or Intercom. We're here to help.

## 0.28.0

<<<<<<< HEAD:software/cli-release-notes.md
Release date: January 21, 2022

### Improvements to the Local Development Experience

:::danger Breaking Change

The latest version of the Astronomer Software CLI uses Docker engine `1.13.1` to run Airflow locally via `astro dev`. If you haven't done so already, ensure that your version of Docker Engine is at least `1.13.1` before upgrading the Astronomer Software CLI to v0.27.2. If your Docker Engine version is `<1.13.1`, then `astro dev` commands will not work on your local machine.

:::

Astronomer Software CLI v0.27.2 includes several improvements to the local development experience:

- You can now run `astro dev start` with Docker Buildkit enabled. This resolves a [common issue](https://forum.astronomer.io/t/buildkit-not-supported-by-daemon-error-command-docker-build-t-airflow-astro-bcb837-airflow-latest-failed-failed-to-execute-cmd-exit-status-1/857) where users with Docker Buildkit enabled experienced an error that prevented them from running this command.
- You can now run a Triggerer in a local Airflow environment. This means that you can test DAGs that use [deferrable operators](https://airflow.apache.org/docs/apache-airflow/stable/concepts/deferring.html) locally before pushing them to a Deployment on Astronomer. Triggerer logs appear alongside Webserver and Scheduler logs when you run `astro dev logs`. Note that the Triggerer can run only in environments running Astronomer Certified 2.2.0+.
- The Docker containers for the Scheduler, Webserver, and Triggerer now have standard names that persist after restarting your environment. You can check the names of these containers in your local Airflow environment by running `astro dev ps`:

    ```sh
    $ astro dev ps

    Name				State		Ports
    webserver			running		8080
    triggerer			running		
    scheduler			running		
    0.27.2_a64c1a-postgres-1	running		5432
    ```

    To change the default names of these containers, run `astro config set <airflow-component>.container_name <new-component-container-name>`.

### Additional Improvements

- The Astronomer Software CLI can now be [installed](cli-quickstart.md) on machines with an [Apple M1 chip](https://www.apple.com/newsroom/2020/11/apple-unleashes-m1/) via both curl and Homebrew.
=======
Release date: February 15, 2022

### Additional Improvements

- After successfully pushing code to a Deployment via `astro deploy`, the CLI now provides a URL that you can use to directly access that Deployment via the UI.
- You can now retrieve Triggerer logs using `astro deployment logs triggerer`.
>>>>>>> 419ab29de486ef0d6398c21630351fa7d179ea0c:enterprise/cli-release-notes.md

### Bug Fixes

- Fixed an issue where some objects specified in `airflow_settings.yaml` were not rendered after running `astro dev start`
- Fixed an issue where environment variables in `docker-compose.override.yml` were not correctly applied after running `astro dev start`
