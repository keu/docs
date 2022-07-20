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
      ],
    },
  ],
};
