/* ============================================================
 * ambient.js — full-page ambient backdrop for the brew-tap landing.
 *
 * A second WebGL canvas sits behind the whole page, behind the
 * per-section WebGL hero. It carries:
 *   - a slow drifting starfield of 600+ points spread across the
 *     full viewport, lit in the brew palette (orange / yellow / green)
 *   - long thin volumetric beams that sweep diagonally across the
 *     viewport every few seconds
 *
 * The canvas is fixed to the viewport and sized to window.innerWidth
 * × window.innerHeight. The render loop pauses when the document is
 * hidden (visibilitychange) and the canvas is hidden via the
 * .is-hidden class when prefers-reduced-motion is on.
 * ============================================================ */

import * as THREE from 'three';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WEBGL_OK = (() => {
    try {
        const probe = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (probe.getContext('webgl2') || probe.getContext('webgl')));
    } catch (e) {
        return false;
    }
})();

export function initAmbient(canvas) {
    if (!canvas) return false;
    if (REDUCED_MOTION || !WEBGL_OK) {
        canvas.classList.add('is-hidden');
        return false;
    }

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: false,
            alpha: true,
            powerPreference: 'low-power',
        });
    } catch (err) {
        console.error('[ambient] WebGL renderer failed', err);
        canvas.classList.add('is-hidden');
        return false;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    camera.position.set(0, 0, 30);

    // --- Starfield ----------------------------------------------------
    const particleCount = 720;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const palette = [
        [1.0, 0.48, 0.27], // orange
        [1.0, 0.82, 0.4],  // yellow
        [0.15, 0.82, 0.63], // green
        [0.95, 0.62, 0.5], // soft orange
        [0.78, 0.78, 0.78], // dim white
    ];
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = -Math.random() * 80;
        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3 + 0] = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];
        sizes[i] = Math.random() < 0.05 ? 0.25 + Math.random() * 0.35 : 0.04 + Math.random() * 0.08;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // --- Long sweeping beams -----------------------------------------
    const beamGroup = new THREE.Group();
    scene.add(beamGroup);

    const beamColors = [0xff7a45, 0xffd166, 0x25d0a0];
    const beams = [];
    for (let i = 0; i < 3; i++) {
        const planeGeo = new THREE.PlaneGeometry(0.08, 60);
        const planeMat = new THREE.MeshBasicMaterial({
            color: beamColors[i],
            transparent: true,
            opacity: 0.05,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
        });
        const beam = new THREE.Mesh(planeGeo, planeMat);
        beam.rotation.z = (i * Math.PI) / 4;
        beam.userData.t0 = Math.random() * Math.PI * 2;
        beam.userData.swings = 0.18 + i * 0.04;
        beam.position.set(0, 0, -10 - i * 4);
        beamGroup.add(beam);
        beams.push(beam);
    }

    // --- Pointer parallax -------------------------------------------
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener('pointermove', (e) => {
        pointer.tx = (e.clientX / window.innerWidth) - 0.5;
        pointer.ty = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    // --- Resize ------------------------------------------------------
    const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w === 0 || h === 0) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    };
    resize();
    // Re-run on the next two frames to catch layouts that hadn't
    // settled on first call (mobile address bar, font swaps, etc).
    requestAnimationFrame(resize);
    requestAnimationFrame(() => requestAnimationFrame(resize));
    window.addEventListener('resize', resize, { passive: true });

    // --- Animation loop ---------------------------------------------
    const clock = new THREE.Clock();

    const animate = () => {
        const t = clock.getElapsedTime();

        pointer.x += (pointer.tx - pointer.x) * 0.025;
        pointer.y += (pointer.ty - pointer.y) * 0.025;

        camera.position.x = pointer.x * 1.8;
        camera.position.y = -pointer.y * 1.2;
        camera.lookAt(0, 0, 0);

        points.rotation.y = t * 0.012;
        points.rotation.x = Math.sin(t * 0.05) * 0.04;

        beams.forEach((beam) => {
            beam.rotation.z = beam.userData.t0 + Math.sin(t * beam.userData.swings) * 0.5;
            beam.material.opacity = 0.035 + 0.04 * (0.5 + 0.5 * Math.sin(t * 0.5 + beam.userData.t0));
        });

        renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // Pause when the document is hidden — saves battery in background tabs.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            renderer.setAnimationLoop(null);
        } else {
            renderer.setAnimationLoop(animate);
        }
    });

    return true;
}