/**
 * Osmyka — site interactions.
 * Header state, mobile navigation, scroll reveal, pointer-lit cards,
 * the animated work-order widget in the hero, and the consultation form.
 */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------------------ header */
    var header = document.getElementById('siteHeader');
    var onScroll = function () {
        if (header) header.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------------------------------------------------- mobile nav ---- */
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('siteNav');

    function closeNav() {
        if (!nav || !toggle) return;
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('nav-open');
    }

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            document.body.classList.toggle('nav-open', open);
        });
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) closeNav();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNav();
        });
    }

    /* --------------------------------------------------- scroll reveal -- */
    var revealables = document.querySelectorAll('.reveal');
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

    /* ------------------------------------------------ active nav links -- */
    var topNavLinks = document.querySelectorAll('.site-nav a[href^="#"]:not(.btn)');
    var bottomBarLinks = document.querySelectorAll('.bottom-bar-link');

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

        // Top nav active state
        Array.prototype.forEach.call(topNavLinks, function (a) {
            var id = a.getAttribute('href').slice(1);
            a.classList.toggle('active', id === activeId);
        });

        // Bottom bar active state
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

    /* ------------------------------------------------ pointer-lit cards -- */
    if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('pointermove', function (e) {
            var card = e.target.closest ? e.target.closest('.card') : null;
            if (!card) return;
            var rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
        }, { passive: true });
    }

    /* ------------------------------------------- hero work-order widget -- */
    (function workOrderWidget() {
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
        var stage = 2;
        var timer = null;
        var alive = true;

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
                li.classList.toggle('done', i < stage || (stage === last && i === last));
                li.classList.toggle('active', i === stage && stage !== last);
                var t = li.querySelector('i');
                if (!t) return;
                if (i < stage || stage === last) t.textContent = times[i];
                else if (i === stage) t.textContent = 'now';
                else t.textContent = '—';
            });

            bar.style.width = Math.round(((stage + (stage === last ? 1 : 0.5)) / (last + 1)) * 100) + '%';

            if (stage === last) {
                status.textContent = 'Ready for pickup';
                status.classList.add('done');
            } else {
                status.textContent = 'In progress';
                status.classList.remove('done');
            }

            setChip(parts, PARTS_BY_STAGE[stage]);
            setChip(slots, SLOTS_BY_STAGE[stage]);

            if (notify) {
                notify.textContent = stage === last ? 'Invoice sent to client' : 'SMS sent to client';
                notify.classList.remove('flash');
                void notify.offsetWidth;
                notify.classList.add('flash');
            }
        }

        function tick() {
            stage = stage >= last ? 0 : stage + 1;
            render();
            timer = window.setTimeout(tick, stage === last ? 4200 : 2600);
        }

        render();

        if (reduceMotion) return;

        function play() {
            if (timer === null && alive) timer = window.setTimeout(tick, 2600);
        }
        function pause() {
            window.clearTimeout(timer);
            timer = null;
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) pause(); else play();
        });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                alive = entries[0].isIntersecting;
                if (alive) play(); else pause();
            }, { threshold: 0.15 }).observe(list);
        } else {
            play();
        }
    })();

    /* ------------------------------------------------ animated counters -- */
    (function counters() {
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

        // the "under one second" fact sweeps its underline in at the same moment
        var facts = document.querySelector('.hero-facts');
        if (facts) {
            var factsIo = new IntersectionObserver(function (entries) {
                if (!entries[0].isIntersecting) return;
                factsIo.disconnect();
                facts.classList.add('lit');
            }, { threshold: 0.4 });
            factsIo.observe(facts);
        }
    })();

    /* ------------------------------------------- eased anchor scrolling -- */
    (function anchorScroll() {
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
            closeNav();
            glideTo(target.getBoundingClientRect().top + window.scrollY - getHeaderOffset(), hash);
        });
    })();

    /* ------------------------------- scroll progress + hero parallax ----- */
    (function scrollChoreography() {
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
    })();

    /* --------------------------------------- showcase previews auto-play -- */
    (function showcaseDemo() {
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
            // a card the visitor is already hovering keeps its own state
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
    })();

    /* ------------------------------------------------------------- form -- */
    (function contactForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;

        var statusEl = document.getElementById('formStatus');
        var submitBtn = document.getElementById('submitBtn');

        /* Set FORM_ENDPOINT to a POST URL (Cloudflare Pages Function, Formspree, …)
           to deliver submissions server-side. While it is empty, the form falls
           back to opening the visitor's own mail client. */
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
    })();

    /* ------------------------------------------------------------ misc -- */
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
})();
