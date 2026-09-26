import { useEffect, useRef } from 'react';
import { getTheme } from '../shared/ColorThemes';

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

export default function TeamBackground({ colorTheme = 'cyan' }) {
    const mountRef = useRef(null);
    const theme = getTheme(colorTheme);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let dead = false;
        let cleanupFn = null;

        loadThree().then((THREE) => {
            if (dead) return;

            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(theme.bg, 0.01);

            const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.1, 200);
            camera.position.z = 18;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.setClearColor(theme.bg, 1);
            mount.appendChild(renderer.domElement);

            const isMobile = window.innerWidth < 768;

            // ═══ ذرات متصل (شبکه اجتماعی) ═══
            const nodeCount = isMobile ? 25 : 50;
            const nodeGeo = new THREE.BufferGeometry();
            const nodePositions = new Float32Array(nodeCount * 3);
            const nodeVelocities = new Float32Array(nodeCount * 3);

            for (let i = 0; i < nodeCount; i++) {
                nodePositions[i * 3] = (Math.random() - 0.5) * 25;
                nodePositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
                nodePositions[i * 3 + 2] = -5 - Math.random() * 20;
                nodeVelocities[i * 3] = (Math.random() - 0.5) * 0.01;
                nodeVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
            }

            nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
            const nodeMat = new THREE.PointsMaterial({
                color: theme.primary,
                size: 0.2,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
            });
            const nodes = new THREE.Points(nodeGeo, nodeMat);
            scene.add(nodes);

            // خطوط اتصال
            const maxLines = nodeCount * 3;
            const linePositions = new Float32Array(maxLines * 2 * 3);
            const lineGeo = new THREE.BufferGeometry();
            lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
            lineGeo.setDrawRange(0, 0);
            const lineMat = new THREE.LineBasicMaterial({
                color: theme.glow,
                transparent: true,
                opacity: 0.2,
            });
            const lines = new THREE.LineSegments(lineGeo, lineMat);
            scene.add(lines);

            // ═══ هاله نورانی مرکزی ═══
            const glowGeo = new THREE.SphereGeometry(3, 32, 32);
            const glowMat = new THREE.MeshBasicMaterial({
                color: theme.accent,
                transparent: true,
                opacity: 0.1,
                blending: THREE.AdditiveBlending,
            });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            glow.position.z = -15;
            scene.add(glow);

            // ═══ انیمیشن ═══
            let frameId;
            const clock = new THREE.Clock();

            const updateLines = () => {
                let idx = 0;
                const LINK_DIST = 6;
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

                camera.position.x = Math.sin(t * 0.05) * 1;
                camera.lookAt(0, 0, -10);

                for (let i = 0; i < nodeCount * 3; i++) {
                    nodePositions[i] += nodeVelocities[i];
                }
                nodeGeo.attributes.position.needsUpdate = true;
                updateLines();

                glow.scale.set(
                    1 + Math.sin(t * 0.5) * 0.2,
                    1 + Math.sin(t * 0.5) * 0.2,
                    1 + Math.sin(t * 0.5) * 0.2
                );

                renderer.render(scene, camera);
            };

            animate();

            cleanupFn = () => {
                cancelAnimationFrame(frameId);
                nodeGeo.dispose(); nodeMat.dispose();
                lineGeo.dispose(); lineMat.dispose();
                glowGeo.dispose(); glowMat.dispose();
                renderer.dispose();
                if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
            };
        }).catch(console.error);

        return () => {
            dead = true;
            cleanupFn?.();
        };
    }, [colorTheme]);

    return (
        <div
            ref={mountRef}
            className="pointer-events-none fixed inset-0 z-0"
            style={{ background: `#${theme.bg.toString(16).padStart(6, '0')}` }}
            aria-hidden="true"
        />
    );
}