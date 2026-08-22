/**
 * Osmyka Global Cursor Trail Particle System
 */
(function() {
    const cursorCanvas = document.getElementById('cursor-canvas');
    if (!cursorCanvas) return;
    const cCtx = cursorCanvas.getContext('2d');
    let cursorParticles = [];

    function resizeCursorCanvas() {
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCursorCanvas);
    resizeCursorCanvas();

    window.addEventListener('mousemove', (e) => {
        for (let i = 0; i < 3; i++) {
            cursorParticles.push({
                x: e.clientX,
                y: e.clientY,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                size: Math.random() * 4 + 2,
                alpha: 1,
                color: i % 2 === 0 ? '#00f0ff' : '#7000ff'
            });
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const t = e.touches[0];
            for (let i = 0; i < 2; i++) {
                cursorParticles.push({
                    x: t.clientX,
                    y: t.clientY,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 3 + 2,
                    alpha: 1,
                    color: '#00f0ff'
                });
            }
        }
    }, { passive: true });

    function animateCursorParticles() {
        cCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        for (let i = cursorParticles.length - 1; i >= 0; i--) {
            const p = cursorParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.03;

            if (p.alpha <= 0) {
                cursorParticles.splice(i, 1);
                continue;
            }

            cCtx.save();
            cCtx.globalAlpha = p.alpha;
            cCtx.fillStyle = p.color;
            cCtx.shadowColor = p.color;
            cCtx.shadowBlur = 8;
            cCtx.beginPath();
            cCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            cCtx.fill();
            cCtx.restore();
        }
        requestAnimationFrame(animateCursorParticles);
    }
    animateCursorParticles();
})();
