---
sidebar_label: 'astro team'
title: 'astro team'
id: astro-team
description: Reference documentation for astro team.
---

:::info 

This command is available only if you're authenticated to an Astronomer Software installation. 

:::

Manage system-level Teams on Astronomer Software.

## Usage 

This command has several subcommands. Read the following sections to learn how to use each subcommand.

### astro team get 

View information for a single Team. 

#### Usage  

```sh
astro team get <team-id>
```

#### Options

| Option              | Description                                                                                   | Possible Values                                 |
| ------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `-a`, `--all` | View all information about the Team | None  |
| `-r`, `--roles` | View role details for the Team  | None  |
| `-u`, `--users` | View all users in the Team  | None  |

### astro team list 

List all Teams on Astronomer Software.

#### Usage  

```sh
astro team list 
```

#### Options

| Option              | Description                                                                                   | Possible Values                                 |
| ------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `-a`, `--all` | View all information about the Team | None  |
| `-p` `--paginated ` | Paginate the list of Teams. If `--page-size` is not specified, the default page size is 20. | None            |
| `-s` `--page-size`  | The page size for paginated lists.                                                               | Any integer     |

### astro team update 

Update an Astro Team's system-level role.

#### Usage  

```sh
astro team update <team-id> --role=<system-role>
```

#### Options

| Option              | Description                                                                                   | Possible Values                                 |
| ------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `-r` `--role`       | The Team's system-level role | Possible values are `SYSTEM_VIEWER`, `SYSTEM_EDITOR`, or `SYSTEM_ADMIN`. |