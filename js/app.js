/**
 * ============================================================================
 * OSMYKA — Client Application Architecture
 * Modular, decoupled subsystems for theme, navigation, interactive widgets,
 * micro-interactions, scroll choreography, and form workflows.
 * ============================================================================
 */

(function (window, document) {
    'use strict';

    var Osmyka = window.Osmyka || {};
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================================================
       1. THEME MANAGER MODULE
       ========================================================================== */
    Osmyka.Theme = {
        metaTheme: null,
        toggles: [],

        getCurrentTheme: function () {
            var explicit = document.documentElement.getAttribute('data-theme');
            if (explicit) return explicit;
            try {
                var saved = localStorage.getItem('osmyka-theme');
                if (saved) return saved;
            } catch (e) {}
            return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        },

        applyTheme: function (theme, persist) {
            document.documentElement.setAttribute('data-theme', theme);
            if (this.metaTheme) {
                this.metaTheme.setAttribute('content', theme === 'light' ? '#f8fafc' : '#050912');
            }
            if (persist) {
                try {
                    localStorage.setItem('osmyka-theme', theme);
                } catch (e) {}
            }
            var nextLabel = theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
            Array.prototype.forEach.call(this.toggles, function (btn) {
                btn.setAttribute('aria-label', nextLabel);
                btn.setAttribute('title', nextLabel);
            });
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
        },

        toggle: function () {
            var current = this.getCurrentTheme();
            var next = current === 'light' ? 'dark' : 'light';
            this.applyTheme(next, true);
        },

        init: function () {
            var self = this;
            this.metaTheme = document.querySelector('meta[name="theme-color"]');
            this.toggles = document.querySelectorAll('.theme-toggle');

            Array.prototype.forEach.call(this.toggles, function (btn) {
                btn.addEventListener('click', function () { self.toggle(); });
            });

            try {
                var media = window.matchMedia('(prefers-color-scheme: light)');
                var handleMediaChange = function (e) {
                    try {
                        if (!localStorage.getItem('osmyka-theme')) {
                            self.applyTheme(e.matches ? 'light' : 'dark', false);
                        }
                    } catch (err) {}
                };
                if (media.addEventListener) {
                    media.addEventListener('change', handleMediaChange);
                } else if (media.addListener) {
                    media.addListener(handleMediaChange);
                }
            } catch (e) {}

            this.applyTheme(this.getCurrentTheme(), false);
        }
    };

    /* ==========================================================================
       2. NAVIGATION & MOBILE DRAWER MODULE
       ========================================================================== */
    Osmyka.Nav = {
        header: null,
        toggleBtn: null,
        navEl: null,

        closeNav: function () {
            if (!this.navEl || !this.toggleBtn) return;
            this.navEl.classList.remove('open');
            this.toggleBtn.setAttribute('aria-expanded', 'false');
            this.toggleBtn.setAttribute('aria-label', 'Open menu');
            document.body.classList.remove('nav-open');
        },

        init: function () {
            var self = this;
            this.header = document.getElementById('siteHeader');
            this.toggleBtn = document.getElementById('navToggle');
            this.navEl = document.getElementById('siteNav');

            // Sticky header scroll elevation
            var onScroll = function () {
                if (self.header) {
                    self.header.classList.toggle('scrolled', window.scrollY > 24);
                }
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();

            // Mobile menu toggling
            if (this.toggleBtn && this.navEl) {
                this.toggleBtn.addEventListener('click', function () {
                    var open = self.navEl.classList.toggle('open');
                    self.toggleBtn.setAttribute('aria-expanded', String(open));
                    self.toggleBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
                    document.body.classList.toggle('nav-open', open);
                });

                this.navEl.addEventListener('click', function (e) {
                    if (e.target.closest('a')) self.closeNav();
                });

                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape') self.closeNav();
                });
            }
        }
    };

    /* ==========================================================================
       3. ACTIVE SECTION SPY MODULE
       ========================================================================== */
    Osmyka.ActiveNav = {
        init: function () {
            var topNavLinks = document.querySelectorAll('.site-nav a[href^="#"]:not(.btn)');
            var bottomBarLinks = document.querySelectorAll('.bottom-bar-link');
            if (!topNavLinks.length && !bottomBarLinks.length) return;

            var BOTTOM_SECTION_MAP = {
                'hero': 'hero',
                'automotive': 'automotive',
                'services': 'services',
                'work': 'work',
                'why': 'work',
                'stack': 'services',
                'contact': 'contact'
            };

            function setActiveNav(activeId) {
                if (!activeId) return;

                // Desktop / header nav
                Array.prototype.forEach.call(topNavLinks, function (a) {
                    var id = a.getAttribute('href').slice(1);
                    a.classList.toggle('active', id === activeId);
                });

                // Mobile bottom action bar
                var bottomTargetId = BOTTOM_SECTION_MAP[activeId] || activeId;
                Array.prototype.forEach.call(bottomBarLinks, function (b) {
                    var id = b.getAttribute('href').slice(1);
                    var isActive = id === bottomTargetId;
                    b.classList.toggle('active', isActive);
                    if (isActive) {
                        b.setAttribute('aria-current', 'page');
                    } else {
                        b.removeAttribute('aria-current');
                    }
                });
            }

            if ('IntersectionObserver' in window) {
                var observedSectionIds = ['hero', 'automotive', 'services', 'work', 'why', 'stack', 'contact'];
                var sectionObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            setActiveNav(entry.target.id);
                        }
                    });
                }, { rootMargin: '-35% 0px -45% 0px', threshold: 0.05 });

                observedSectionIds.forEach(function (id) {
                    var sec = document.getElementById(id);
                    if (sec) sectionObserver.observe(sec);
                });
            }
        }
    };

    /* ==========================================================================
       4. SMOOTH EASING ANCHOR SCROLLER
       ========================================================================== */
    Osmyka.SmoothScroll = {
        init: function () {
            document.documentElement.classList.add('js-scroll');

            function getHeaderOffset() {
                var h = document.getElementById('siteHeader');
                if (h) return h.offsetHeight + 14;
                return window.innerWidth <= 860 ? 64 : 84;
            }

            var animating = false;

            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }

            function jump(y) {
                window.scrollTo({ top: y, left: 0, behavior: 'instant' });
            }

            function glideTo(y, hash) {
                var from = window.scrollY;
                var max = document.documentElement.scrollHeight - window.innerHeight;
                var to = Math.max(0, Math.min(y, max));
                var distance = to - from;

                if (reduceMotion || Math.abs(distance) < 4) {
                    jump(to);
                    if (hash) history.replaceState(null, '', hash);
                    return;
                }

                var duration = Math.min(1100, Math.max(450, Math.abs(distance) * 0.55));
                var start = null;
                animating = true;

                function abort() { animating = false; }
                window.addEventListener('wheel', abort, { passive: true, once: true });
                window.addEventListener('touchstart', abort, { passive: true, once: true });

                function step(ts) {
                    if (!animating) return;
                    if (start === null) start = ts;
                    var p = Math.min((ts - start) / duration, 1);
                    jump(from + distance * easeInOutCubic(p));
                    if (p < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        animating = false;
                        if (hash) history.replaceState(null, '', hash);
                    }
                }
                window.requestAnimationFrame(step);
            }

            document.addEventListener('click', function (e) {
                var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
                if (!link) return;
                var hash = link.getAttribute('href');
                if (!hash || hash === '#') return;

                var target = document.getElementById(hash.slice(1));
                if (!target) return;

                e.preventDefault();
                if (Osmyka.Nav && Osmyka.Nav.closeNav) Osmyka.Nav.closeNav();
                glideTo(target.getBoundingClientRect().top + window.scrollY - getHeaderOffset(), hash);
            });
        }
    };

    /* ==========================================================================
       5. SCROLL CHOREOGRAPHY & PARALLAX MODULE
       ========================================================================== */
    Osmyka.ScrollChoreography = {
        init: function () {
            var bar = document.getElementById('scrollBar');
            var heroVisual = document.querySelector('.hero-visual');
            var heroCopy = document.querySelector('.hero-copy');
            var hero = document.querySelector('.hero');
            var ticking = false;

            function frame() {
                ticking = false;
                var y = window.scrollY;

                if (bar) {
                    var max = document.documentElement.scrollHeight - window.innerHeight;
                    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
                }

                if (!reduceMotion && hero && y < hero.offsetHeight) {
                    if (heroVisual) heroVisual.style.transform = 'translate3d(0,' + (y * -0.06).toFixed(2) + 'px,0)';
                    if (heroCopy) {
                        heroCopy.style.transform = 'translate3d(0,' + (y * 0.04).toFixed(2) + 'px,0)';
                        heroCopy.style.opacity = String(Math.max(0.35, 1 - y / (hero.offsetHeight * 0.9)));
                    }
                }
            }

            function onScroll() {
                if (ticking) return;
                ticking = true;
                window.requestAnimationFrame(frame);
            }

            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll, { passive: true });
            frame();
        }
    };

    /* ==========================================================================
       6. SCROLL REVEAL MODULE
       ========================================================================== */
    Osmyka.Reveal = {
        init: function () {
            var revealables = document.querySelectorAll('.reveal');
            if (!revealables.length) return;

            if (!('IntersectionObserver' in window) || reduceMotion) {
                Array.prototype.forEach.call(revealables, function (el) { el.classList.add('visible'); });
            } else {
                var revealObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            revealObserver.unobserve(entry.target);
                        }
                    });
                }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

                Array.prototype.forEach.call(revealables, function (el) { revealObserver.observe(el); });
            }
        }
    };

    /* ==========================================================================
       7. ANIMATED NUMERIC COUNTERS
       ========================================================================== */
    Osmyka.Counters = {
        init: function () {
            var nodes = document.querySelectorAll('[data-count-to]');
            if (!nodes.length) return;

            function run(el) {
                var to = parseFloat(el.getAttribute('data-count-to'));
                var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
                var pre = el.getAttribute('data-prefix') || '';
                var suf = el.getAttribute('data-suffix') || '';
                if (isNaN(to)) return;

                if (reduceMotion) {
                    el.textContent = pre + to.toFixed(dec) + suf;
                    return;
                }

                var duration = 1500;
                var start = null;
                function step(ts) {
                    if (start === null) start = ts;
                    var p = Math.min((ts - start) / duration, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = pre + (to * eased).toFixed(dec) + suf;
                    if (p < 1) window.requestAnimationFrame(step);
                }
                window.requestAnimationFrame(step);
            }

            if (!('IntersectionObserver' in window)) {
                Array.prototype.forEach.call(nodes, run);
                return;
            }

            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    io.unobserve(entry.target);
                    run(entry.target);
                });
            }, { threshold: 0.4 });
            Array.prototype.forEach.call(nodes, function (el) { io.observe(el); });

            var facts = document.querySelector('.hero-facts');
            if (facts) {
                var factsIo = new IntersectionObserver(function (entries) {
                    if (!entries[0].isIntersecting) return;
                    factsIo.disconnect();
                    facts.classList.add('lit');
                }, { threshold: 0.4 });
                factsIo.observe(facts);
            }
        }
    };

    /* ==========================================================================
       8. POINTER SPOTLIGHT & 3D CARD TILT MODULE
       ========================================================================== */
    Osmyka.CardsTilt = {
        init: function () {
            if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
                document.addEventListener('pointermove', function (e) {
                    var card = e.target.closest ? e.target.closest('.card') : null;
                    if (!card) return;
                    var rect = card.getBoundingClientRect();
                    card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
                    card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
                }, { passive: true });
            }
        }
    };

    /* ==========================================================================
       9. HERO WORK-ORDER SIMULATION WIDGET
       ========================================================================== */
    Osmyka.HeroWidget = {
        timer: null,
        stage: 2,
        alive: true,

        init: function () {
            var self = this;
            var list = document.getElementById('woSteps');
            var bar = document.getElementById('woBar');
            var status = document.getElementById('woStatus');
            var notify = document.getElementById('woNotify');
            if (!list || !bar || !status) return;

            var steps = Array.prototype.slice.call(list.children);
            var times = steps.map(function (li) {
                var t = li.querySelector('i');
                return t ? (t.dataset.time || t.textContent) : '';
            });
            var parts = document.getElementById('woParts');
            var slots = document.getElementById('woSlots');
            var PARTS_BY_STAGE = [4, 4, 3, 2, 2];
            var SLOTS_BY_STAGE = [3, 3, 2, 2, 1];
            var last = steps.length - 1;

            function setChip(el, value) {
                if (!el || el.textContent === String(value)) return;
                el.textContent = String(value);
                el.classList.remove('bump');
                void el.offsetWidth;
                el.classList.add('bump');
                window.setTimeout(function () { el.classList.remove('bump'); }, 420);
            }

            function render() {
                steps.forEach(function (li, i) {
                    li.classList.toggle('done', i < self.stage || (self.stage === last && i === last));
                    li.classList.toggle('active', i === self.stage && self.stage !== last);
                    var t = li.querySelector('i');
                    if (!t) return;
                    if (i < self.stage || self.stage === last) t.textContent = times[i];
                    else if (i === self.stage) t.textContent = 'now';
                    else t.textContent = '—';
                });

                bar.style.width = Math.round(((self.stage + (self.stage === last ? 1 : 0.5)) / (last + 1)) * 100) + '%';

                if (self.stage === last) {
                    status.textContent = 'Ready for pickup';
                    status.classList.add('done');
                } else {
                    status.textContent = 'In progress';
                    status.classList.remove('done');
                }

                setChip(parts, PARTS_BY_STAGE[self.stage]);
                setChip(slots, SLOTS_BY_STAGE[self.stage]);

                if (notify) {
                    notify.textContent = self.stage === last ? 'Invoice sent to client' : 'SMS sent to client';
                    notify.classList.remove('flash');
                    void notify.offsetWidth;
                    notify.classList.add('flash');
                }
            }

            function tick() {
                self.stage = self.stage >= last ? 0 : self.stage + 1;
                render();
                self.timer = window.setTimeout(tick, self.stage === last ? 4200 : 2600);
            }

            function play() {
                if (self.timer === null && self.alive) self.timer = window.setTimeout(tick, 2600);
            }

            function pause() {
                window.clearTimeout(self.timer);
                self.timer = null;
            }

            render();

            if (reduceMotion) return;

            document.addEventListener('visibilitychange', function () {
                if (document.hidden) pause(); else play();
            });

            if ('IntersectionObserver' in window) {
                new IntersectionObserver(function (entries) {
                    self.alive = entries[0].isIntersecting;
                    if (self.alive) play(); else pause();
                }, { threshold: 0.15 }).observe(list);
            } else {
                play();
            }
        }
    };

    /* ==========================================================================
       10. SHOWCASE PREVIEWS AUTO-ANIMATION
       ========================================================================== */
    Osmyka.Previews = {
        init: function () {
            var cards = Array.prototype.slice.call(document.querySelectorAll('.work-card'));
            if (!cards.length || reduceMotion || !('IntersectionObserver' in window)) return;

            var onScreen = [];
            var cursor = 0;
            var timer = null;

            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    var i = onScreen.indexOf(entry.target);
                    if (entry.isIntersecting && i === -1) onScreen.push(entry.target);
                    if (!entry.isIntersecting && i !== -1) {
                        onScreen.splice(i, 1);
                        entry.target.classList.remove('demo');
                    }
                });
                schedule();
            }, { threshold: 0.45 });

            cards.forEach(function (c) { io.observe(c); });

            function play() {
                timer = null;
                if (!onScreen.length || document.hidden) { schedule(); return; }
                var card = onScreen[cursor % onScreen.length];
                cursor++;
                if (!card.matches(':hover')) {
                    card.classList.add('demo');
                    window.setTimeout(function () { card.classList.remove('demo'); }, 2400);
                }
                schedule();
            }

            function schedule() {
                if (timer !== null || !onScreen.length) return;
                timer = window.setTimeout(play, 3400);
            }

            document.addEventListener('visibilitychange', function () {
                if (!document.hidden) schedule();
            });
        }
    };

    /* ==========================================================================
       11. CONTACT FORM & VALIDATION MODULE
       ========================================================================== */
    Osmyka.ContactForm = {
        init: function () {
            var form = document.getElementById('contactForm');
            if (!form) return;

            var statusEl = document.getElementById('formStatus');
            var submitBtn = document.getElementById('submitBtn');

            /* Set FORM_ENDPOINT to a POST URL (Cloudflare Pages Function, Formspree, …) */
            var FORM_ENDPOINT = '';
            var MAIL_TO = 'info@osmyka.com';

            function setError(name, message) {
                var box = form.querySelector('[data-err="' + name + '"]');
                var input = form.elements[name];
                if (box) box.textContent = message || '';
                if (input && input.setAttribute) {
                    if (message) input.setAttribute('aria-invalid', 'true');
                    else input.removeAttribute('aria-invalid');
                }
            }

            function validate(data) {
                var ok = true;
                ['fullName', 'business', 'email', 'phone'].forEach(function (k) { setError(k, ''); });

                if (data.fullName.length < 2) { setError('fullName', 'Please tell us your name.'); ok = false; }
                if (data.business.length < 2) { setError('business', 'Business name or type helps us prepare.'); ok = false; }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) { setError('email', 'Enter a valid email address.'); ok = false; }
                if (data.phone && data.phone.replace(/[^\d]/g, '').length < 6) { setError('phone', 'Enter a valid phone number or leave it empty.'); ok = false; }
                return ok;
            }

            form.addEventListener('submit', function (e) {
                e.preventDefault();

                var data = {
                    fullName: form.elements.fullName.value.trim(),
                    business: form.elements.business.value.trim(),
                    email: form.elements.email.value.trim(),
                    phone: form.elements.phone.value.trim(),
                    need: (form.querySelector('input[name="need"]:checked') || {}).value || 'Other',
                    message: form.elements.message.value.trim()
                };

                if (!validate(data)) {
                    if (statusEl) statusEl.textContent = '';
                    var firstBad = form.querySelector('[aria-invalid="true"]');
                    if (firstBad) firstBad.focus();
                    return;
                }

                if (FORM_ENDPOINT) {
                    submitBtn.disabled = true;
                    if (statusEl) statusEl.textContent = 'Sending…';
                    fetch(FORM_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }).then(function (res) {
                        if (!res.ok) throw new Error('Request failed');
                        form.reset();
                        if (statusEl) statusEl.textContent = 'Thanks! We will reply within one business day.';
                    }).catch(function () {
                        if (statusEl) statusEl.textContent = 'Could not send — please write to ' + MAIL_TO + '.';
                    }).finally(function () {
                        submitBtn.disabled = false;
                    });
                    return;
                }

                var body = [
                    'Name: ' + data.fullName,
                    'Business: ' + data.business,
                    'Email: ' + data.email,
                    'Phone: ' + (data.phone || '—'),
                    'Interested in: ' + data.need,
                    '',
                    data.message || '(no additional details)'
                ].join('\n');

                var href = 'mailto:' + MAIL_TO +
                    '?subject=' + encodeURIComponent('Consultation request — ' + data.need + ' (' + data.business + ')') +
                    '&body=' + encodeURIComponent(body);

                if (statusEl) statusEl.textContent = 'Opening your email app — just press send.';
                window.location.href = href;
            });
        }
    };

    /* ==========================================================================
       12. APPLICATION ROOT INITIALIZATION
       ========================================================================== */
    Osmyka.init = function () {
        // Core utilities
        var year = document.getElementById('year');
        if (year) year.textContent = String(new Date().getFullYear());

        // Initialize all subsystems safely
        Osmyka.Theme.init();
        Osmyka.Nav.init();
        Osmyka.ActiveNav.init();
        Osmyka.SmoothScroll.init();
        Osmyka.ScrollChoreography.init();
        Osmyka.Reveal.init();
        Osmyka.Counters.init();
        Osmyka.CardsTilt.init();
        Osmyka.HeroWidget.init();
        Osmyka.Previews.init();
        Osmyka.ContactForm.init();
    };

    // Expose to window namespace
    window.Osmyka = Osmyka;

    // Run automatically on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', Osmyka.init);
    } else {
        Osmyka.init();
    }

})(window, document);
