/* ============================================================
 * hero.js — kinetic Three.js scene for the brew-tap landing.
 *
 * What this scene is:
 *   A "brew" — a slowly-orbiting stack of glowing torus rings
 *   at the right side of the hero, surrounded by a drifting
 *   particle field of bright dots and code-glyph characters.
 *   The brew wobbles and precesses on its own axes, the camera
 *   parallaxes to the pointer, and the rings "exhale" outward
 *   in a periodic ripple. Everything is restrained enough to
 *   stay legible behind the headline copy.
 *
 * Design rules:
 *   - Honours prefers-reduced-motion (degrades to a static CSS
 *     gradient by hiding the canvas).
 *   - WebGL feature-detected; falls back gracefully.
 *   - Pauses its render loop when offscreen via IntersectionObserver.
 *   - No external textures, no glTF, no shaders from disk —
 *     everything procedural so the asset cost is the three module.
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

export function initHero(canvas) {
    if (!canvas) return false;
    if (REDUCED_MOTION || !WEBGL_OK) {
        canvas.classList.add('is-hidden');
        return false;
    }

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'low-power',
        });
    } catch (err) {
        console.error('[hero] WebGL renderer failed', err);
        canvas.classList.add('is-hidden');
        return false;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    camera.position.set(0, 0, 12);

    // Lighting ----------------------------------------------------------
    scene.add(new THREE.AmbientLight(0x22343a, 0.55));

    const keyLight = new THREE.PointLight(0xff7a45, 4.5, 30, 1.6);
    keyLight.position.set(6, 4, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x25d0a0, 3.5, 28, 1.8);
    rimLight.position.set(-7, -3, -4);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0xffd166, 2.5, 22, 2.0);
    accentLight.position.set(0, 6, -6);
    scene.add(accentLight);

    // The brew (group of orbiting rings) ---------------------------------
    const brewGroup = new THREE.Group();
    brewGroup.position.set(3.6, 0.2, -1.2);
    scene.add(brewGroup);

    const rings = [];
    const ringConfigs = [
        { radius: 2.4, tube: 0.09, segments: 32, radial: 96, color: 0xff7a45, emissive: 0x4a1a0c, rot: [Math.PI / 2.6, 0.0, 0.0], spin: 0.12 },
        { radius: 1.85, tube: 0.07, segments: 28, radial: 88, color: 0xffd166, emissive: 0x3a2a08, rot: [Math.PI / 2.0, 0.0, 0.2], spin: -0.18 },
        { radius: 3.05, tube: 0.06, segments: 24, radial: 96, color: 0x25d0a0, emissive: 0x07291d, rot: [Math.PI / 2.4, 0.25, 0.0], spin: 0.08 },
        { radius: 1.2, tube: 0.05, segments: 22, radial: 72, color: 0xff9580, emissive: 0x3a1408, rot: [Math.PI / 1.8, 0.0, 0.0], spin: -0.32 },
    ];

    ringConfigs.forEach((cfg, i) => {
        const geo = new THREE.TorusGeometry(cfg.radius, cfg.tube, cfg.segments, cfg.radial);
        const mat = new THREE.MeshStandardMaterial({
            color: cfg.color,
            roughness: 0.35,
            metalness: 0.7,
            emissive: cfg.emissive,
            emissiveIntensity: 0.65,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
        mesh.userData.spin = cfg.spin;
        mesh.userData.phase = i * 0.7;
        brewGroup.add(mesh);
        rings.push(mesh);
    });

    // Glowing core sphere at the centre of the brew ---------------------
    const coreGeo = new THREE.IcosahedronGeometry(0.45, 3);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffe4a0,
        emissive: 0xffd166,
        emissiveIntensity: 1.8,
        roughness: 0.25,
        metalness: 0.4,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    brewGroup.add(core);

    // Particle field — drifting bright dots -----------------------------
    const particleCount = 240;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const palette = [
        [1.0, 0.48, 0.27], // orange
        [1.0, 0.82, 0.4],  // yellow
        [0.15, 0.82, 0.63], // green
        [0.95, 0.58, 0.5],  // soft orange
    ];
    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const radius = 4 + Math.random() * 14;
        positions[i * 3 + 0] = Math.cos(theta) * radius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = Math.sin(theta) * radius * 0.7 - Math.random() * 8;
        const c = palette[i % palette.length];
        colors[i * 3 + 0] = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Code-glyph sprites floating past the brew --------------------------
    const glyphs = ['⌘', '⌥', '⌃', '⇧', '›', '»', '§', '∞', '∴', '◇', '◈', '◊'];
    const spriteCount = 22;
    const spriteGroup = new THREE.Group();
    for (let i = 0; i < spriteCount; i++) {
        const char = glyphs[i % glyphs.length];
        const canvasTex = document.createElement('canvas');
        canvasTex.width = 128;
        canvasTex.height = 128;
        const ctx = canvasTex.getContext('2d');
        ctx.fillStyle = i % 3 === 0 ? '#ffd166' : i % 3 === 1 ? '#ff7a45' : '#25d0a0';
        ctx.font = 'bold 96px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 24;
        ctx.fillText(char, 64, 64);
        const tex = new THREE.CanvasTexture(canvasTex);
        tex.minFilter = THREE.LinearFilter;
        const mat = new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            opacity: 0.18,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const sprite = new THREE.Sprite(mat);
        sprite.userData.t0 = Math.random() * Math.PI * 2;
        sprite.userData.speed = 0.4 + Math.random() * 0.6;
        sprite.userData.radius = 5 + Math.random() * 10;
        sprite.userData.drift = (Math.random() - 0.5) * 6;
        sprite.position.set(0, 0, 0);
        sprite.scale.set(0.55, 0.55, 0.55);
        spriteGroup.add(sprite);
    }
    scene.add(spriteGroup);

    // Volumetric beams crossing the brew --------------------------------
    const beamGeo = new THREE.PlaneGeometry(0.04, 18);
    const beamMat = new THREE.MeshBasicMaterial({
        color: 0xffd166,
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
    });
    const beam1 = new THREE.Mesh(beamGeo, beamMat);
    brewGroup.add(beam1);
    const beam2 = new THREE.Mesh(beamGeo, beamMat.clone());
    beam2.material.color.set(0xff7a45);
    brewGroup.add(beam2);
    const beam3 = new THREE.Mesh(beamGeo, beamMat.clone());
    beam3.material.color.set(0x25d0a0);
    brewGroup.add(beam3);

    // Pointer parallax --------------------------------------------------
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener('pointermove', (e) => {
        pointer.tx = (e.clientX / window.innerWidth) - 0.5;
        pointer.ty = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    // Resize ------------------------------------------------------------
    // Read the canvas's own rendered size (via getBoundingClientRect),
    // not the parent's clientWidth/Height. The canvas itself is positioned
    // absolutely inside .hero with width/height:100%, so its bounding
    // rect is what we want — and it's available immediately even before
    // every layout pass has run. The third arg of setSize is `false` so
    // we don't fight our own CSS (we already have width/height:100%).
    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        console.log('[hero] resize', w, h, 'attrs:', canvas.width, canvas.height);
        if (w === 0 || h === 0) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    };
    resize();
    // First layout pass is async — try again next frame in case the
    // initial call ran before CSS had fully applied.
    requestAnimationFrame(resize);
    requestAnimationFrame(() => requestAnimationFrame(resize));
    window.addEventListener('resize', resize, { passive: true });
    if (window.ResizeObserver) {
        new ResizeObserver(resize).observe(canvas);
    }

    // Animation loop ----------------------------------------------------
    const clock = new THREE.Clock();

    const animate = () => {
        const t = clock.getElapsedTime();

        // Smooth pointer.
        pointer.x += (pointer.tx - pointer.x) * 0.05;
        pointer.y += (pointer.ty - pointer.y) * 0.05;

        camera.position.x = pointer.x * 1.4;
        camera.position.y = -pointer.y * 0.9;
        camera.lookAt(brewGroup.position.x * 0.6, 0, 0);

        // Brew wobble and precession.
        brewGroup.rotation.y = t * 0.16 + Math.sin(t * 0.3) * 0.05;
        brewGroup.rotation.x = Math.sin(t * 0.22) * 0.12;

        // Each ring spins on its own axis; the spin creates the kinetic feeling.
        rings.forEach((ring, i) => {
            ring.rotation.z = t * ring.userData.spin + ring.userData.phase;
            // Subtle breathing — rings expand and contract a touch.
            const breath = 1 + Math.sin(t * 0.7 + ring.userData.phase) * 0.015;
            ring.scale.set(breath, breath, 1);
        });

        // Core pulses with a soft rhythm.
        const corePulse = 1 + Math.sin(t * 1.4) * 0.08;
        core.scale.set(corePulse, corePulse, corePulse);
        core.rotation.x = t * 0.5;
        core.rotation.y = t * 0.35;

        // Lights drift to keep the brew moving in color.
        keyLight.position.x = Math.cos(t * 0.4) * 7;
        keyLight.position.z = Math.sin(t * 0.4) * 7;
        rimLight.position.y = Math.sin(t * 0.3) * 5;
        accentLight.position.x = Math.cos(-t * 0.2) * 5;

        // Particles drift very slowly.
        particles.rotation.y = t * 0.018;
        particles.rotation.x = Math.sin(t * 0.1) * 0.05;

        // Glyphs orbit through the brew like fireflies.
        spriteGroup.children.forEach((sprite) => {
            const angle = t * sprite.userData.speed * 0.25 + sprite.userData.t0;
            const r = sprite.userData.radius;
            sprite.position.x = Math.cos(angle) * r;
            sprite.position.z = Math.sin(angle) * r * 0.6 - 2;
            sprite.position.y = Math.sin(t * 0.6 + sprite.userData.t0) * sprite.userData.drift;
            const wobble = 0.5 + 0.5 * Math.sin(t * 0.8 + sprite.userData.t0);
            sprite.material.opacity = 0.1 + wobble * 0.18;
        });

        // Beams cross slowly. They're parented to brewGroup, so no
        // position bookkeeping required — they ride along with the
        // brew's transforms automatically.
        beam1.rotation.z = t * 0.3;
        beam2.rotation.z = -t * 0.25 + 1.0;
        beam3.rotation.z = t * 0.2 + 2.0;

        renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // Pause when offscreen.
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                renderer.setAnimationLoop(e.isIntersecting ? animate : null);
            }
        });
        io.observe(canvas);
    }

    return true;
}