# Osmyka OÜ — сайт-визитка и витрина продуктов

Одностраничный сайт студии **Osmyka OÜ** (Таллинн, Эстония): веб-разработка под ключ,
кастомные CRM/ERP для автосервисов и малого бизнеса, онлайн-бронирование,
хостинг и сопровождение по подписке.

Стек: **чистый HTML + CSS + vanilla JS**, без сборки и без внешних библиотек.
Одна страница = 3 локальных файла (HTML/CSS/JS) + шрифты Google Fonts.

---

## 📁 Структура

```text
osmyka.com/
├── index.html          # Вся страница: 7 секций + SEO/OG-разметка + JSON-LD
├── css/styles.css      # Дизайн-система (токены, стекло, свечения, адаптив, reduced-motion)
├── js/
│   ├── background.js   # Canvas-фон героя: сеть частиц (без библиотек, ~3 КБ)
│   └── app.js          # Хедер, мобильное меню, scroll-reveal, виджет заказ-наряда, форма
├── favicon.svg
├── robots.txt / sitemap.xml
├── _headers            # Заголовки безопасности и кеширования (Cloudflare Pages)
├── _redirects          # SPA-фолбэк
└── _archive/           # Прошлая версия лендинга (Three.js/Matter.js/терминал) — можно удалить
```

---

## 🧭 Структура страницы (соответствие ТЗ)

| # | Секция | Якорь | Что внутри |
|---|--------|-------|-----------|
| 1 | Hero | `#hero` | Заголовок-оффер, подзаголовок, 2 CTA, живой виджет заказ-наряда + карточка свободного слота |
| 2 | Фокус на автосервисах | `#automotive` | `autobook`, `crm`, plug-and-play обслуживание |
| 3 | Услуги | `#services` | Сайты под ключ, кастомная CRM + автоматизация, хостинг и поддержка |
| 4 | Живые продукты | `#work` | AutoBook Engine, AutoService CRM, JAB Point, CADAutoScript (интерактивные превью при hover) |
| 5 | Почему Osmyka | `#why` | Сравнительная таблица «монолитная CRM vs кастомное решение» (на мобильных — карточки) |
| 6 | Технологии | `#stack` | Frontend / Backend & API / DevOps & Security |
| 7 | Контакты | `#contact` | Форма консультации + юридические данные в футере |

---

## ✅ Что нужно дозаполнить

1. **Приём заявок с формы.** По умолчанию форма валидируется на клиенте и открывает
   почтовый клиент посетителя (`mailto:info@osmyka.com`). Чтобы принимать заявки на сервере,
   укажите endpoint в `js/app.js`:
   ```js
   var FORM_ENDPOINT = ''; // → 'https://…' (Cloudflare Pages Function, Formspree и т.п.)
   ```
   Форма отправит `POST` с JSON: `fullName, business, email, phone, need, message`.

---

## ⚡ Производительность и доступность

- Нет Tailwind CDN, Three.js и Matter.js — только собственный CSS/JS (цель Lighthouse ≥ 90 по всем метрикам).
- Анимации — только на `transform` / `opacity`; фон на canvas ставится на паузу вне экрана и в фоновой вкладке.
- `prefers-reduced-motion: reduce` полностью отключает canvas-фон, параллакс и повторяющиеся анимации.
- Canvas отключается на слабых устройствах (`hardwareConcurrency ≤ 2` или `deviceMemory ≤ 2`).
- Семантическая разметка, skip-link, подписи ко всем полям, контраст текста ≥ 4.5:1.

---

## 💻 Локальный запуск

```powershell
npm run dev
```
или

```powershell
python -m http.server 4321
```
Затем откройте `http://localhost:4321`.

---

## 🚀 Деплой на Cloudflare Pages

**Вариант 1 — Wrangler (одна команда):**
```powershell
npx wrangler pages deploy . --project-name osmyka
```

**Вариант 2 — Direct Upload:** Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** →
**Upload assets** → перетащить содержимое папки → **Deploy site**.

**Вариант 3 — Git:** подключить репозиторий в **Pages → Connect to Git**.
Framework preset: `None`, build command: пусто, output directory: `.` (сборка не нужна).

### Домен
**Workers & Pages → osmyka → Custom domains → Set up a custom domain** → `osmyka.com` (и `www`).
Если DNS уже в Cloudflare — записи создаются в один клик, SSL выпускается автоматически.
