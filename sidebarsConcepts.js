module.exports = {
  concepts: [
    'overview',
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
          'airflow-sql-data-quality-tutorial',
      ],
    },
  ],
};
