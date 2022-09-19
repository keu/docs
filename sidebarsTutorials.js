module.exports = {
  concepts: [
    {
      type: 'category',
      label: 'Airflow basics',
      items: [
        'intro-to-airflow',
        'what-is-an-operator',
        'what-is-a-sensor',
        'connections',
        'what-is-a-hook',
        'dags',
        'airflow-decorators',
        'bashoperator',
        'airflow-sql',
      ],
    },
    {
      type: 'category',
      label: 'Airflow infrastructure',
      items: [
        'airflow-database',
        'airflow-executors-explained',
        'airflow-components',
        'deferrable-operators',
        'using-airflow-plugins',

      ],
    },
    {
      type: 'category',
      label: 'Operationalize Airflow',
      items: [
        'custom-xcom-backends',
        'logging',
        'kubepod-operator',
        'testing-airflow',
      ],
    },
    {
      type: 'category',
      label: 'DAG design and best practices',
      items: [
          'airflow-passing-data-between-tasks',
          'airflow-branch-operator',
          'airflow-pools',
          'airflow-scaling-workers',
          'dag-best-practices',
          'airflow-importing-custom-hooks-operators',
          'debugging-dags',
          'subdags',
          'task-groups',
          'rerunning-dags',
          'managing-dependencies',
          'managing-airflow-code',
          'templating',
          'dynamically-generating-dags',
      ],
    },
  ],
  tutorials: [
    'overview'
    'get-started-with-airflow',
    {
      type: 'category',
      label: 'DAG writing tutorials',
      items: [
        'astro-python-sdk',
        'execute-notebooks',
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
        'soda-data-quality',
      ],
    },
  ],
};
