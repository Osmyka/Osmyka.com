/**
 * Osmyka Matter.js 2D Physics Lab with Gravitational Attractor & Node Labels
 */
let matterEngine, matterWorld, matterRender, matterRunner;
let gravityEnabled = true;
let isMouseDown = false;
let mousePos = { x: 0, y: 0 };

function initMatterPhysics() {
    const container = document.getElementById('matter-canvas-container');
    if (!container) return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint,
          Events = Matter.Events;

    matterEngine = Engine.create();
    matterWorld = matterEngine.world;

    matterRender = Render.create({
        element: container,
        engine: matterEngine,
        options: {
            width: container.clientWidth,
            height: container.clientHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    Render.run(matterRender);
    matterRunner = Runner.create();
    Runner.run(matterRunner, matterEngine);

    const width = container.clientWidth;
    const height = container.clientHeight;
    const wallOptions = { isStatic: true, render: { fillStyle: 'transparent', strokeStyle: 'transparent' } };

    // Bounding walls
    Composite.add(matterWorld, [
        Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions),
        Bodies.rectangle(-25, height / 2, 50, height, wallOptions),
        Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions),
        Bodies.rectangle(width / 2, -25, width, 50, wallOptions)
    ]);

    // Initial preset nodes
    const presets = ['LLM KERNEL', 'WEB OS', 'NODE.JS IPC', 'VECTOR DB', 'NEURAL MESH'];
    presets.forEach((label, idx) => {
        spawnPhysicsNode(label, 90 + idx * 120, 60);
    });

    // Mouse Interaction
    const mouse = Mouse.create(matterRender.canvas);
    const mouseConstraint = MouseConstraint.create(matterEngine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: true, strokeStyle: '#00f0ff' }
        }
    });

    Composite.add(matterWorld, mouseConstraint);
    matterRender.mouse = mouse;

    // Black Hole Mouse Press Listeners
    container.addEventListener('mousedown', (e) => { isMouseDown = true; updateMousePos(e); });
    window.addEventListener('mouseup', () => { isMouseDown = false; });
    container.addEventListener('mousemove', (e) => { updateMousePos(e); });

    // Touch support for black hole
    container.addEventListener('touchstart', (e) => { 
        if (e.touches.length > 0) {
            isMouseDown = true; 
            updateTouchPos(e);
        }
    }, { passive: true });
    window.addEventListener('touchend', () => { isMouseDown = false; });
    container.addEventListener('touchmove', (e) => { 
        if (e.touches.length > 0) {
            updateTouchPos(e);
        }
    }, { passive: true });

    // Apply Black Hole Physics Force loop
    Events.on(matterEngine, 'beforeUpdate', () => {
        if (isMouseDown) {
            const bodies = Composite.allBodies(matterWorld);
            bodies.forEach(body => {
                if (!body.isStatic) {
                    const dx = mousePos.x - body.position.x;
                    const dy = mousePos.y - body.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > 10) {
                        const force = 0.0009 * body.mass;
                        Matter.Body.applyForce(body, body.position, {
                            x: (dx / dist) * force,
                            y: (dy / dist) * force
                        });
                    }
                }
            });
        }
    });

    // Custom text rendering on physics node badges
    Events.on(matterRender, 'afterRender', () => {
        const ctx = matterRender.context;
        const bodies = Composite.allBodies(matterWorld);

        ctx.font = 'bold 11px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        bodies.forEach(body => {
            if (body.customLabel) {
                ctx.save();
                ctx.translate(body.position.x, body.position.y);
                ctx.rotate(body.angle);
                ctx.fillStyle = body.customColor || '#00f0ff';
                ctx.shadowColor = body.customColor || '#00f0ff';
                ctx.shadowBlur = 6;
                ctx.fillText(body.customLabel, 0, 0);
                ctx.restore();
            }
        });

        // If Black Hole is active, draw a glowing vortex at mouse position
        if (isMouseDown) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(mousePos.x, mousePos.y, 22, 0, Math.PI * 2);
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 15;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(mousePos.x, mousePos.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#ff007a';
            ctx.shadowColor = '#ff007a';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.restore();
        }
    });
}

function updateMousePos(e) {
    const container = document.getElementById('matter-canvas-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
}

function updateTouchPos(e) {
    const container = document.getElementById('matter-canvas-container');
    if (!container || !e.touches[0]) return;
    const rect = container.getBoundingClientRect();
    mousePos.x = e.touches[0].clientX - rect.left;
    mousePos.y = e.touches[0].clientY - rect.top;
}

function spawnPhysicsNode(label, x, y) {
    if (!matterWorld) return;
    const container = document.getElementById('matter-canvas-container');
    if (!container) return;

    const spawnX = x || Math.random() * (container.clientWidth - 200) + 100;
    const spawnY = y || 50;

    const colors = ['#00f0ff', '#7000ff', '#3b82f6', '#10b981', '#ff007a'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    const body = Matter.Bodies.rectangle(spawnX, spawnY, 125, 42, {
        chamfer: { radius: 8 },
        restitution: 0.85,
        friction: 0.05,
        render: {
            fillStyle: 'rgba(12, 20, 39, 0.92)',
            strokeStyle: chosenColor,
            lineWidth: 2
        }
    });

    body.customLabel = label;
    body.customColor = chosenColor;

    Matter.Composite.add(matterWorld, body);
}

function toggleGravity() {
    if (!matterEngine) return;
    gravityEnabled = !gravityEnabled;
    matterEngine.gravity.y = gravityEnabled ? 1 : 0;
    const btn = document.getElementById('gravity-btn');
    if (btn) btn.innerText = gravityEnabled ? 'GRAVITY: ON' : 'GRAVITY: ZERO';
}

function explodePhysicsNodes() {
    if (!matterWorld) return;
    const bodies = Matter.Composite.allBodies(matterWorld);
    bodies.forEach(body => {
        if (!body.isStatic) {
            const force = 0.08 * body.mass;
            Matter.Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * force * 2,
                y: (Math.random() - 0.5) * force * 2
            });
        }
    });
}
