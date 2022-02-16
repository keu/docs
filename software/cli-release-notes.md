---
sidebar_label: 'Astronomer Software CLI'
title: 'Astronomer Software CLI Release Notes'
id: cli-release-notes
description: Release notes for the Astronomer Software CLI.
---

## Overview

This document provides a summary of all changes made to the [Software CLI](cli-quickstart.md) for the v0.28.x series of Astronomer Enterprise. For general product release notes, go to [Astronomer Software Release Notes](release-notes.md).

If you have any questions or a bug to report, don't hesitate to reach out to us via Slack or Intercom. We're here to help.

## 0.28.0

Release date: February 15, 2022

### Additional Improvements

- After successfully pushing code to a Deployment via `astro deploy`, the CLI now provides a URL that you can use to directly access that Deployment via the UI.
- You can now retrieve Triggerer logs using `astro deployment logs triggerer`.

### Bug Fixes

- Fixed an issue where some objects specified in `airflow_settings.yaml` were not rendered after running `astro dev start`
- Fixed an issue where environment variables in `docker-compose.override.yml` were not correctly applied after running `astro dev start`
