/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation
 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 */

module.exports = {
  guides: [
    {
      type: 'doc',
      id: 'overview',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'overview',
        'airflow-passing-data-between-tasks',
        'airflow-database',
        'airflow-executors-explained',
        'airflow-components',
        'airflow-branch-operator',
        'airflow-pools',
        'airflow-scaling-workers',
        'airflow-importing-custom-hooks-operators',
        'airflow-sql',
        'airflow-decorators',
        'connections',
        'dag-best-practices',
        'custom-xcom-backends',
        'debugging-dags',
        'deferrable-operators',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'overview',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'overview',
        'airflow-azure-data-factory-integration',
        'airflow-azure-data-explorer',
        'airflow-openlineage',
        'airflow-dbt',
        'airflow-databricks',
        'airflow-sagemaker',
        'airflow-redshift',
        'airflow-great-expectations',
        'airflow-talend-integration',
        'airflow-sql-data-quality-tutorial',
        'astro-python-sdk-etl',
      ],
    },
  ],
};
