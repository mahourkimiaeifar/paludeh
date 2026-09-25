import { useEffect, useRef, useState } from 'react';

let threePromise = null;
async function loadThree() {
    if (window.THREE_MODULE) return window.THREE_MODULE;
    if (threePromise) return threePromise;
    threePromise = import('https://esm.sh/three@0.160.0').then((mod) => {
        window.THREE_MODULE = mod;
        return mod;
    });
    return threePromise;
}

const getInitialTheme = () => localStorage.getItem('theme') || 'dark';

export default function ThreeBackground({ density = 1 }) {
    const mountRef = useRef(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let dead = false;
        let cleanupFn = null;
        let nodeMat = null;
        let lineMat = null;
        let coreMat = null;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const applyTheme = (theme) => {
            if (!nodeMat || !lineMat || !coreMat) return;
            if (theme === 'dark') {
                nodeMat.color.setHex(0x67e8f9);
                nodeMat.opacity = 0.3;
                lineMat.color.setHex(0x38bdf8);
                lineMat.opacity = 0.09;
                coreMat.color.setHex(0x38bdf8);
                coreMat.opacity = 0.05;
            } else {
                nodeMat.color.setHex(0x0891b2);
                nodeMat.opacity = 0.2;
                lineMat.color.setHex(0x0369a1);
                lineMat.opacity = 0.07;
                coreMat.color.setHex(0x2563eb);
                coreMat.opacity = 0.04;
            }
        };

        const onThemeChange = (e) => applyTheme(e.detail);
        window.addEventListener('themechange', onThemeChange);

        loadThree()
            .then((THREE) => {
                if (dead) return;

                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
                camera.position.z = 9;

                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.setSize(mount.clientWidth, mount.clientHeight);
                mount.appendChild(renderer.domElement);

                // --- گره‌های شبکه عصبی ---
                const isMobile = window.innerWidth < 768;
                const count = Math.floor((isMobile ? 45 : 110) * density);
                const spread = { x: 16, y: 10, z: 8 };
                const positions = new Float32Array(count * 3);
                const velocities = new Float32Array(count * 3);
                for (let i = 0; i < count; i++) {
                    positions[i * 3] = (Math.random() - 0.5) * spread.x;
                    positions[i * 3 + 1] = (Math.random() - 0.5) * spread.y;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * spread.z;
                    velocities[i * 3] = (Math.random() - 0.5) * 0.004;
                    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.004;
                    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
                }
                const nodeGeo = new THREE.BufferGeometry();
                nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                nodeMat = new THREE.PointsMaterial({
                    color: 0x67e8f9, size: 0.05, transparent: true, opacity: 0.3, depthWrite: false,
                });
                const nodes = new THREE.Points(nodeGeo, nodeMat);
                scene.add(nodes);

                // --- سیناپس‌ها (خطوط اتصال) ---
                const maxLines = count * 3;
                const linePositions = new Float32Array(maxLines * 2 * 3);
                const lineGeo = new THREE.BufferGeometry();
                lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
                lineGeo.setDrawRange(0, 0);
                lineMat = new THREE.LineBasicMaterial({
                    color: 0x38bdf8, transparent: true, opacity: 0.09, depthWrite: false,
                });
                const lines = new THREE.LineSegments(lineGeo, lineMat);
                scene.add(lines);

                // --- هسته‌ی AI (خیلی محو) ---
                const coreGeo = new THREE.IcosahedronGeometry(2.6, 1);
                coreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.05 });
                const core = new THREE.Mesh(coreGeo, coreMat);
                core.position.set(0, 0, -3);
                scene.add(core);

                applyTheme(getInitialTheme());

                const LINK_DIST = 2.6;
                const mouse = { x: 0, y: 0 };
                const target = { x: 0, y: 0 };
                const onMouseMove = (e) => {
                    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
                };
                window.addEventListener('mousemove', onMouseMove, { passive: true });

                const onResize = () => {
                    camera.aspect = mount.clientWidth / mount.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(mount.clientWidth, mount.clientHeight);
                };
                window.addEventListener('resize', onResize);

                let frameId;
                const clock = new THREE.Clock();

                const updateLinks = () => {
                    let idx = 0;
                    for (let i = 0; i < count; i++) {
                        for (let j = i + 1; j < count; j++) {
                            const dx = positions[i * 3] - positions[j * 3];
                            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                            if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST && idx < maxLines) {
                                linePositions[idx * 6] = positions[i * 3];
                                linePositions[idx * 6 + 1] = positions[i * 3 + 1];
                                linePositions[idx * 6 + 2] = positions[i * 3 + 2];
                                linePositions[idx * 6 + 3] = positions[j * 3];
                                linePositions[idx * 6 + 4] = positions[j * 3 + 1];
                                linePositions[idx * 6 + 5] = positions[j * 3 + 2];
                                idx++;
                            }
                        }
                    }
                    lineGeo.setDrawRange(0, idx * 2);
                    lineGeo.attributes.position.needsUpdate = true;
                };

                const animate = () => {
                    frameId = requestAnimationFrame(animate);
                    if (document.hidden) return;
                    const t = clock.getElapsedTime();

                    for (let i = 0; i < count * 3; i++) positions[i] += velocities[i];
                    for (let i = 0; i < count; i++) {
                        for (let axis = 0; axis < 3; axis++) {
                            const limit = axis === 0 ? spread.x : axis === 1 ? spread.y : spread.z;
                            const p = positions[i * 3 + axis];
                            if (p > limit / 2) positions[i * 3 + axis] = -limit / 2;
                            else if (p < -limit / 2) positions[i * 3 + axis] = limit / 2;
                        }
                    }
                    nodeGeo.attributes.position.needsUpdate = true;
                    updateLinks();

                    core.rotation.x = t * 0.06;
                    core.rotation.y = t * 0.09;

                    target.x += (mouse.x * 0.4 - target.x) * 0.03;
                    target.y += (mouse.y * 0.3 - target.y) * 0.03;
                    camera.position.x = target.x;
                    camera.position.y = target.y;
                    camera.lookAt(scene.position);
                    renderer.render(scene, camera);
                };

                if (prefersReduced) {
                    updateLinks();
                    renderer.render(scene, camera);
                } else {
                    animate();
                }

                cleanupFn = () => {
                    cancelAnimationFrame(frameId);
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('resize', onResize);
                    nodeGeo.dispose(); nodeMat.dispose();
                    lineGeo.dispose(); lineMat.dispose();
                    coreGeo.dispose(); coreMat.dispose();
                    renderer.dispose();
                    if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
                };
            })
            .catch(() => { if (!dead) setFailed(true); });

        return () => {
            dead = true;
            window.removeEventListener('themechange', onThemeChange);
            cleanupFn?.();
        };
    }, [density]);

    if (failed) return null;

    return <div ref={mountRef} className="pointer-events-none fixed inset-0 -z-20" aria-hidden="true" />;
}