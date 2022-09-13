---
title: "Use Airflow plugins"
sidebar_label: "Use Airflow plugins"
description: "How to use Airflow plugins."
id: using-airflow-plugins
---

Plugins are Airflow components that you use to customize your Airflow installation. In this guide you'll learn about plugin capabilities and review some examples that show how they are used and the benefits they provide.

### Hooks and operators

Don't use Airflow plugins for hooks, operators, or sensors. See [Import custom hooks and operators](https://www.astronomer.io/guides/airflow-importing-custom-hooks-operators).

### Macros

[Macros](https://airflow.apache.org/docs/stable/macros-ref.html) are used to pass dynamic information into task instances at runtime with templating.

A current limitation of Airflow is that every global variable or top-level method in a DAG file is interpreted every cycle during the DAG processing loop on the scheduler. While the loop execution time can vary from seconds to minutes, the majority of code should only be interpreted in a task at execution time.

Macros are a tool in Airflow that extend Airflow [templating](https://airflow.apache.org/tutorial.html#templating-with-jinja) capabilities and allow you to offload runtime tasks to the executor instead of the scheduler loop. The following are some example macros:

- Timestamp formatting of last or next execution for incremental ETL.
- Decryption of a key used for authentication to an external system.
- Accessing custom user-defined params

A template always returns a string.

### Blueprints and views

The Airflow [blueprints](http://flask.pocoo.org/docs/0.12/blueprints/) and [views](http://flask.pocoo.org/docs/0.12/views/) components are extensions of blueprints and views in the Flask web app framework. Developers have extended the Airflow API to include triggering a DAG run remotely, adding new connections, or modifying [Airflow variables](https://airflow.apache.org/docs/apache-airflow/stable/concepts.html). You can extend this to build an entire web app which sits alongside the Airflow webserver. One example of this is a plugin that allows analysts to use a web UI to input SQL that runs on a scheduled interval.

### Menu links

Developers can add custom [Menu Links](https://github.com/flask-admin/flask-admin/blob/06aebf078574cbbe70b2691fc8a41f234f321962/flask_admin/menu.py#L129 ) to the Airflow navigation menu to allow users to quickly access Airflow pages that are relevant to them.

The Airflow webserver is customizable to meet a variety of needs. With menu links, you can provide quick access to Airflow resources. For example, you can modify the Airflow webserver to include a structure similar to the following:

- Developer
    - Plugins repository
    - CI/CD system
- Analyst
    - Organization-specific Domino install
    - CI/CD system
    - AI Management systems
