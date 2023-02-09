---
sidebar_label: 'Manage Airflow Connections and Variables'
title: 'Manage Airflow Connections and Variables'
id: manage-connections-variables
description: "Manage Airflow Connections and Variables"
---

## **Introduction**

[Airflow](https://airflow.apache.org/) allows you to manage and store variables and connections to data sources in the Airflow [metadata database](https://docs.astronomer.io/learn/airflow-database). These objects are called [Airflow Connections](https://airflow.apache.org/docs/apache-airflow/stable/howto/connection.html) and [Airflow Variables](https://airflow.apache.org/docs/apache-airflow/stable/howto/variable.html) and will keep secrets used by your DAGs safe and obfuscated from logs.
These Airflow objects are different from environment variables. Airflow uses system-level environment variables to [change configuration settings](https://airflow.apache.org/docs/apache-airflow/stable/howto/set-config.html) for a specific Airflow Deployment. For example, the environment variable `AIRFLOW__DATABASE__SQL_ALCHEMY_CONN` is used to specify a metadata database connection string. By contrast, only DAG files use Airflow Variables and Connections.
This document will discuss managing Airflow Variables and Connections locally and within your Astronomer Deployments. Here are a few guides on how Airflow Variables and Connections work if you’d like to learn more about how they are stored and used by Airflow:

- **[Manage connections in Apache Airflow](https://docs.astronomer.io/learn/connections)**
- **[Variables in Apache Airflow: The Guide](https://marclamberti.com/blog/variables-with-apache-airflow/)**

## **Mange Connections and Variables locally**

You can use the [Astro CLI](https://docs.astronomer.io/astro/cli/overview) to create a local instance of Airflow and test out DAGs. You have a few options to manage Airflow Connections and Variables in this [local environment](https://docs.astronomer.io/astro/develop-project).

### Local Airflow Database

The local Airflow metadata database is a Postgres database running inside a docker container. Running `[astro dev start](https://docs.astronomer.io/astro/cli/astro-dev-start)` within an Astro project directory will create this database, and `[astro dev kill](https://docs.astronomer.io/astro/cli/astro-dev-kill)` will delete this database. Be careful when deleting a database as all the connections and variables stored in the database will be lost. The DAGs in the local Astro Project will have access to connections, variables, and pools in this metadata database. There are a few ways to add these objects to the local database.
You can add objects to the local database through the local webserver that is available at [`localhost](http://localhost/):8080` by default. You can add these objects in the connections and variables sections under the “Admin” drop-down menu. Additionally, you can add objects using the [local Airflow API](https://docs.astronomer.io/astro/test-and-troubleshoot-locally#make-requests-to-the-airflow-rest-api-locally) and CLI(Astro CLI `[astro dev run](https://docs.astronomer.io/astro/cli/astro-dev-run)` command). Any object added through the webserver, API, or CLI will be in the Airflow UI Admin section.
Lastly, you can add Airflow Connections and Variables [through environment variables](https://docs.astronomer.io/learn/connections#define-connections-with-environment-variables). All environment variables used as Airflow objects must start with `AIRFLOW_CONN` or `AIRFLOW_VAR`. These objects will be available to your DAGs but are not stored in the Airflow metadata database and will not be in the Airflow UI Admin section.

### Local Airflow Settings File

You can use the Astro CLI to manage local Airflow Objects with an [Airflow settings file](https://docs.astronomer.io/astro/develop-project#configure-airflow_settingsyaml-local-development-only)(`airflow_settings.yaml` by default). The CLI automatically adds all Airflow Connections, Variables, and Pools listed in this file to your local metadata database. Using this file to manage your Airflow database has the following benefits:

- You can transfer objects between airflow projects by moving the settings file between project repositories.
- If your local metadata database gets corrupted or accidentally deleted, you will still have all your objects stored in the settings file.
- You can have multiple files for different groups of objects. For example, an `airflow_settings_dev.yaml` could test DAGs with development credentials.

As mentioned above, the CLI automatically creates Airflow objects in the settings file when you run `astro dev start`. If you want to use the Airflow UI to create or update objects you can use `[astro dev object export](https://docs.astronomer.io/astro/cli/astro-dev-object-export)` to export all objects stored in your local metadata database to a settings file. You can also use `[astro dev object import](https://docs.astronomer.io/astro/cli/astro-dev-object-import)` to apply updates to your settings file without restarting your local Airflow.

## **Manage Connections and Variables on Astro**

You can manage Connections and Variables on Astro similarly to how you manage them locally. However, some features available on your local deployments may not be available on Astronomer.

### Create Objects using the Airflow UI

You can create Airflow Connections and Variables with the [Airflow UI](https://docs.astronomer.io/learn/airflow-ui) on Astro. The UI stores these Airflow objects in the Airflow metadata database in the [dataplane](https://docs.astronomer.io/astro/astro-architecture). You may prefer creating objects this way for deployments with a small amount of Airflow objects where you want to get going quickly.

### Create Objects using the Airflow API

With Astro, you have access to your [Deployment’s Airflow API](https://docs.astronomer.io/astro/airflow-api). You can use this API to create and export Airflow Connections and Variables. Airflow stores these objects in the Airflow metadata database in the dataplane. Teams setting up large deployments with many Airflow objects may want to create them with the Airflow API. You can also use the API to export Airflow objects, but the API response will omit secret values from an export.

### Create Objects using the Airflow CLI

Unlike local development, you cannot use the [Airflow CLI](https://docs.astronomer.io/astro/test-and-troubleshoot-locally#run-airflow-cli-commands) with an Astro Deployment. If you’d like to create multiple objects at once, you can use the Airflow API, environment variables, or a [secretes backend](https://docs.astronomer.io/astro/secrets-backend).

### Environment Variables on Astro

As mentioned earlier, you can create Airflow Objects with environment variables. On Astro, you can create Airflow Objects through Astro UI and CLI. Do create them with the UI, you'd go to the [deployment](https://docs.astronomer.io/astro/configure-deployment-resources) page.

You can also create environment variables for your Astro Deployments with the Astro CLI. For example to load environment variables from a `.env` file run:

```bash
astro deployment variable create --deployment-name <deployment-name> --load --env <env-file>
```

### Secret Backend

You can store your Airflow Connections and Variables as Environment Variables in a [secrets backend](https://docs.astronomer.io/astro/secrets-backend). A secrets backend is a centralized location that complies with your organization's security requirements. Some common secret backends that Astro integrates with are AWS [Secretes Manager](https://aws.amazon.com/secrets-manager/), [Hashicorp Vault](https://www.vaultproject.io/), [Google Cloud Secret Manager](https://cloud.google.com/secret-manager), and [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault/). Storing your Airflow objects this way is recommended for production secrets that allow DAGs to access critical systems or information. Secrets backends provide one centralized location for your secret Airflow objects. You can easily share objects between Airflow deployments once you connect each deployment to the secrets backend. One downside of this method is that you will not see your Airflow Connections or Variables in the Airflow UI. The secrets backendare does not store them in the metadata database. You can read our [documentation](https://docs.astronomer.io/astro/secrets-backend) for instructions on integrating your Astro deployments with popular secret backends.

## Managing **Connections between Local and Astro**

You may need to move connections and variables between a local environment and an Astro Deployment. In Astro, this is not straightforward, and due to security concerns, you cannot pull secret values from an Astro Deployment. There are ways to set up your Deployments to make this process easier.

### How to push Local Connections and Variables to an Astro Deployment

You may want to transfer Connections and Variables created locally to an Astro deployment. For example, once you have a few DAGs working locally, you may want to push them along with needed Airflow objects up to an Astro deployment. You can push Airflow objects from the local Airflow metadata database, settings file, or .env file to a Deployment’s environment variables. The following instructions will walk you through this, starting with the objects in the local database.

First make sure you have your local Airflow environment running with: 

```bash
astro dev start
```

Next make sure all the objects in your settings file are in the local database by running:

```bash
astro dev object import --settings-file <settings-file-location>
```

Export all of your local Airflow connections to an environment file with:

```bash
astro dev object export --env <env-file-location>
```

Now that all your objects are in an environment file you can push them up to an Astronomer Deployment as environment variables with the following command:

```bash
astro dpeloyment variable create --deployment-name "<deployment name>" --load --env <env-file-location> --secret
```

To get your local objects into the metadata database used by an Astro deployment, you will have to use either the Astro UI or Airflow API. The Airflow UI would involve copying and pasting all your local objects into the Airflow UI one by one. Read our documentation on the Airflow API to learn how to use it to move objects.

### How to pull down Connections and Variables being used in your Astro Deployments

Due to security concerns pulling Airflow objects down from an Astro Deployment is more limited than pushing them to one. You cannot pull down secret values, but you can pull down the “keys” of Airflow Variables and Connections. If you are storing your objects in Astronomer Variables, you can pull the keys and non-secret values down to a local `.env` file with the command:

```bash
astro deployment variable list --deployment-name "<deployment name>" --save --env <env-file-location>
```

If you have Airflow objects stored in a deployment’s metadata database, you will need to get the “keys” from the Airflow UI or Airflow API. Again you cannot retrieve secret values from the Airflow UI or API.

### Accessing Secrets in a Secrets Backend locally

Utilizing a secrets backend with your deployment can eliminate the process of transferring Airflow objects. You can give your local environments access to the same secrets backend used by your deployments. There are some security concerns with this method. You will need to determine if this method is appropriate for your team. If you are interested, read our [documentation](https://docs.astronomer.io/astro/secrets-backend#set-up-secrets-manager-locally) on accessing secrets in a secrets backend locally.