---
sidebar_label: "astrocloud deploy"
title: "astrocloud deploy"
id: astrocloud-deploy
description: Reference documentation for astrocloud deploy.
---

## Description

[Deploy your Astro project](deploy-code.md).

When you run `astrocloud deploy`, you'll be prompted to select from a list of all Deployments that you have access to across Workspaces. Alternatively, you can bypass this prompt and specify a Deployment ID in the command. To retrieve a Deployment ID, go to your Deployment's information page in the Cloud UI and copy the value after the last `/` in the URL. You can also get the Deployment's ID by running `astrocloud deployment list`.

This command runs several tests on your project before deploying it. If any of the tests fail, the deploy will fail. These tests are the same tests which run during `astrocloud dev parse`.

For teams operating at scale, this command can be automated via a [CI/CD pipeline](ci-cd.md) by using [Deployment API keys](api-keys.md) in the request. When `ASTRONOMER_KEY_ID` and `ASTRONOMER_KEY_SECRET` are specified as OS-level environment variables on your local machine or in a CI tool, `astrocloud deploy` can be run without requiring user authentication.

## Usage

```sh
astrocloud deploy <options>
```

## Options

| Option                    | Description                                                                                                       | Possible Values                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `<deployment-id>`         | Specify the Deployment to deploy to                                                                              | Any valid Deployment ID           |
| `-e`,`--env`              | Location of the file containing environment variables for Pytests. By default, this is `.env`.                                 | Any valid filepath to an `.env` file     |
| `-f`,`--force`            | Force the deploy even if your Astro project contains uncommitted changes or fails tests                                                                | ``                                       |
| `p`,`--prompt`            | Force the Deployment selection prompt even if a Deployment ID is specified                           | ``                                       |
| `--pytest`                | Deploy code to Astro only if the specified Pytests are passed                                                     | ``                                       |
| `s`,`--save`              | Save the current Deployment and working directory combination for future deploys                                              | ``                                       |
| `t`,`--test`              | The filepath to an alternative pytest file or directory | Valid filepath within your Astro project |
| `--workspace-id <string>` | In the prompt to select a Deployment, only show Deployments within this Workspace                                                                             | Any valid Workspace ID                                |

## Examples

```sh
# List of Deployments appears
$ astrocloud deploy

# Deploy directly to a specific Deployment
$ astrocloud deploy ckvvfp9tf509941drl4vela81n

# Running `astrocloud deploy` will now automatically select this Deployment for your Astro project
$ astrocloud deploy ckvvfp9tf509941drl4vela81n --save
```

## Related Commands

- [`astrocloud auth login`](cli-reference/astrocloud-auth-login.md)
- [`astrocloud deployment list`](cli-reference/astrocloud-deployment-list.md)
- [`astrocloud dev parse`](cli-reference/astrocloud-dev-parse.md)
