import React, { useEffect } from 'react';
import DocsBottomBar from '../components/DocsBottomBar';

export default function Root({ children }) {
  useEffect(() => {
    // 1. Sync theme from main site on initial mount
    try {
      const osmykaTheme = localStorage.getItem('osmyka-theme');
      const docusaurusTheme = localStorage.getItem('theme');

      if (osmykaTheme && osmykaTheme !== docusaurusTheme) {
        localStorage.setItem('theme', osmykaTheme);
        document.documentElement.setAttribute('data-theme', osmykaTheme);
      } else if (docusaurusTheme && !osmykaTheme) {
        localStorage.setItem('osmyka-theme', docusaurusTheme);
      }
    } catch (e) {
      // Storage access protected in some private modes
    }

    // 2. Observe theme changes to keep osmyka-theme in sync
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme) {
        try {
          localStorage.setItem('osmyka-theme', currentTheme);
          localStorage.setItem('theme', currentTheme);
        } catch (e) {}
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {children}
      <DocsBottomBar />
    </>
  );
}
