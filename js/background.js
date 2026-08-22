/**
 * Osmyka — hero background.
 * Lightweight canvas particle network (no external libraries, ~3 KB).
 * Degrades gracefully: disabled for reduced-motion users and low-power devices,
 * paused when the hero scrolls out of view or the tab is hidden.
 */
(function () {
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
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    var w = 0, h = 0;
    var nodes = [];
    var pointer = { x: -9999, y: -9999, active: false };
    var running = true;
    var visible = true;
    var rafId = null;

    var LINK_DIST = 130;
    var CYAN = '56, 225, 255';
    var VIOLET = '139, 123, 255';

    function nodeCount() {
        var area = w * h;
        var base = Math.round(area / 17000);
        return Math.max(28, Math.min(base, window.innerWidth < 760 ? 42 : 92));
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
        var rect = hero.getBoundingClientRect();
        w = Math.max(rect.width, 1);
        h = Math.max(rect.height, 1);
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

            // soft repulsion around the pointer
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

        // links
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
                ctx.strokeStyle = 'rgba(' + CYAN + ',' + (0.16 * (1 - dist / LINK_DIST)).toFixed(3) + ')';
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }

        // nodes
        for (i = 0; i < nodes.length; i++) {
            a = nodes[i];
            ctx.fillStyle = 'rgba(' + (a.violet ? VIOLET : CYAN) + ', 0.65)';
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
            ctx.fill();
        }

        rafId = window.requestAnimationFrame(frame);
    }

    function start() {
        if (rafId === null && running && visible) rafId = window.requestAnimationFrame(frame);
    }

    // ---- events -----------------------------------------------------------
    var resizeTimer = null;
    window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () { resize(); start(); }, 180);
    });

    hero.addEventListener('pointermove', function (e) {
        var rect = hero.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        pointer.active = true;
    }, { passive: true });

    hero.addEventListener('pointerleave', function () { pointer.active = false; });

    document.addEventListener('visibilitychange', function () {
        running = !document.hidden;
        start();
    });

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            start();
        }, { threshold: 0 }).observe(hero);
    }

    resize();
    start();
})();
