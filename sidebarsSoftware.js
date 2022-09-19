/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation
 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 */

module.exports = {
  software: [
    {
      type: 'doc',
      id: 'overview',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Get started',
      items: [
      'log-in-to-software',
      'install-cli',
      'create-project',
      ],
    },
    {
      type: 'category',
      label: 'Develop',
      items: [
      'customize-image',
      'manage-airflow-versions',
      'upgrade-to-airflow-2',
      'access-airflow-database',
      'airflow-api',
      {
      type: 'category',
      label: 'Write DAGs',
      items: [
      'deferrable-operators',
      'kubepodoperator-local',
      'kubepodoperator',
      'kubernetes-executor',
        ],
      },
      'deploy-cli',
      'cli-podman',
      'upgrade-astro-cli',
    ],
    },
    {
      type: 'category',
      label: 'Administration',
      items: [
        {
        type: 'category',
        label: 'Install',
        items: [
        'install-aws',
        'install-azure',
        'install-gcp',
        'install-airgapped',
          ],
        },
        'upgrade-astronomer',
        'apply-platform-config',
        {
        type: 'category',
        label: 'Manage platform resources',
        items: [
          'registry-backend',
          'namespace-pools',
          'configure-platform-resources',
          ],
        },
        {
        type: 'category',
        label: 'Manage Deployments',
        items: [
          'configure-deployment',
          'environment-variables',
          ],
        },
        {
        type: 'category',
        label: 'CI/CD and automation',
        items: [
        'ci-cd',
        'houston-api',
        'deploy-git-sync',
        'deploy-nfs',
          ],
        },
        {
        type: 'category',
        label: 'Platform observability',
        items: [
          'platform-alerts',
          'logs-to-s3',
          'export-task-logs',
          ],
        },
        {
        type: 'category',
        label: 'Security and compliance',
        items: [
          'secrets-backend',
          'integrate-auth-system',
          'custom-image-registry',
          'third-party-ingress-controllers',
          'renew-tls-cert',
          ],
        },
        {
        type: 'category',
        label: 'User access and management',
        items: [
        'manage-workspaces',
        'import-idp-groups',
        'workspace-permissions',
        'manage-platform-users',
        'integrate-iam',
        ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Observability',
      items: [
      'grafana-metrics',
      'kibana-logging',
      'deployment-logs',
      'airflow-alerts',
      ],
    },
    {
      type: 'category',
      label: 'Astronomer Certified',
      items: [
      'image-architecture',
      'single-node-install',
      'install-packages',
      'upgrade-ac',
      'ac-cve',
      'ac-support-policy',
      ],
    },
    {
      type: 'category',
      label: 'Astro Runtime',
      items: [
      'runtime-image-architecture',
      'migrate-to-runtime',
      'runtime-version-lifecycle-policy',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshoot',
      items: [
      'kubectl',
      'debug-install',
      'disaster-recovery',
      ],
    },
    {
    type: 'category',
    label: 'Release notes',
    items: [
      'release-notes',
      'cli-release-notes',
      'runtime-release-notes',
    ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
      'system-components',
      'support',
      'cli-reference',
      'version-compatibility-reference',
      'release-lifecycle-policy',
      'documentation-archive',
      ],
    },
  ],
};
