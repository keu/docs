---
sidebar_label: 'Troubleshooting FAQ'
title: 'Astronomer Software Troubleshooting FAQ'
id: troubleshoot-software
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Use this document to learn more about common issues on Astronomer Software and how to resolve them. 

## Why does my Deployment have zombie tasks? 

Zombie tasks are task runs that Airflow assumes are running but have somehow died. Zombie tasks often occur when a process running a task is killed killed or the node running a task worker is terminated.

There are a few reasons why your Deployment could have zombie tasks:

- You are receiving `FailedScheduling` errors due to insufficient scheduler CPU and memory.
- You have DAG parsing issues.
- You are encountering a known Airflow bug in versions 2.0.0 - 2.3.2.
- (AWS only) T2 and T3 instance types are being throttled due to lack of credits.

### Symptoms of zombie tasks

Use the following methods to find zombie tasks on a Deployment:

- Search for missing log errors in your task logs. For example, the following log might indicate a zombie task run because there was no evidence of it running to completion:

    ```
    *** Falling back to local log 
    *** Log file does not exist: /usr/local/airflow/logs/dag_id=<dag>/run_id=<run>/task_id=<task>/attempt=1.log 
    *** Fetching from: http://<ip>/log/dag_id=<dag>/run_id=<run>/task_id=<task>/attempt=1.log 
    *** Failed to fetch log file from worker. Client error '404 NOT FOUND' for url 'http://<ip>/log/dag_id=<dag>/run_id=<run>/task_id=<task>/attempt=1.log' For more information check: https://httpstatuses.com/404
    ```

- Search for zombie logs in your task logs. For example:

    ```text
    ERROR - Detected zombie job
    ```

    Because Airflow occasionally creates these logs with irregular spacing, search only for "zombie" to find all available zombie logs. 
    
### Solution: Use safeguards for preventing zombie tasks

Implement the following practices to limit zombie tasks on your Deployment:

- Ensure that you run at least 2 retries for all tasks by setting `retries=2` in your task parameters. 
- Whenever possible, use deferrable operators and sensors. These operators can mitigate zombie tasks because their execution often occurs outside of Airflow, meaning that the Airflow task itself won't be killed by the loss of a worker node.

### Solution: Upgrade to the latest patch of Astro Runtime 5 or validate DAGs

In Runtime 5.0.7 and earlier, it's possible for Airflow to produce zombie tasks by attempting to run a DAG with syntax errors. When you push breaking changes to an existing DAG on Astro:

- Airflow attempts to run a task that it detected from an earlier version of the DAG.
- The task fails and triggers `on_failure_callback` logic.
- Airflow doesn't know how to handle the `on_failure_callback` logic because it can't parse the broken DAG, and after 5 minutes produces a zombie task. 

If your DAG failed to parse, you might have one of the following logs in your task logs:

- `Broken DAG`
- `Failed to parse`
- `airflow.exceptions.AirflowTaskTimeout: DagBag import timeout`

If your Deployment has a DAG with syntax errors, complete one of the following actions to stop zombie tasks:

- Upgrade to the latest patch version Astro Runtime 5 or later. See [Upgrade Runtime](upgrade-runtime.md).
- Upgrade to Astro CLI 1.0 or later. Later versions of the Astro CLI parse your DAGs by default and prevent your from deploying DAGs if they contain syntax errors. See [Install the CLI](cli/install-cli.md).

## How do I download logs from Elasticsearch for a Deployment?

This setup requires System Admin privileges to your Astronomer installation. 

1. Identify the container name for one of your Deployment's Airflow components. The container can be for any core Airflow component, for example the scheduler.
2. Run the following command to exec into the Airflow component container:

    ```sh
    kubectl exec --stdin --tty <airflow-component-container-name> -- /bin/bash
    ```

2. In the terminal for your component container, run the following command to get the URL for your Elasticsearch host:

    ```sh
    airflow config list | grep elasticsearch_host
    ```

    Copy this value for Step 4.

3. In the terminal for your component container, run the following command to forward the port for Elasticsearch:

    ```sh
    kubectl port-forward service/astronomer-elasticsearch-nginx 9200:9200 -n astronomer
    ```

4. In the terminal for your component container, run the following Python script:

    ```python
    from elasticsearch import Elasticsearch
    import json, re, sys
    
    
    def decolorize(input_string: str) -> str:
        return re.sub(r"\x1B\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]", "", input_string)
    
    
    filename = input("Outputfile: ")
    f = open(filename, "w")
    # get value from airflow config list | grep elasticsearch_host
    url = "<elastic-search-host-url>:@astronomer-elasticsearch-nginx.astronomer:9200"
    url_components = re.split(":|//|@", url)
    print(url_components)
    es = Elasticsearch(
        ["http://localhost:9200"],
        http_auth=(str(url_components[2]), str(url_components[3])),
    )
    query = {
        "bool": {
            "must": [],
            "filter": [
                {
                    "multi_match": {
                        "type": "phrase",
                        "query": "AWSGlue_prd-sov-agg",
                        "lenient": True,
                    }
                },
                {
                    "range": {
                        "@timestamp": {
                            "format": "strict_date_optional_time",
                            "gte": "2022-11-21T00:52:19.829Z",
                            "lte": "2022-11-21T10:41:39.339Z",
                        }
                    }
                },
                {"match_phrase": {"component.keyword": "scheduler"}},
            ],
            "should": [],
            "must_not": [],
        }
    }
    
    resp = es.search(
        index="fluentd.{}.*".format(str(url_components[2])),
        body={"_source": ["message"], "query": query, "size": 10000},
        scroll="10m",
    )
    old_scroll_id = resp["_scroll_id"]
    results = resp["hits"]["hits"]
    while len(results):
        for i in results:
            f.write(decolorize(i["_source"]["message"]))
        result = es.scroll(
            scroll_id=old_scroll_id, scroll="10m"
        )
        # check if there's a new scroll ID
        if old_scroll_id != result["_scroll_id"]:
            print("NEW SCROLL ID:", result["_scroll_id"])
        # keep track of pass scroll _id
        old_scroll_id = result["_scroll_id"]
        results = result["hits"]["hits"]
    ```

    This script creates a text file of downloaded logs which you can then download from your component container. 