# 🧩 Osmyka UI Element System & Architecture Guide

Документация и руководство разработчика по компонентной базе, дизайн-токенам, типографике и архитектуре интерфейса **Osmyka OÜ**.

---

## 📁 Структура элементной базы

```
css/
├── styles.css                 # Главная точка входа и секционная сборка
├── tokens.css                 # Токены: палитры тем (Dark/Light), шрифты, радиусы, тени, анимации
├── base.css                   # CSS-reset, контейнеры (.container), адаптивные сетки (.grid, .grid-2, .grid-3, .grid-4)
└── components/
    ├── buttons.css            # Кнопки (.btn, .btn-primary, .btn-ghost, .btn-sm), переключатель тем (.theme-toggle)
    ├── cards.css              # Универсальные карточки (.card, .card-accent, .card-icon, .work-card, .stack-card, .legal-card)
    ├── badges.css             # Бейджи (.badge, .badge-live, .pill, .live-dot), потребительские теги (.tags)
    ├── forms.css              # Поля ввода (.contact-form, .field, .radio-row, .err, .form-status, .form-legal)
    ├── nav.css                # Фиксированная шапка (.site-header), меню (.site-nav), мобильная шторка (.bottom-bar, .legal-top-bar)
    ├── mockups.css            # Интерактивные демо-виджеты (.device, .wo-*, .float-card, .preview-*)
    ├── tables.css             # Сравнительные таблицы (.compare, .compare-table) и их мобильная трансформация в карточки
    └── footer.css             # Адаптивный подвал (.site-footer, .footer-inner, .footer-bottom)
```

---

## 🎨 Дизайн-токены (CSS Custom Properties)

Все цвета, тени, радиусы и шрифты определены через CSS-переменные в [tokens.css](file:///e:/My%20web%20projects/osmyka.com/css/tokens.css).

### Основные переменные темы:

| Токен | Dark Theme (По умолчанию) | Light Theme (`[data-theme="light"]`) | Назначение |
|---|---|---|---|
| `--bg` | `#050912` | `#f8fafc` | Основной фон страницы |
| `--bg-alt` | `#070d1a` | `#ffffff` | Чередующийся фон секций / подвала |
| `--panel` | `rgba(14, 22, 40, 0.72)` | `rgba(255, 255, 255, 0.86)` | Фон карточек и панелей с `backdrop-filter: blur()` |
| `--panel-solid` | `#0b1322` | `#ffffff` | Непрозрачный фон всплывающих плашек |
| `--text` | `#e8eefb` | `#0f172a` | Основной текст |
| `--text-strong` | `#ffffff` | `#020617` | Заголовки и важные акценты (WCAG AAA) |
| `--muted` | `#a9b8cf` | `#334155` | Вторичный текст и описания |
| `--dim` | `#7d8da3` | `#64748b` | Метаданные, подписи дат |
| `--cyan` | `#38e1ff` | `#0284c7` | Фирменный технологический акцент |
| `--violet` | `#8b7bff` | `#6366f1` | Вторичный градиентный акцент |
| `--green` | `#34d399` | `#059669` | Индикаторы статуса online / подтверждения |
| `--amber` | `#fbbf24` | `#d97706` | Индикаторы процесса / ожидания |
| `--line` | `rgba(125, 180, 255, 0.14)` | `rgba(15, 23, 42, 0.09)` | Разделители и границы карточек |
| `--line-strong` | `rgba(56, 225, 255, 0.42)` | `rgba(2, 132, 199, 0.38)` | Подсветка активных/hover границ |

---

## 🧱 Каталог UI-элементов (Component Catalog)

### 1. Кнопки (`components/buttons.css`)

#### Основная кнопка (Primary):
```html
<a class="btn btn-primary" href="#contact">
  Записаться на консультацию
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7"/>
  </svg>
</a>
```

#### Прозрачная кнопка (Ghost):
```html
<a class="btn btn-ghost" href="/terms">
  Условия обслуживания
</a>
```

#### Маленькая кнопка (`.btn-sm`):
```html
<a class="btn btn-primary btn-sm" href="#contact">Консультация</a>
```

#### Кнопка переключения темы (Theme Toggle):
```html
<button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to light theme" title="Toggle theme (Light/Dark)">
  <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
</button>
```

---

### 2. Бейджи, пиллы и теги (`components/badges.css`)

#### Пульсирующий статус (Pill):
```html
<div class="pill">
  <span class="pill-dot"></span>
  Индивидуальная разработка &middot; Эстония / ЕС
</div>
```

#### Бейдж "Live demo":
```html
<span class="badge badge-live">
  <span class="live-dot"></span>
  Live demo
</span>
```

#### Потребительские теги преимуществ (`.tags`):
```html
<div class="tags">
  <span>24/7 доступ из любой точки</span>
  <span>Адаптация под смартфоны и ПК</span>
  <span>Многоуровневое резервирование</span>
  <span>Защита данных корпоративного уровня</span>
</div>
```

---

### 3. Карточки (`components/cards.css`)

#### Карточка услуги с подсветкой курсора:
```html
<article class="card card-service reveal" tabindex="0">
  <span class="card-num" aria-hidden="true">01</span>
  <h3 class="card-title">Сайты под ключ</h3>
  <p class="card-text">Высокопроизводительные порталы и веб-инструменты с моментальной загрузкой.</p>
  <ul class="feature-list">
    <li>Mobile-first и SEO-оптимизация</li>
    <li>Быстрая загрузка без тяжелых фреймворков</li>
    <li>Прямая интеграция форм захвата лидов</li>
  </ul>
</article>
```

---

### 4. Формы ввода (`components/forms.css`)

```html
<form class="contact-form" id="contactForm" novalidate>
  <div class="field-row">
    <div class="field">
      <label for="fullName">Ваше имя *</label>
      <input type="text" id="fullName" name="fullName" placeholder="Иван Иванов" required>
      <span class="err" data-err="fullName"></span>
    </div>
    <div class="field">
      <label for="email">Электронная почта *</label>
      <input type="email" id="email" name="email" placeholder="ivan@autoservice.ee" required>
      <span class="err" data-err="email"></span>
    </div>
  </div>

  <div class="field">
    <label>Интересующее направление</label>
    <div class="radio-row">
      <label class="radio">
        <input type="radio" name="need" value="CRM" checked>
        <span>CRM-система</span>
      </label>
      <label class="radio">
        <input type="radio" name="need" value="Booking">
        <span>Онлайн-запись</span>
      </label>
      <label class="radio">
        <input type="radio" name="need" value="Website">
        <span>Сайт под ключ</span>
      </label>
    </div>
  </div>

  <button class="btn btn-primary btn-block" type="submit" id="submitBtn">
    Отправить заявку
  </button>
  <div class="form-status" id="formStatus" aria-live="polite"></div>
</form>
```

---

## ⚡ Модульная JavaScript Архитектура (`window.Osmyka`)

Все интерактивные возможности инкапсулированы в модульный реестр `window.Osmyka` в файле [js/app.js](file:///e:/My%20web%20projects/osmyka.com/js/app.js):

- **`Osmyka.Theme`**: Управление сменой тем (`applyTheme('light'|'dark', persist)`), сохранение в `localStorage`, поддержка `prefers-color-scheme`.
- **`Osmyka.Nav`**: Фиксированный хедер со скролл-эффектом, мобильное меню-шторка, управление доступностью ARIA.
- **`Osmyka.ActiveNav`**: Автоматическое подсвечивание активного пункта меню через `IntersectionObserver`.
- **`Osmyka.SmoothScroll`**: Плавный скролл по якорным ссылкам с компенсацией высоты фиксированного хедера и кубическим сглаживанием.
- **`Osmyka.ScrollChoreography`**: Индикатор прогресса чтения страницы (`#scrollBar`) и легкий параллакс в Hero.
- **`Osmyka.Reveal`**: Scroll-reveal анимации появления элементов с отключением для `prefers-reduced-motion`.
- **`Osmyka.Counters`**: Анимация числовых показателей (`data-count-to="99.9"`).
- **`Osmyka.CardsTilt`**: 3D-проекция и световой спотлайт карточек за курсором мыши.
- **`Osmyka.HeroWidget`**: Автономная интерактивная симуляция жизненного цикла наряд-заказа в Hero.
- **`Osmyka.Previews`**: Автоматические микро-анимации карточек в секции Live Demos.
- **`Osmyka.ContactForm`**: Валидация полей, подсветка ошибок и отправка через API/Mailto.
- **`Osmyka.Background`**: Контроллер частиц фонового Canvas ([js/background.js](file:///e:/My%20web%20projects/osmyka.com/js/background.js)) с кэшированием геометрии и остановкой в неактивных вкладках.

---

## 🚀 Как добавить новую страницу (Шаблон)

Для создания новой страницы (например, `/calculator` или `/case-study`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Новая страница | Osmyka OÜ</title>
  <meta name="theme-color" content="#050912">
  <meta name="color-scheme" content="dark light">
  
  <!-- 0ms FOUT предотвращение мерцания темы -->
  <script>
  (function(){try{var s=localStorage.getItem('osmyka-theme');var p=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',s||p);}catch(e){}})();
  </script>

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap">
  <link rel="stylesheet" href="/css/styles.css?v=dev">
</head>
<body>

  <!-- Хедер сайта с кнопкой переключения темы -->
  <header class="site-header scrolled" id="siteHeader">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="Osmyka — home">
        <span class="brand-text">osm<span class="brand-y">y</span>ka</span>
        <span class="brand-badge">OÜ</span>
      </a>
      <div class="header-actions">
        <button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch theme">
          <svg class="icon-moon" viewBox="0 0 24 24" ...></svg>
          <svg class="icon-sun" viewBox="0 0 24 24" ...></svg>
        </button>
      </div>
    </div>
  </header>

  <main class="section">
    <div class="container">
      <h1 class="section-title">Заголовок новой страницы</h1>
      <div class="grid grid-3">
        <!-- Готовые карточки из элементной базы -->
        <article class="card">
          <h3 class="card-title">Карточка 1</h3>
          <p class="card-text">Текст описания...</p>
        </article>
      </div>
    </div>
  </main>

  <script src="/js/app.js?v=dev" defer></script>
</body>
</html>
```
