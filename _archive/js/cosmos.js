/**
 * Osmyka Three.js 3D Neural Cosmos Simulation
 */
let scene, camera, renderer, particles, particlePositions, particleVelocities;
let lineSegments, linePositions, lineGeometry;
const particleCount = 1200;
let mouseX = 0, mouseY = 0;
let shockwavePulse = 0;
let warpMode = false;
let showConstellations = true;

function initThreeCosmos() {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040711, 0.0012);

    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 3000);
    camera.position.z = 900;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles Geometry
    const geometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(particleCount * 3);
    particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 2000;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

        particleVelocities[i * 3] = (Math.random() - 0.5) * 0.8;
        particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
        particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Custom Glowing Point Texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(0, 240, 255, 1)');
    grad.addColorStop(0.5, 'rgba(112, 0, 255, 0.6)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 9,
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Dynamic Constellation Lines
    lineGeometry = new THREE.BufferGeometry();
    const maxLines = 300 * 2 * 3;
    linePositions = new Float32Array(maxLines);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending
    });

    lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // Central Interactive Torus Knot (AI Core)
    const coreGeo = new THREE.TorusKnotGeometry(90, 25, 100, 16);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x7000ff,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.name = 'aiCore';
    scene.add(coreMesh);

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
}

function onMouseMove(e) {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.5;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.5;
}

function onTouchMove(e) {
    if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX - window.innerWidth / 2) * 0.5;
        mouseY = (e.touches[0].clientY - window.innerHeight / 2) * 0.5;
    }
}

function triggerShockwave() {
    shockwavePulse = 1.0;
}

function triggerWarpSpeed() {
    warpMode = true;
    setTimeout(() => { warpMode = false; }, 1800);
}

function toggleConstellations() {
    showConstellations = !showConstellations;
    if (lineSegments) lineSegments.visible = showConstellations;
    const btn = document.getElementById('const-btn');
    if (btn) btn.innerText = showConstellations ? '🕸️ LINKS: ON' : '🕸️ LINKS: OFF';
}

function resetParticles() {
    if (!particles) return;
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    particles.geometry.attributes.position.needsUpdate = true;
}

let frameCount = 0;
let lastFpsTime = performance.now();

function animateThree() {
    requestAnimationFrame(animateThree);

    // FPS Counter
    frameCount++;
    const now = performance.now();
    if (now - lastFpsTime >= 1000) {
        const fpsEl = document.getElementById('hud-fps');
        if (fpsEl) fpsEl.innerText = frameCount;
        frameCount = 0;
        lastFpsTime = now;
    }

    if (!scene || !camera || !renderer) return;

    // Rotate Core
    const core = scene.getObjectByName('aiCore');
    if (core) {
        core.rotation.x += warpMode ? 0.05 : 0.005;
        core.rotation.y += warpMode ? 0.08 : 0.008;
    }

    // Camera Motion
    camera.position.x += (mouseX - camera.position.x) * 0.04;
    camera.position.y += (-mouseY - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    if (particles) {
        const positions = particles.geometry.attributes.position.array;

        if (shockwavePulse > 0) {
            shockwavePulse -= 0.02;
        }

        let lineIndex = 0;
        const maxDist = 120;

        for (let i = 0; i < particleCount; i++) {
            let px = positions[i * 3];
            let py = positions[i * 3 + 1];
            let pz = positions[i * 3 + 2];

            let vx = particleVelocities[i * 3] * (warpMode ? 8 : 1);
            let vy = particleVelocities[i * 3 + 1] * (warpMode ? 8 : 1);
            let vz = particleVelocities[i * 3 + 2] * (warpMode ? 15 : 1);

            px += vx;
            py += vy;
            pz += vz;

            // Shockwave pulse expansion
            if (shockwavePulse > 0) {
                px += (px / Math.abs(px || 1)) * shockwavePulse * 15;
                py += (py / Math.abs(py || 1)) * shockwavePulse * 15;
            }

            // Wrap boundary
            if (Math.abs(px) > 1200) px = -px;
            if (Math.abs(py) > 1200) py = -py;
            if (pz > 1000) pz = -1000;
            if (pz < -1000) pz = 1000;

            positions[i * 3] = px;
            positions[i * 3 + 1] = py;
            positions[i * 3 + 2] = pz;

            // Constellations connection calculation (sampled for performance)
            if (showConstellations && i % 4 === 0 && lineIndex < 1200) {
                for (let j = i + 1; j < particleCount; j += 8) {
                    const dx = px - positions[j * 3];
                    const dy = py - positions[j * 3 + 1];
                    const dz = pz - positions[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < maxDist) {
                        linePositions[lineIndex++] = px;
                        linePositions[lineIndex++] = py;
                        linePositions[lineIndex++] = pz;

                        linePositions[lineIndex++] = positions[j * 3];
                        linePositions[lineIndex++] = positions[j * 3 + 1];
                        linePositions[lineIndex++] = positions[j * 3 + 2];
                    }
                }
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        if (showConstellations && lineGeometry) {
            lineGeometry.attributes.position.needsUpdate = true;
        }
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('three-canvas-container');
    if (!container || !renderer || !camera) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}
