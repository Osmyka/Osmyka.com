import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

const categories = [
  {
    title: 'AutoBook 24/7 Booking',
    desc: 'Self-service client appointment scheduling, automated calendar sync, and SMS reminders.',
    link: '/products/autobook',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"></path>
      </svg>
    ),
  },
  {
    title: 'AutoRepair CRM Platform',
    desc: 'End-to-end work order tracking, VIN decoding, parts catalog integration, and one-click PDF invoicing.',
    link: '/products/custom-crm',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1"></rect>
        <rect x="14" y="3" width="7" height="5" rx="1"></rect>
        <rect x="14" y="12" width="7" height="9" rx="1"></rect>
        <rect x="3" y="16" width="7" height="5" rx="1"></rect>
      </svg>
    ),
  },
  {
    title: 'Turnkey Web Portals',
    desc: 'Sub-second web performance, custom UI design, mobile-first responsive interfaces, and edge caching.',
    link: '/products/turnkey-web',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
  },
  {
    title: 'Version Releases & Changelog',
    desc: 'Release schedules, version breakdown, feature deprecations, and upgrade instructions for v2.0.0+.',
    link: '/releases/v2.0.0',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ),
  },
  {
    title: 'Security & Multi-Level Backups',
    desc: 'GDPR-compliant Estonia/EU cloud hosting, real-time replication, automated daily snapshots, and SSL/TLS.',
    link: '/architecture/security-and-backups',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
  },
  {
    title: 'REST API & Webhooks',
    desc: 'Developer documentation, authentication headers, JSON schemas, webhook event triggers, and code samples.',
    link: '/integrations/api-reference',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Knowledge Hub & Technical Documentation"
      description="Official product documentation, changelogs, architecture specifications, and technical guides by Osmyka OÜ.">
      <main className="container">
        <section className="portal-hero">
          <h1 className="portal-hero-title">
            Osmyka <span className="portal-grad">Knowledge Hub</span>
          </h1>
          <p className="portal-hero-sub">
            Technical guides, architecture blueprints, product manuals, release notes, and developer APIs for auto services and modern businesses.
          </p>
          <div>
            <Link className="button button--primary button--lg" to="/intro" style={{ marginRight: 12, fontWeight: 700, borderRadius: 12 }}>
              Explore Documentation →
            </Link>
            <Link className="button button--secondary button--lg" to="/releases/v2.0.0" style={{ fontWeight: 600, borderRadius: 12 }}>
              View v2.0.0 Changelog
            </Link>
          </div>
        </section>

        <section style={{ paddingBottom: 64 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 6 }}>
            Browse Documentation by Category
          </h2>
          <p style={{ color: 'var(--ifm-color-gray-500)', marginBottom: 20 }}>
            Select a solution or engineering topic to view deep-dive guides and references.
          </p>

          <div className="portal-grid">
            {categories.map((cat, idx) => (
              <Link key={idx} to={cat.link} className="portal-card">
                <div className="portal-card-icon">{cat.icon}</div>
                <div className="portal-card-title">{cat.title}</div>
                <div className="portal-card-desc">{cat.desc}</div>
                <div className="portal-card-link">Read guide →</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
