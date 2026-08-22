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

    /* ------------------------------------------------ active nav link --- */
    var navLinks = document.querySelectorAll('.site-nav a[href^="#"]:not(.btn)');
    if ('IntersectionObserver' in window && navLinks.length) {
        var linkMap = {};
        Array.prototype.forEach.call(navLinks, function (a) {
            linkMap[a.getAttribute('href').slice(1)] = a;
        });
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var link = linkMap[entry.target.id];
                if (!link) return;
                if (entry.isIntersecting) {
                    Array.prototype.forEach.call(navLinks, function (a) { a.classList.remove('active'); });
                    link.classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        Object.keys(linkMap).forEach(function (id) {
            var section = document.getElementById(id);
            if (section) sectionObserver.observe(section);
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
        var last = steps.length - 1;
        var stage = 2;
        var timer = null;
        var alive = true;

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
