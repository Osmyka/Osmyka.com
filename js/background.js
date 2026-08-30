/**
 * ============================================================================
 * OSMYKA — Hero Background Particle Canvas
 * Lightweight, GPU-friendly interactive particle network.
 * Supports dynamic Dark / Light theme palettes via themechange events.
 * Features layout caching, zero-overhead idle pausing, and reduced-motion safety.
 * ============================================================================
 */

(function (window, document) {
    'use strict';

    var canvas = document.getElementById('bgCanvas');
    if (!canvas || !canvas.getContext) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lowPower = (navigator.hardwareConcurrency || 8) <= 2 ||
                   (navigator.deviceMemory || 8) <= 2;

    if (reduceMotion || lowPower) {
        canvas.style.display = 'none';
        return;
    }

    var ctx = canvas.getContext('2d', { alpha: true });
    var hero = canvas.parentElement;
    if (!hero) return;

    var isMobile = window.innerWidth < 768;
    var dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    var w = 0, h = 0;
    var heroRect = null;
    var nodes = [];
    var pointer = { x: -9999, y: -9999, active: false };
    var running = true;
    var visible = true;
    var rafId = null;

    var LINK_DIST = isMobile ? 100 : 130;
    var CYAN = '56, 225, 255';
    var VIOLET = '139, 123, 255';
    var NODE_ALPHA = '0.65';
    var LINK_ALPHA_BASE = 0.16;

    function updateThemePalette() {
        var isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            CYAN = '2, 132, 199';
            VIOLET = '99, 102, 241';
            NODE_ALPHA = '0.55';
            LINK_ALPHA_BASE = 0.20;
        } else {
            CYAN = '56, 225, 255';
            VIOLET = '139, 123, 255';
            NODE_ALPHA = '0.65';
            LINK_ALPHA_BASE = 0.16;
        }
    }
    updateThemePalette();
    window.addEventListener('themechange', updateThemePalette);

    function nodeCount() {
        var area = w * h;
        var base = Math.round(area / (isMobile ? 22000 : 17000));
        return Math.max(16, Math.min(base, isMobile ? 26 : 92));
    }

    function build() {
        nodes = [];
        var count = nodeCount();
        for (var i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                r: Math.random() * 1.6 + 0.9,
                violet: Math.random() > 0.72
            });
        }
    }

    function resize() {
        heroRect = hero.getBoundingClientRect();
        w = Math.max(heroRect.width, 1);
        h = Math.max(heroRect.height, 1);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        build();
    }

    function frame() {
        rafId = null;
        if (!running || !visible) return;

        ctx.clearRect(0, 0, w, h);

        var i, j, a, b, dx, dy, dist;

        for (i = 0; i < nodes.length; i++) {
            a = nodes[i];
            a.x += a.vx;
            a.y += a.vy;

            if (a.x < -20) a.x = w + 20;
            else if (a.x > w + 20) a.x = -20;
            if (a.y < -20) a.y = h + 20;
            else if (a.y > h + 20) a.y = -20;

            // Soft repulsion around pointer
            if (pointer.active) {
                dx = a.x - pointer.x;
                dy = a.y - pointer.y;
                dist = dx * dx + dy * dy;
                if (dist < 14000 && dist > 1) {
                    var f = (14000 - dist) / 14000 * 0.5;
                    var len = Math.sqrt(dist);
                    a.x += (dx / len) * f;
                    a.y += (dy / len) * f;
                }
            }
        }

        // Particle connections
        ctx.lineWidth = 1;
        for (i = 0; i < nodes.length; i++) {
            a = nodes[i];
            for (j = i + 1; j < nodes.length; j++) {
                b = nodes[j];
                dx = a.x - b.x;
                dy = a.y - b.y;
                if (dx > LINK_DIST || dx < -LINK_DIST || dy > LINK_DIST || dy < -LINK_DIST) continue;
                dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > LINK_DIST) continue;
                ctx.strokeStyle = 'rgba(' + CYAN + ',' + (LINK_ALPHA_BASE * (1 - dist / LINK_DIST)).toFixed(3) + ')';
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }

        // Particle nodes
        for (i = 0; i < nodes.length; i++) {
            a = nodes[i];
            ctx.fillStyle = 'rgba(' + (a.violet ? VIOLET : CYAN) + ', ' + NODE_ALPHA + ')';
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
            ctx.fill();
        }

        rafId = window.requestAnimationFrame(frame);
    }

    function start() {
        if (rafId === null && running && visible) {
            rafId = window.requestAnimationFrame(frame);
        }
    }

    function stop() {
        if (rafId !== null) {
            window.cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    // Event listeners
    var resizeTimer = null;
    window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
            resize();
            start();
        }, 180);
    });

    window.addEventListener('scroll', function () {
        heroRect = null; // Invalidate cached rect on scroll
    }, { passive: true });

    hero.addEventListener('pointermove', function (e) {
        if (!heroRect) heroRect = hero.getBoundingClientRect();
        pointer.x = e.clientX - heroRect.left;
        pointer.y = e.clientY - heroRect.top;
        pointer.active = true;
    }, { passive: true });

    hero.addEventListener('pointerleave', function () {
        pointer.active = false;
    });

    document.addEventListener('visibilitychange', function () {
        running = !document.hidden;
        if (running) start(); else stop();
    });

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            if (visible) start(); else stop();
        }, { threshold: 0 }).observe(hero);
    }

    resize();
    start();

    // Expose background controller if namespace exists
    if (window.Osmyka) {
        window.Osmyka.Background = {
            start: start,
            stop: stop,
            resize: resize
        };
    }
})(window, document);
