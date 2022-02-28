---
sidebar_label: "astrocloud dev pytest"
title: "astrocloud dev pytest"
id: astrocloud-dev-pytest
description: Reference documentation for astrocloud dev pytest.
---

## Description

Run pytests from the `test` folder of your Astro project. After you run this command, the CLI spins up Python environment that includes your DAG code, requirements, and Runtime image. The CLI then runs all pytests in your `tests` directory and shows you the results of these tests in your terminal.

## Usage

```sh
astrocloud dev pytest
```

## Options

| Option              | Description                                                                                                       | Possible Values                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `<pytest-filepath>` | The filepath to an alternative pytest file/ directory | Valid filepath within your Astro project |
| `-e`, `--env` | The filepath to your environment variables (default: `.env`) | Valid filepath within your Astro project |

## Examples

```sh
$ astrocloud dev pytest --env=myAlternativeEnvFile.env
# Specify env file at root of Astro project
```

## Related Commands

- [`astrocloud dev start`](cli-reference/astrocloud-dev-start.md)
- [`astrocloud dev stop`](cli-reference/astrocloud-dev-stop.md)
- [`astrocloud dev init`](cli-reference/astrocloud-dev-init.md)
- [`astrocloud dev run`](cli-reference/astrocloud-dev-run.md)
- [`astrocloud dev logs`](cli-reference/astrocloud-dev-logs.md)
