import { useEffect, useRef } from 'react';

let threePromise = null;
let postPromise = null;

async function loadThree() {
    if (window.THREE_MODULE) return window.THREE_MODULE;
    if (threePromise) return threePromise;
    threePromise = import('https://esm.sh/three@0.160.0').then((mod) => {
        window.THREE_MODULE = mod;
        return mod;
    });
    return threePromise;
}

async function loadPostProcessing(THREE) {
    if (window.POST_MODULE) return window.POST_MODULE;
    if (postPromise) return postPromise;
    postPromise = Promise.all([
        import('https://esm.sh/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js'),
        import('https://esm.sh/three@0.160.0/examples/jsm/postprocessing/RenderPass.js'),
        import('https://esm.sh/three@0.160.0/examples/jsm/postprocessing/BokehPass.js'),
        import('https://esm.sh/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js'),
    ]).then(([ec, rp, bp, ub]) => {
        const mod = { EffectComposer: ec.EffectComposer, RenderPass: rp.RenderPass, BokehPass: bp.BokehPass, UnrealBloomPass: ub.UnrealBloomPass };
        window.POST_MODULE = mod;
        return mod;
    });
    return postPromise;
}

// ═══ ساخت تکسچر کد شناور ═══
function createCodeTexture(text, THREE) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 28px "Fira Code", "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // رنگ‌بندی سینتکس
    const keywords = ['const', 'let', 'function', 'import', 'export', 'await', 'new', 'from', 'async'];
    const tokens = text.split(' ');
    let x = 20;
    tokens.forEach((token, i) => {
        if (keywords.includes(token)) {
            ctx.fillStyle = '#c084fc'; // purple
        } else if (token.includes('(') || token.includes(')')) {
            ctx.fillStyle = '#fbbf24'; // yellow
        } else if (token.startsWith("'") || token.startsWith('"')) {
            ctx.fillStyle = '#86efac'; // green
        } else {
            ctx.fillStyle = '#67e8f9'; // cyan
        }
        ctx.fillText(token + ' ', x, canvas.height / 2);
        x += ctx.measureText(token + ' ').width;
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

const CODE_SNIPPETS = [
    'const ai = new NeuralNet()',
    'await model.predict(data)',
    'function think() { return truth }',
    'import { AI } from "./core"',
    'neural.forward(input)',
    'weights += delta * learning',
    'async function learn() {}',
    'export default knowledge',
    'const mind = new Brain()',
    'tensor.flow(activation)',
];

export default function HomeBackground() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let dead = false;
        let cleanupFn = null;
        let scrollProgress = 0;
        let targetScroll = 0;
        const mouse = { x: 0, y: 0 };
        const targetMouse = { x: 0, y: 0 };

        const onScroll = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetScroll = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        };
        
        const onMouseMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        loadThree()
            .then(async (THREE) => {
                let post = null;
                try {
                    post = await loadPostProcessing(THREE);
                } catch (e) {
                    console.warn('⚠️ Post-processing unavailable:', e);
                }
                if (dead) return;

                const scene = new THREE.Scene();
                scene.fog = new THREE.FogExp2(0x000814, 0.012);

                const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 200);
                camera.position.z = 15;

                const renderer = new THREE.WebGLRenderer({ 
                    antialias: true, 
                    alpha: false,
                    powerPreference: 'high-performance' 
                });
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.setSize(mount.clientWidth, mount.clientHeight);
                renderer.setClearColor(0x000814, 1);
                mount.appendChild(renderer.domElement);

                const isMobile = window.innerWidth < 768;

                // ═══ POST-PROCESSING (Depth of Field + Bloom) ═══
                let composer = null;
                let bokehPass = null;
                if (post) {
                    try {
                        composer = new post.EffectComposer(renderer);
                        const renderPass = new post.RenderPass(scene, camera);
                        composer.addPass(renderPass);

                        // Bloom ملایم
                        const bloomPass = new post.UnrealBloomPass(
                            new THREE.Vector2(mount.clientWidth, mount.clientHeight),
                            0.6,  // strength
                            0.4,  // radius
                            0.85  // threshold
                        );
                        composer.addPass(bloomPass);

                        // Bokeh (Depth of Field)
                        bokehPass = new post.BokehPass(scene, camera, {
                            focus: 15.0,
                            aperture: 0.002,
                            maxblur: 0.008,
                            width: mount.clientWidth,
                            height: mount.clientHeight,
                        });
                        composer.addPass(bokehPass);
                    } catch (e) {
                        console.warn('⚠️ Post-processing setup failed:', e);
                        composer = null;
                    }
                }

                // ═══ 1. STAR FIELD ═══
                const starCount = isMobile ? 500 : 1500;
                const starGeo = new THREE.BufferGeometry();
                const starPositions = new Float32Array(starCount * 3);
                for (let i = 0; i < starCount; i++) {
                    starPositions[i * 3] = (Math.random() - 0.5) * 100;
                    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
                    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
                }
                starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
                const starMat = new THREE.PointsMaterial({
                    color: 0xffffff, size: 0.12, transparent: true, opacity: 0.7,
                    blending: THREE.AdditiveBlending,
                });
                const stars = new THREE.Points(starGeo, starMat);
                scene.add(stars);

                // ═══ 2. TUNNEL PARTICLES ═══
                const tunnelCount = isMobile ? 400 : 1200;
                const tunnelDepth = 80;
                const tunnelGeo = new THREE.BufferGeometry();
                const tunnelPositions = new Float32Array(tunnelCount * 3);
                const tunnelColors = new Float32Array(tunnelCount * 3);
                for (let i = 0; i < tunnelCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = 4 + Math.random() * 10;
                    const z = Math.random() * tunnelDepth - tunnelDepth;
                    tunnelPositions[i * 3] = Math.cos(angle) * radius;
                    tunnelPositions[i * 3 + 1] = Math.sin(angle) * radius;
                    tunnelPositions[i * 3 + 2] = z;
                    const c = Math.random();
                    if (c < 0.5) { tunnelColors[i * 3] = 0.02; tunnelColors[i * 3 + 1] = 0.71; tunnelColors[i * 3 + 2] = 0.83; }
                    else if (c < 0.8) { tunnelColors[i * 3] = 0.23; tunnelColors[i * 3 + 1] = 0.51; tunnelColors[i * 3 + 2] = 0.96; }
                    else { tunnelColors[i * 3] = 0.6; tunnelColors[i * 3 + 1] = 0.8; tunnelColors[i * 3 + 2] = 1.0; }
                }
                tunnelGeo.setAttribute('position', new THREE.BufferAttribute(tunnelPositions, 3));
                tunnelGeo.setAttribute('color', new THREE.BufferAttribute(tunnelColors, 3));
                const tunnelMat = new THREE.PointsMaterial({
                    size: 0.12, vertexColors: true, transparent: true, opacity: 0.9,
                    blending: THREE.AdditiveBlending,
                });
                const tunnel = new THREE.Points(tunnelGeo, tunnelMat);
                scene.add(tunnel);

                // ═══ 3. DATA RAIN ═══
                const rainCount = isMobile ? 100 : 300;
                const rainGeo = new THREE.BufferGeometry();
                const rainPositions = new Float32Array(rainCount * 3);
                const rainVelocities = new Float32Array(rainCount);
                for (let i = 0; i < rainCount; i++) {
                    rainPositions[i * 3] = (Math.random() - 0.5) * 40;
                    rainPositions[i * 3 + 1] = Math.random() * 40 - 20;
                    rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
                    rainVelocities[i] = 0.08 + Math.random() * 0.2;
                }
                rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
                const rainMat = new THREE.PointsMaterial({
                    color: 0x38bdf8, size: 0.08, transparent: true, opacity: 0.4,
                    blending: THREE.AdditiveBlending,
                });
                const rain = new THREE.Points(rainGeo, rainMat);
                scene.add(rain);

                // ═══ 4. FLOATING CODE SNIPPETS ═══
                const codeSprites = [];
                const codeCount = isMobile ? 6 : 14;
                const codeTextures = CODE_SNIPPETS.map(code => createCodeTexture(code, THREE));
                
                for (let i = 0; i < codeCount; i++) {
                    const texture = codeTextures[i % codeTextures.length];
                    const spriteMat = new THREE.SpriteMaterial({
                        map: texture,
                        transparent: true,
                        opacity: 0.5,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                    });
                    const sprite = new THREE.Sprite(spriteMat);
                    sprite.scale.set(8, 1, 1);
                    sprite.position.set(
                        (Math.random() - 0.5) * 30,
                        (Math.random() - 0.5) * 20,
                        -5 - Math.random() * 45
                    );
                    sprite.userData = {
                        baseY: sprite.position.y,
                        floatSpeed: 0.3 + Math.random() * 0.5,
                        floatOffset: Math.random() * Math.PI * 2,
                        driftSpeed: 0.0005 + Math.random() * 0.001,
                        driftDir: Math.random() > 0.5 ? 1 : -1,
                        baseOpacity: 0.3 + Math.random() * 0.3,
                    };
                    scene.add(sprite);
                    codeSprites.push(sprite);
                }

                // ═══ 5. AI CORE + RINGS + PULSES ═══
                const coreGroup = new THREE.Group();
                
                const coreGeo = new THREE.IcosahedronGeometry(2, 2);
                const coreMat = new THREE.MeshBasicMaterial({
                    color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.7,
                });
                const core = new THREE.Mesh(coreGeo, coreMat);
                coreGroup.add(core);
                
                const glowGeo = new THREE.IcosahedronGeometry(3, 1);
                const glowMat = new THREE.MeshBasicMaterial({
                    color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.3,
                });
                const glow = new THREE.Mesh(glowGeo, glowMat);
                coreGroup.add(glow);

                const rings = [];
                for (let i = 0; i < 3; i++) {
                    const ringGeo = new THREE.TorusGeometry(4.5 + i * 1.8, 0.04, 8, 100);
                    const ringMat = new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setHSL(0.55 + i * 0.06, 0.9, 0.6),
                        transparent: true, opacity: 0.35,
                        blending: THREE.AdditiveBlending,
                    });
                    const ring = new THREE.Mesh(ringGeo, ringMat);
                    ring.rotation.x = Math.PI / 2 + (i * 0.25);
                    coreGroup.add(ring);
                    rings.push(ring);
                }

                const pulses = [];
                const pulseGeo = new THREE.SphereGeometry(0.3, 16, 16);
                for (let i = 0; i < 3; i++) {
                    const pulseMat = new THREE.MeshBasicMaterial({
                        color: 0x06b6d4, transparent: true, opacity: 0.5,
                        blending: THREE.AdditiveBlending,
                    });
                    const pulse = new THREE.Mesh(pulseGeo, pulseMat);
                    pulse.userData = { delay: i * 1.2, maxScale: 20 };
                    coreGroup.add(pulse);
                    pulses.push(pulse);
                }

                coreGroup.position.z = -40;
                scene.add(coreGroup);

                // ═══ 6. NEURAL NETWORK ═══
                const nodeCount = isMobile ? 25 : 60;
                const nodeGeo = new THREE.BufferGeometry();
                const nodePositions = new Float32Array(nodeCount * 3);
                const nodeVelocities = new Float32Array(nodeCount * 3);
                for (let i = 0; i < nodeCount; i++) {
                    nodePositions[i * 3] = (Math.random() - 0.5) * 15;
                    nodePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
                    nodePositions[i * 3 + 2] = -5 - Math.random() * 40;
                    nodeVelocities[i * 3] = (Math.random() - 0.5) * 0.015;
                    nodeVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
                    nodeVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
                }
                nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
                const nodeMat = new THREE.PointsMaterial({
                    color: 0x67e8f9, size: 0.2, transparent: true, opacity: 0.9,
                    blending: THREE.AdditiveBlending,
                });
                const nodes = new THREE.Points(nodeGeo, nodeMat);
                scene.add(nodes);

                const maxLines = nodeCount * 3;
                const linePositions = new Float32Array(maxLines * 2 * 3);
                const lineGeo = new THREE.BufferGeometry();
                lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
                lineGeo.setDrawRange(0, 0);
                const lineMat = new THREE.LineBasicMaterial({
                    color: 0x38bdf8, transparent: true, opacity: 0.3,
                    blending: THREE.AdditiveBlending,
                });
                const lines = new THREE.LineSegments(lineGeo, lineMat);
                scene.add(lines);

                // ═══ 7. FLOATING SHAPES ═══
                const shapes = [];
                const shapeCount = isMobile ? 6 : 15;
                const shapeGeometries = [
                    new THREE.OctahedronGeometry(0.4),
                    new THREE.TetrahedronGeometry(0.4),
                    new THREE.BoxGeometry(0.4, 0.4, 0.4),
                ];
                for (let i = 0; i < shapeCount; i++) {
                    const geo = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
                    const mat = new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 0.8, 0.6),
                        wireframe: true, transparent: true, opacity: 0.6,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.set(
                        (Math.random() - 0.5) * 25,
                        (Math.random() - 0.5) * 15,
                        -5 - Math.random() * 50
                    );
                    mesh.userData = {
                        rotSpeed: { x: Math.random() * 0.02, y: Math.random() * 0.02 },
                        floatSpeed: Math.random() * 0.5 + 0.5,
                        floatOffset: Math.random() * Math.PI * 2,
                    };
                    shapes.push(mesh);
                    scene.add(mesh);
                }

                const onResize = () => {
                    camera.aspect = mount.clientWidth / mount.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(mount.clientWidth, mount.clientHeight);
                    if (composer) composer.setSize(mount.clientWidth, mount.clientHeight);
                };
                window.addEventListener('resize', onResize);

                let frameId;
                const clock = new THREE.Clock();

                const updateLines = () => {
                    let idx = 0;
                    const LINK_DIST = 4;
                    for (let i = 0; i < nodeCount; i++) {
                        for (let j = i + 1; j < nodeCount; j++) {
                            const dx = nodePositions[i * 3] - nodePositions[j * 3];
                            const dy = nodePositions[i * 3 + 1] - nodePositions[j * 3 + 1];
                            const dz = nodePositions[i * 3 + 2] - nodePositions[j * 3 + 2];
                            if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST && idx < maxLines) {
                                linePositions[idx * 6] = nodePositions[i * 3];
                                linePositions[idx * 6 + 1] = nodePositions[i * 3 + 1];
                                linePositions[idx * 6 + 2] = nodePositions[i * 3 + 2];
                                linePositions[idx * 6 + 3] = nodePositions[j * 3];
                                linePositions[idx * 6 + 4] = nodePositions[j * 3 + 1];
                                linePositions[idx * 6 + 5] = nodePositions[j * 3 + 2];
                                idx++;
                            }
                        }
                    }
                    lineGeo.setDrawRange(0, idx * 2);
                    lineGeo.attributes.position.needsUpdate = true;
                };

                const animate = () => {
                    frameId = requestAnimationFrame(animate);
                    if (document.hidden || dead) return;

                    const t = clock.getElapsedTime();
                    
                    scrollProgress += (targetScroll - scrollProgress) * 0.06;
                    targetMouse.x += (mouse.x - targetMouse.x) * 0.05;
                    targetMouse.y += (mouse.y - targetMouse.y) * 0.05;

                    // ═══ CAMERA ═══
                    const breathe = Math.sin(t * 0.5) * 0.3;
                    camera.position.z = 15 - scrollProgress * 50 + breathe;
                    camera.position.x = Math.sin(t * 0.15) * 1.5 + targetMouse.x * 1.5;
                    camera.position.y = Math.cos(t * 0.12) * 1 + targetMouse.y * 1 + Math.sin(t * 0.3) * 0.2;
                    camera.lookAt(targetMouse.x * 0.5, targetMouse.y * 0.5, camera.position.z - 15);

                    // ═══ UPDATE BOKEH FOCUS ═══
                    if (bokehPass) {
                        bokehPass.uniforms['focus'].value = 15 + scrollProgress * 20;
                        bokehPass.uniforms['aperture'].value = 0.001 + scrollProgress * 0.002;
                    }

                    // ═══ STARS ═══
                    stars.rotation.y = t * 0.02;
                    stars.rotation.x = Math.sin(t * 0.05) * 0.05;

                    // ═══ TUNNEL ═══
                    tunnel.rotation.z = t * 0.08;

                    // ═══ DATA RAIN ═══
                    for (let i = 0; i < rainCount; i++) {
                        rainPositions[i * 3 + 1] -= rainVelocities[i];
                        if (rainPositions[i * 3 + 1] < -20) rainPositions[i * 3 + 1] = 20;
                    }
                    rainGeo.attributes.position.needsUpdate = true;

                    // ═══ FLOATING CODE ═══
                    codeSprites.forEach((sprite) => {
                        sprite.position.y = sprite.userData.baseY + 
                            Math.sin(t * sprite.userData.floatSpeed + sprite.userData.floatOffset) * 0.8;
                        sprite.position.x += sprite.userData.driftSpeed * sprite.userData.driftDir;
                        if (sprite.position.x > 20) sprite.position.x = -20;
                        if (sprite.position.x < -20) sprite.position.x = 20;
                        
                        // Fade based on distance to camera
                        const dist = Math.abs(sprite.position.z - camera.position.z);
                        const fade = Math.max(0, 1 - dist / 25);
                        sprite.material.opacity = sprite.userData.baseOpacity * fade;
                    });

                    // ═══ NEURAL NODES ═══
                    for (let i = 0; i < nodeCount * 3; i++) nodePositions[i] += nodeVelocities[i];
                    nodeGeo.attributes.position.needsUpdate = true;
                    updateLines();

                    // ═══ CORE + RINGS + PULSES ═══
                    core.rotation.x = t * 0.3;
                    core.rotation.y = t * 0.4;
                    glow.rotation.x = -t * 0.2;
                    glow.rotation.y = -t * 0.25;
                    const pulse = 1 + Math.sin(t * 2) * 0.15;
                    core.scale.set(pulse, pulse, pulse);
                    const coreScale = 1 + scrollProgress * 0.8;
                    coreGroup.scale.set(coreScale, coreScale, coreScale);

                    rings.forEach((ring, i) => {
                        ring.rotation.z = t * (0.15 + i * 0.08);
                        ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.4 + i) * 0.15;
                    });

                    pulses.forEach((p) => {
                        const elapsed = (t + p.userData.delay) % 3;
                        const progress = elapsed / 3;
                        const scale = 1 + progress * p.userData.maxScale;
                        p.scale.set(scale, scale, scale);
                        p.material.opacity = Math.max(0, 0.5 * (1 - progress));
                    });

                    // ═══ SHAPES ═══
                    shapes.forEach((shape) => {
                        shape.rotation.x += shape.userData.rotSpeed.x;
                        shape.rotation.y += shape.userData.rotSpeed.y;
                        shape.position.y += Math.sin(t * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.003;
                    });

                    // ═══ COLORS ═══
                    const hue = 0.5 + scrollProgress * 0.15;
                    nodeMat.color.setHSL(hue, 0.8, 0.6);
                    coreMat.color.setHSL(hue, 0.9, 0.55);
                    glowMat.color.setHSL(hue + 0.1, 0.8, 0.5);

                    if (composer) {
                        composer.render();
                    } else {
                        renderer.render(scene, camera);
                    }
                };

                animate();

                cleanupFn = () => {
                    cancelAnimationFrame(frameId);
                    window.removeEventListener('resize', onResize);
                    window.removeEventListener('scroll', onScroll);
                    window.removeEventListener('mousemove', onMouseMove);
                    
                    starGeo.dispose(); starMat.dispose();
                    tunnelGeo.dispose(); tunnelMat.dispose();
                    rainGeo.dispose(); rainMat.dispose();
                    nodeGeo.dispose(); nodeMat.dispose();
                    lineGeo.dispose(); lineMat.dispose();
                    coreGeo.dispose(); coreMat.dispose();
                    glowGeo.dispose(); glowMat.dispose();
                    pulseGeo.dispose();
                    shapeGeometries.forEach(g => g.dispose());
                    rings.forEach(r => { r.geometry.dispose(); r.material.dispose(); });
                    pulses.forEach(p => p.material.dispose());
                    codeTextures.forEach(t => t.dispose());
                    codeSprites.forEach(s => s.material.dispose());
                    
                    if (composer) composer.dispose();
                    renderer.dispose();
                    if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
                };
            })
            .catch((err) => console.error('❌ HomeBackground error:', err));

        return () => {
            dead = true;
            cleanupFn?.();
        };
    }, []);

    return (
        <div 
            ref={mountRef} 
            className="pointer-events-none fixed inset-0 z-0"
            style={{ 
                minHeight: '100vh',
                background: 'radial-gradient(ellipse at center, #0c1929 0%, #000814 100%)'
            }}
            aria-hidden="true"
        />
    );
}