/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation
 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 */

module.exports = {
  tutorials: [
    {
      type: 'category',
      label: 'Tutorials',
      link: {
        type:'doc',
        id: 'overview',
      },
      items: [
        'get-started-with-airflow',
        'astro-python-sdk',
      ]
    },
  ],
};
