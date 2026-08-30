// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Osmyka Knowledge Hub',
  tagline: 'Product manuals, version changelogs, architecture specifications, and technical insights for automotive and service businesses.',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://osmyka.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/docs/',

  // GitHub pages deployment config.
  organizationName: 'Osmyka',
  projectName: 'Osmyka.com',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // Serve docs directly under /docs/
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'Osmyka Blog & Announcements',
          blogDescription: 'News, release highlights, and engineering insights from Osmyka OÜ.',
          postsPerPage: 10,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo.svg',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'osmyka',
        logo: {
          alt: 'Osmyka OÜ',
          src: 'img/logo.svg',
          width: 28,
          height: 28,
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Overview',
          },
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left',
          },
          {
            href: '/',
            label: '← Main Site',
            position: 'right',
            className: 'header-back-main-link',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Solutions & Products',
            items: [
              {
                label: 'AutoBook 24/7 Booking',
                to: '/products/autobook',
              },
              {
                label: 'AutoRepair CRM Platform',
                to: '/products/custom-crm',
              },
              {
                label: 'Turnkey Web Portals',
                to: '/products/turnkey-web',
              },
            ],
          },
          {
            title: 'Engineering & Docs',
            items: [
              {
                label: 'Version Releases & Changelog',
                to: '/releases/v2.0.0',
              },
              {
                label: 'Security & Multi-Level Backups',
                to: '/architecture/security-and-backups',
              },
              {
                label: 'REST API & Webhooks',
                to: '/integrations/api-reference',
              },
              {
                label: 'UI Element System',
                to: '/architecture/element-system',
              },
            ],
          },
          {
            title: 'Osmyka OÜ (Estonia)',
            items: [
              {
                label: 'Official Website',
                href: 'https://osmyka.com',
              },
              {
                label: 'Terms of Service',
                href: 'https://osmyka.com/terms',
              },
              {
                label: 'Privacy Policy',
                href: 'https://osmyka.com/privacy',
              },
              {
                label: 'Email Support',
                href: 'mailto:info@osmyka.com',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Osmyka OÜ. All rights reserved.`,
      },
    }),
};

module.exports = config;
