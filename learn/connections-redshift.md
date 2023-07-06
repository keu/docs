---
title: "Creating an Amazon Redshift Connection"
id: redshift
sidebar_label: Redshift
description: Learn how to create an Amazon Redshift connection in Airflow.
---

[Amazon Redshift](https://aws.amazon.com/redshift/) is a data warehouse product from AWS. Integrating Redshift with Airflow allows you to automate, schedule and monitor a variety of tasks like create, delete, resume a cluster, ingest or export data to and from Redshift, run SQL queries against Redshift etc. 

## Prerequisites
- The [Astro CLI](https://docs.astronomer.io/astro/cli/overview).
- A locally running [Astro project](https://docs.astronomer.io/astro/cli/get-started-cli).
- Access to your [Redshift cluster](https://us-east-2.console.aws.amazon.com/redshiftv2/home?region=us-east-2#dashboard)
- A user/role with valid [authentication](https://docs.aws.amazon.com/redshift/latest/mgmt/generating-user-credentials.html) and [authorization](https://docs.aws.amazon.com/redshift/latest/mgmt/authorizing-redshift-service.html) to access Redshift Cluster.


## Get connection details

A connection from Airflow to Amazon Redshift either requires DB credentials or an IAM role. Each of these method requires different information to create a connection.

### Method 1: Use DB credentials

Raw database credentials can be used for establishing a connection to an Amazon Redshift cluster. While straight forward, this approach lacks the strong security and user access controls provided by Identity and access management(IAM). To connect to Redshift using this approach, following information is required:

- Cluster identifier
- Database name
- Port
- User
- Password

In your AWS console, follow the below steps to retrieve all of these values:

1. Select the region that contains your Redshift cluster and open [Redshift cluster dashboard](https://us-east-2.console.aws.amazon.com/redshiftv2/home?region=us-east-2#dashboard). Click on your cluster, then from the **General information** tab, copy **Cluster identifier** and **Endpoint**.
2. Click on the **Properties** tab and copy **Database name** and **Port**.
3. Follow the AWS documentation to [Create User](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_USER.html) and [Grant Role](https://docs.aws.amazon.com/redshift/latest/dg/r_GRANT.html) to create a new user and password for Airflow connection.

### Method 2: Use IAM credentials

IAM Credentials can be supplied to your Airflow environment using an AWS profile. This approach allows users the option of using temporary credentials and limiting the permissions the connected user has.

Following information is required:

- Cluster identifier
- Database name
- Port
- Region
- IAM user
- AWS credentials file

In your AWS console, follow the below steps to retrieve all of these values:

1. Select the region that contains your Redshift cluster and open [Redshift cluster dashboard](https://us-east-2.console.aws.amazon.com/redshiftv2/home?region=us-east-2#dashboard). Click on your cluster, then from the **General information** tab, copy **Cluster identifier** and **Endpoint**.
2. Click on the **Properties** tab and copy **Database name** and **Port**.
3. Select the region that contains your Redshift cluster and open [IAM](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-2).
4. Go to **Users** tab, select your user, go to the **Permissions** tab and follow the [AWS documentation](https://docs.aws.amazon.com/redshift/latest/mgmt/redshift-iam-access-control-identity-based.html) to ensure that the IAM user is authorized to connect to Redshift and perform required SQL operations.
5. If you already have an access key ID and a secret access key, you can use those. Otherwise, follow the [AWS documentation](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html) to generate a new access key ID and secret access key.

## Create your connection

To connect to Redshift from Airflow, you either need to use DB credentials or an IAM role. Use any of the below methods to integrate Redshift with Airflow:

### Method 1: Use DB credentials

To create a connection, follow the below steps:

1. Add the following line to your Astro project's `requirement.txt` file:
    ```
    apache-airflow-providers-amazon
    ```
2. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.
3. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection and select the connection type as **Amazon Redshift**.
4. Paste the values copied in [Get connection details](#method-1-use-db-credentials) to the respective fields as shown in the screenshot. 
5. Click on **Test** connection to test and then **Save** the connection.

    ![aws-connection-db-creds](/img/guides/connection-aws-redshift.png)

### Method 2: Use IAM credentials

1. Add the following line to your Astro project's `requirement.txt` file:
    ```
    apache-airflow-providers-amazon
    ```
2. Copy the `aws` credentials file to the `include` directory of your Astro project. For example, it will look like this for the `airflow` profile:
    ```yaml
    # ~/.aws/credentials
    [<airflow_profile>]
    aws_access_key_id="my_aws_access_key_id"
    aws_secret_access_key="my_aws_secret_access_key"
    ```
3. If you're not currently running Airflow locally, open your Astro project and run `astro dev start`. Otherwise, run `astro dev restart`.
4. In the Airflow UI, go to **Admin** > **Connections**. Click the **+** sign to add a new connection and select the connection type as **Amazon Redshift**.
5. Use the following JSON template and update it with the details copied in [Get connection details](#method-2-use-iam-credentials) for your cluster and and paste it in the **Extra** field of the connection. Remember to change the name of the `profile` based on your `aws` credentials file.
    ```json
    {
        "iam": true, 
        "cluster_identifier": "<my-redshift>", 
        "port": 5439, 
        "region": "us-east-2",
        "db_user": "awsuser", 
        "database": "dev", 
        "profile": "<airflow_profile>"
    }
    ```
6. Copy the modified JSON from the above step and paste it in the **Extra** field of the connection.
7. Click on **Test** connection to test and then **Save** the connection.

    ![aws-connection-iam-creds](/img/guides/connection-aws-redshift-extra.png)

## How it works

Airflow uses the python package [Amazon Redshift Python Connector](https://docs.aws.amazon.com/redshift/latest/mgmt/python-configuration-options.html) to connect to Redshift using [RedshiftSQLHook](https://airflow.apache.org/docs/apache-airflow-providers-amazon/stable/_api/airflow/providers/amazon/aws/hooks/redshift_sql/index.html).

## See also
- [Apache Airflow Amazon provider docs](https://airflow.apache.org/docs/apache-airflow-providers-amazon/stable/connections/redshift.html)
- [Redshift Connector Python Client](https://github.com/aws/amazon-redshift-python-driver/blob/master/tutorials/001%20-%20Connecting%20to%20Amazon%20Redshift.ipynb)
- Redshift [modules](https://registry.astronomer.io/modules?query=redshift) in Astronomer Registry.