---
sidebar_label: "astrocloud dev pytest"
title: "astrocloud dev pytest"
id: astrocloud-dev-pytest
description: Reference documentation for astrocloud dev pytest.
---

## Description

Run pytests from the `tests` folder of your locally hosted Astro project. When you run this command, the Astro CLI provisions a local Python environment that includes your DAG code, dependencies, and Astro Runtime image. The CLI then runs all pytests in your `tests` directory and shows you the results of these tests in your terminal.

Note that this command requires using Runtime version `4.1.0+` in your project.

## Usage

```sh
astrocloud dev pytest
```

## Options

| Option              | Description                                                                                   | Possible Values                                 |
| ------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `<pytest-filepath>` | The filepath to an alternative pytest file or directory. Must be within the `tests` directory | Any valid filepath within the `tests` directory |
| `-e`, `--env`       | The filepath to your environment variables. The default is `.env`)                            | Any valid filepath within your Astro project    |

## Examples

```sh
$ astrocloud dev pytest --env=myAlternativeEnvFile.env
# Specify env file at root of Astro project
```

## Related Commands

- [`astrocloud dev init`](cli-reference/astrocloud-dev-init.md)
- [`astrocloud dev start`](cli-reference/astrocloud-dev-start.md)
- [`astrocloud deploy`](cli-reference/astrocloud-deploy.md)
