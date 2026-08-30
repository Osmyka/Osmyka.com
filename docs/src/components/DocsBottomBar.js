import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

export default function DocsBottomBar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Active route matching
  const isHubHome = pathname === '/docs' || pathname === '/docs/';
  const isDocs = pathname.startsWith('/docs/intro') || pathname.startsWith('/docs/architecture') || pathname.startsWith('/docs/integrations');
  const isProducts = pathname.startsWith('/docs/products');
  const isReleases = pathname.startsWith('/docs/releases');

  const handleDocsToggle = (e) => {
    // If on mobile doc page, try to toggle Docusaurus sidebar if hamburger button exists
    const toggleBtn = document.querySelector('.navbar__toggle');
    const isDocPage = document.querySelector('.theme-doc-sidebar-container') || document.querySelector('.docPage__main');
    
    if (toggleBtn && isDocPage && !isHubHome) {
      e.preventDefault();
      toggleBtn.click();
    }
  };

  return (
    <nav className="docs-bottom-bar" aria-label="Mobile Documentation Navigation">
      <div className="docs-bottom-bar-inner">
        
        {/* 1. HUB HOME */}
        <Link
          to="/docs/"
          className={`docs-bottom-link ${isHubHome ? 'active' : ''}`}
          aria-label="Docs Hub"
        >
          <span className="docs-bottom-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5 12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9.5z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
              <circle cx="12" cy="7.5" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
          </span>
          <span className="docs-bottom-label">Hub</span>
        </Link>

        {/* 2. DOCS & SECTIONS */}
        <Link
          to="/docs/intro"
          onClick={handleDocsToggle}
          className={`docs-bottom-link ${isDocs ? 'active' : ''}`}
          aria-label="Documentation Tree"
        >
          <span className="docs-bottom-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <line x1="9" y1="7" x2="15" y2="7"/>
              <line x1="9" y1="11" x2="13" y2="11"/>
              <circle cx="16" cy="11" r="1.2" fill="currentColor" stroke="none"/>
            </svg>
          </span>
          <span className="docs-bottom-label">Docs</span>
        </Link>

        {/* 3. PRODUCTS */}
        <Link
          to="/docs/products/autobook"
          className={`docs-bottom-link ${isProducts ? 'active' : ''}`}
          aria-label="Products"
        >
          <span className="docs-bottom-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" rx="1.5"/>
              <rect x="14" y="3" width="7" height="5" rx="1.5"/>
              <rect x="14" y="12" width="7" height="9" rx="1.5"/>
              <rect x="3" y="16" width="7" height="5" rx="1.5"/>
              <circle cx="6.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>
              <circle cx="17.5" cy="16.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </span>
          <span className="docs-bottom-label">Products</span>
        </Link>

        {/* 4. RELEASES */}
        <Link
          to="/docs/releases/v2.0.0"
          className={`docs-bottom-link ${isReleases ? 'active' : ''}`}
          aria-label="Releases & Changelog"
        >
          <span className="docs-bottom-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              <circle cx="12" cy="11" r="2.2" fill="currentColor" stroke="none"/>
            </svg>
          </span>
          <span className="docs-bottom-label">Releases</span>
        </Link>

        {/* 5. MAIN SITE */}
        <a
          href="/"
          className="docs-bottom-link docs-bottom-cta"
          aria-label="Return to Osmyka Homepage"
        >
          <span className="docs-bottom-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </span>
          <span className="docs-bottom-label">Site ↗</span>
        </a>

      </div>
    </nav>
  );
}
