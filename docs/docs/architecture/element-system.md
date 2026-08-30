---
id: element-system
title: UI Element System & Component Guide
sidebar_label: UI Element System
sidebar_position: 3
---

# Osmyka UI Element System & Component Guide

The **Osmyka UI Element System** is a modular, zero-dependency design system built specifically for fast, responsive web interfaces with native dark/light theme switching.

---

## 🎨 Design Tokens & Theme Palettes

All colors, elevations, radii, and typography scales are defined in `tokens.css`:

```css
:root {
    --bg: #050912;
    --panel: rgba(14, 22, 40, 0.72);
    --text: #e8eefb;
    --text-strong: #ffffff;
    --muted: #a9b8cf;
    --dim: #7d8da3;
    --cyan: #38e1ff;
    --violet: #8b7bff;
    --green: #34d399;
    --line: rgba(125, 180, 255, 0.14);
}

[data-theme="light"] {
    --bg: #f8fafc;
    --panel: rgba(255, 255, 255, 0.86);
    --text: #0f172a;
    --text-strong: #020617;
    --muted: #334155;
    --dim: #64748b;
    --cyan: #0284c7;
    --violet: #6366f1;
    --green: #059669;
    --line: rgba(15, 23, 42, 0.09);
}
```

---

## 🧩 Key UI Components

### 1. Button System (`buttons.css`)

```html
<a class="btn btn-primary" href="#contact">
  Primary Action
</a>

<a class="btn btn-ghost" href="#learn-more">
  Ghost Action
</a>
```

### 2. Live Status Badge & Consumer Tags (`badges.css`)

```html
<span class="badge badge-live">
  <span class="live-dot"></span>
  Live Demo
</span>

<div class="tags">
  <span>24/7 Cloud Access</span>
  <span>Multi-Level Backup</span>
  <span>Enterprise Security</span>
</div>
```

### 3. Universal Card Component (`cards.css`)

Cards support dynamic mouse pointer spotlights using CSS custom variables `--mx` and `--my`:

```html
<article class="card card-service" tabindex="0">
  <span class="card-num">01</span>
  <h3 class="card-title">Solution Title</h3>
  <p class="card-text">Description text...</p>
</article>
```

---

## ⚡ JavaScript Modular Namespace (`window.Osmyka`)

Interactive behaviors are encapsulated into standalone modules inside `js/app.js`:

- `Osmyka.Theme`: Theme toggling, localStorage persistence, system preference synchronization.
- `Osmyka.Nav`: Sticky header scroll styling, mobile menu drawer, ARIA states.
- `Osmyka.SmoothScroll`: Eased cubic anchor scrolling with fixed header offset compensation.
- `Osmyka.Reveal`: IntersectionObserver viewport reveal animations.
- `Osmyka.Counters`: Viewport-triggered animated numeric statistics.
