---
title: "Creating the Redshift Connection"
id: redshift
sidebar_label: Redshift
---

<head>
  <meta name="description" content="Learn how to create the Redshift Connection." />
  <meta name="og:description" content="Learn how to create the Redshift Connection." />
</head>

Redshift is a data warehouse product from AWS.

## Prerequisites
- Local Airflow environment using [Astro CLI](https://docs.astronomer.io/astro/cli/overview)
- A Redshift cluster that is accessible from your Airflow Server
- A user/role with valid [authentication](https://docs.aws.amazon.com/redshift/latest/mgmt/generating-user-credentials.html) and [authorization](https://docs.aws.amazon.com/redshift/latest/mgmt/authorizing-redshift-service.html) to access Redshift Cluster.
- Python requirement `apache-airflow-providers-amazon` should be added to `requirements.txt`

## Get Connection details
1. In your AWS console, select your region, go to **Amazon Redshift** and click on **Clusters**. 
2. Go to the cluster you want to connect to and note `cluster-identifier`, `endpoint`, `database` and `port`.
3. Your Key file in JSON format will be downloaded. We will copy it to create Google Cloud connection as explained in the steps below.

## Create your connection

To connect to AWS Redshift, you either need to use DB credentials or an IAM role. Use any of the below methods to integrate Redshift with Airflow:

1. Use DB Credentials in an Airflow Connection.
2. Use IAM Authentication by providing IAM profile in Airflow Connection.

### Use DB credentials

1. Get the user and password for the Redshift cluster from your DB Administrator or DevOps team. See [Create User](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_USER.html) and [Grant Role](https://docs.aws.amazon.com/redshift/latest/dg/r_GRANT.html) for more details.
2. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as **Amazon Redshift**.
3. Enter the `endpoint` in the **Host** field, `database` in **Database**, `user` in **User**, `password` in **Password** and `port` in **Port**. 
4. Click on **Test** connection to test and then **Save** the connection.

![aws-connection-db-creds](/img/guides/connection-aws-redshift.png)

### Use IAM credentials

1. Ensure the IAM User is [authorized](https://docs.aws.amazon.com/redshift/latest/mgmt/authorizing-redshift-service.html) to connect to AWS Redshift and perform required SQL operations.
2. Copy the `aws` credentials file to your Airflow server. For example, it will look like this for the `default` profile:
```yaml
# ~/.aws/credentials
[default]
aws_access_key_id="my_aws_access_key_id"
aws_secret_access_key="my_aws_secret_access_key"
aws_session_token="my_aws_session_token"
```
3. Go the **Admin** menu on Airflow UI and then click on **Connections**. Click the **+** sign to add a new connection and select the connection type as **Amazon Redshift**.
4. Edit the following JSON with the information about your cluster and your `aws` profile name:

```json
{
    "iam": true, 
    "cluster_identifier": "my-redshift", 
    "port": 5439, 
    "region": "us-east-1",
    "db_user": "awsuser", 
    "database": "dev", 
    "profile": "default"
}
```
4. Copy the above JSON and paste it in the **Extra** field of the connection.
5. Click on **Test** connection to test and then **Save** the connection.

![aws-connection-iam-creds](/img/guides/connection-aws-redshift-extra.png)

## How it works

- Airflow Redshift provider uses the python package [Amazon Redshift Python Connector](https://docs.aws.amazon.com/redshift/latest/mgmt/python-configuration-options.html) to connect to Redshift. 
- When no Key details in connection are provided, Google defaults to using [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials).

## References
- [OSS Airflow docs](https://airflow.apache.org/docs/apache-airflow-providers-amazon/stable/connections/redshift.html)
- [Redshift Connector Python Client](https://github.com/aws/amazon-redshift-python-driver/blob/master/tutorials/001%20-%20Connecting%20to%20Amazon%20Redshift.ipynb)
- [Create an IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)
- [Create an IAM role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create.html)