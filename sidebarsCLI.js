module.exports = {
  cli: [
      {
        type: 'doc',
        label: 'CLI Overview',
        id: 'cli/overview'
      },
      {
        type: 'doc',
        label: 'Quickstart',
        id: 'cli/cli-quickstart'
      },
      {
      type: 'category',
      label: 'CLI Command Reference',
      items: [
        'cli/astrocloud-auth-login',
        'cli/astrocloud-auth-logout',
        'cli/astrocloud-completion',
        'cli/astrocloud-deploy',
        'cli/astrocloud-deployment-create',
        'cli/astrocloud-deployment-delete',
        'cli/astrocloud-deployment-list',
        'cli/astrocloud-deployment-logs',
        'cli/astrocloud-deployment-update',
        'cli/astrocloud-deployment-variable-create',
        'cli/astrocloud-deployment-variable-list',
        'cli/astrocloud-dev-init',
        'cli/astrocloud-dev-kill',
        'cli/astrocloud-dev-logs',
        'cli/astrocloud-dev-parse',
        'cli/astrocloud-dev-ps',
        'cli/astrocloud-dev-pytest',
        'cli/astrocloud-dev-run',
        'cli/astrocloud-dev-start',
        'cli/astrocloud-dev-stop',
        'cli/astrocloud-dev-restart',
        'cli/astrocloud-version',
        'cli/astrocloud-workspace-list',
        'cli/astrocloud-workspace-switch',],
    },
    {
      type: 'doc',
      label: 'Release Notes',
      id: 'cli/cli-release-notes'
    },
  ],
};
