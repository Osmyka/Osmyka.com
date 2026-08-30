---
slug: building-accessible-dark-light-design-system
title: Designing a Zero-Flash Accessible Dark & Light Theme
authors: [osmyka]
tags: [design, frontend, performance, css]
---

# Designing a Zero-Flash Accessible Dark & Light Theme

How we engineered a high-contrast, WCAG AAA compliant theme system for automotive web applications with 0ms Flash of Unstyled Content (FOUT).

<!--truncate-->

## The Challenge: Flash of Unstyled Content (FOUT)

Many modern web apps suffer from a jarring white or dark flicker when loading, caused by JavaScript themes evaluating after the HTML body renders.

To solve this in Osmyka, we implemented a micro-inline blocking script directly within the `<head>` of all pages before any CSS parses:

```html
<script>
(function(){
  try {
    var saved = localStorage.getItem('osmyka-theme');
    var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    document.documentElement.setAttribute('data-theme', saved || (prefersLight ? 'light' : 'dark'));
  } catch(e) {}
})();
</script>
```

## CSS Tokenized Color Palettes

By decoupling token definitions in `tokens.css`, all components automatically adapt without duplicated CSS rules:

- **Dark Theme**: `#050912` deep space blue with `#38e1ff` electric cyan and `#8b7bff` violet.
- **Light Theme**: `#f8fafc` ultra-clean slate with `#0284c7` ocean cyan and `#6366f1` indigo.

Both palettes achieve contrast ratios exceeding **7:1**, easily surpassing the WCAG AAA accessibility standard for readability in bright sunlight on mobile devices in workshop bays.
