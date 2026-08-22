# Osmyka OÜ — product & services site

Single-page website for **Osmyka OÜ** (Tallinn, Estonia): turnkey web development,
custom CRM/ERP systems for auto repair shops and small businesses, online booking,
plus hosting and maintenance on a subscription.

Stack: **plain HTML + CSS + vanilla JS** — no build step, no external libraries.
The whole page is three local files (HTML/CSS/JS) plus Google Fonts.

---

## 📁 Structure

```text
osmyka.com/
├── index.html          # Whole page: 7 sections + SEO/OG meta + JSON-LD
├── css/styles.css      # Design system (tokens, glass, glows, responsive, reduced-motion)
├── js/
│   ├── background.js   # Hero canvas background: particle network (no libraries, ~5 KB)
│   └── app.js          # Header, mobile nav, scroll reveal, work-order widget, form
├── favicon.svg
├── robots.txt / sitemap.xml
├── _headers            # Security and caching headers (Cloudflare Pages)
├── _redirects          # SPA fallback
└── _archive/           # Previous landing page (Three.js/Matter.js/terminal) — safe to delete
```

---

## 🧭 Page sections

| # | Section | Anchor | Contents |
|---|---------|--------|----------|
| 1 | Hero | `#hero` | Value proposition, sub-headline, two CTAs, live work-order widget + free-slot card |
| 2 | Automotive focus | `#automotive` | `autobook`, `crm`, plug-and-play maintenance |
| 3 | Services | `#services` | Turnkey websites, custom CRM + automation, hosting and support |
| 4 | Live products | `#work` | AutoBook Engine, AutoService CRM, JAB Point, CADAutoScript (interactive hover previews) |
| 5 | Why Osmyka | `#why` | Comparison table "monolithic CRM vs custom solution" (stacked cards on mobile) |
| 6 | Technology | `#stack` | Frontend / Backend & API / DevOps & Security |
| 7 | Contact | `#contact` | Consultation form + legal details in the footer |

---

## ✅ Still to configure

**Form submissions.** By default the form validates on the client and opens the
visitor's own mail client (`mailto:info@osmyka.com`). To receive submissions
server-side, set an endpoint in `js/app.js`:

```js
var FORM_ENDPOINT = ''; // → 'https://…' (Cloudflare Pages Function, Formspree, etc.)
```

The form then sends a `POST` with JSON: `fullName, business, email, phone, need, message`.

---

## ⚡ Performance & accessibility

- No Tailwind CDN, Three.js or Matter.js — only first-party CSS/JS (targeting Lighthouse ≥ 90 across all categories).
- Animations run on `transform` / `opacity` only; the canvas background pauses off-screen and in background tabs.
- `prefers-reduced-motion: reduce` fully disables the canvas background, parallax and looping animations.
- The canvas is skipped on low-power devices (`hardwareConcurrency ≤ 2` or `deviceMemory ≤ 2`).
- Semantic markup, skip link, labels on every field, text contrast ≥ 4.5:1.

---

## 💻 Run locally

```powershell
npm run dev
```

or

```powershell
python -m http.server 4321
```

Then open `http://localhost:4321`.

---

## 🚀 Deployment

The site runs on the Cloudflare Pages project **`osmyka`** (`osmyka.pages.dev`, `osmyka.com`).
It is a Direct Upload project, which Cloudflare cannot convert to a native Git integration,
so deployments are driven by GitHub Actions instead.

### Automatic — push to `main`

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) copies the shipped files into
`dist/` and runs `wrangler pages deploy` against the `osmyka` project on every push to `main`
(and on demand via **Actions → Deploy to Cloudflare Pages → Run workflow**).

Required repository secrets — **Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | API token with the **Cloudflare Pages: Edit** permission (create at *My Profile → API Tokens*) |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID from the Cloudflare dashboard URL |

When adding a new top-level asset (image, extra page, `.well-known`, …), add it to the
`Assemble site` step of the workflow — only the files listed there are uploaded.

### Manual fallback

```powershell
npx wrangler pages deploy . --project-name osmyka
```

### Custom domain

**Workers & Pages → osmyka → Custom domains** → `osmyka.com` (and `www`).
If DNS is already on Cloudflare the records are created in one click and SSL is issued automatically.
