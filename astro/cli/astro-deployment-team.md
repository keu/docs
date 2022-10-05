---
sidebar_label: "astro deployment team"
title: "astro deployment team"
id: astro-deployment-team
description: Reference documentation for astro deployment team
---

:::info 

This command is available only if you're authenticated to an Astronomer Software installation. 

:::

Manage Deployment-level Teams on Astronomer Software. 

## Usage

This command includes three subcommands: `create`, `delete`, and `list`

`astro deployment team add --deployment-id=<your-deployment-id> <team-id>`
`astro deployment team list <deployment-id>`
`astro deployment team --deployment-id=<your-deployment-id> <team-id> [flags]`
`astro deployment team remove --deployment-id=<your-deployment-id> <team-id>`

## Options 


| Option              | Description                                                                              | Possible Values                       |
| ------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------- |
| `--deployment-id` (_Required_)    | The Deployment for the Team                    | Any valid Deployment ID |
| `<team-id>` (_Required_)     | The Team's ID             | Any valid Team ID |
| `--role`    | The Team's role in the Deployment | Possible values are either `DEPLOYMENT_VIEWER`, `DEPLOYMENT_EDITOR`, or `DEPLOYMENT_ADMIN`.   Default is `DEPLOYMENT_VIEWER`    |