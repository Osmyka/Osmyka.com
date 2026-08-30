---
id: index
title: Releases & Versioning Policy
sidebar_label: Versioning Policy
sidebar_position: 1
---

# Releases & Versioning Policy

Osmyka follows [Semantic Versioning 2.0.0](https://semver.org/) (`MAJOR.MINOR.PATCH`) across all platform products, client portals, and APIs.

---

## 📌 Versioning Breakdown

- **MAJOR (X.0.0)**: Substantial architectural upgrades, database schema restructuring, or breaking API contract updates.
- **MINOR (0.X.0)**: New functional modules, additional third-party integrations, UI component additions, or performance enhancements.
- **PATCH (0.0.X)**: Security patches, bug fixes, localization improvements, and cosmetic adjustments.

---

## 📅 Release History Overview

| Version | Release Date | Key Highlights | Status |
|---|---|---|:---:|
| **[v2.0.0](./v2.0.0.md)** | August 2026 | Modular CSS/JS Architecture, Docusaurus Hub, Light Theme, Branded SVGs | **Current (Stable)** |
| **[v1.0.0](./v1.0.0.md)** | August 2026 | Initial Public Release, AutoBook Engine, Workshop CRM, Interactive Hero | Supported |

---

## 🔄 Deployment & Rollout Schedule

1. **Continuous Automated Testing**: Every pull request undergoes automated cross-browser Playwright testing and lint validation.
2. **Zero-Downtime Releases**: Deployed via Cloudflare Pages and Edge serverless functions with atomic rollout switching.
3. **Automated Rollbacks**: Previous immutable deployment builds are preserved for instant single-click rollback in the event of an edge anomaly.
