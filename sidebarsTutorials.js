module.exports = {
  tutorials: [
    'overview',
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
        'airflow-azure-data-factory-integration',
        'airflow-azure-data-explorer',
        'airflow-openlineage',
        'airflow-dbt',
        'airflow-databricks',
        'airflow-sagemaker',
        'airflow-redshift',
        'airflow-great-expectations',
        'airflow-talend-integration',
        'soda-data-quality',
      ],
    },
  ],
};
