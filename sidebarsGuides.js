/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation
 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 */

module.exports = {
  concepts: [
    {
      type: 'category',
      label: 'Getting started',
      items: [
        'airflow-sql',
        'airflow-decorators',
      ],
    },
    {
      type: 'category',
      label: 'Airflow infrastructure',
      items: [
        'airflow-passing-data-between-tasks',
        'airflow-database',
      ],
    },
    {
      type: 'category',
      label: 'Airflow features',
      items: [
        'airflow-executors-explained',
        'airflow-components',
      ],
    },
    {
      type: 'category',
      label: 'Operationalizing Airflow',
      items: [
        'airflow-branch-operator',
        'airflow-pools',
      ],
    },
    {
      type: 'category',
      label: 'DAG design and best practices',
      items: [
        'airflow-sql',
        'airflow-decorators',
      ],
    },
  ],
  tutorials: [
    {
      type: 'category',
      label: 'Get started with Airflow',
      items: [
        'overview',
      ],
    },
    {
      type: 'category',
      label: 'Build environments',
      items: [
        'overview',
      ],
    },
    {
      type: 'category',
      label: 'Build ETL pipelines',
      items: [
        'overview',
      ],
    },
    {
      type: 'category',
      label: '3rd party integrations',
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
      ],
    },
  ],
};
