// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Products & Solutions',
      collapsed: false,
      items: [
        'products/autobook',
        'products/custom-crm',
        'products/turnkey-web',
      ],
    },
    {
      type: 'category',
      label: 'Releases & Changelog',
      collapsed: false,
      items: [
        'releases/index',
        'releases/v2.0.0',
        'releases/v1.0.0',
      ],
    },
    {
      type: 'category',
      label: 'Architecture & Security',
      collapsed: false,
      items: [
        'architecture/security-and-backups',
        'architecture/cloud-infrastructure',
        'architecture/element-system',
      ],
    },
    {
      type: 'category',
      label: 'API & Integrations',
      collapsed: false,
      items: [
        'integrations/api-reference',
        'integrations/notifications',
      ],
    },
  ],
};

module.exports = sidebars;
