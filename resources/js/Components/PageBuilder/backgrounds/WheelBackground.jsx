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

export default function CourseBackground({ colorTheme = 'cyan' }) {
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

            // ═══ ۱. صفحات شناور (مثل کتاب) ═══
            const pages = [];
            const pageCount = isMobile ? 15 : 30;
            const pageGeo = new THREE.PlaneGeometry(2, 2.8);

            for (let i = 0; i < pageCount; i++) {
                const mat = new THREE.MeshBasicMaterial({
                    color: i % 2 === 0 ? theme.primary : theme.accent,
                    transparent: true,
                    opacity: 0.15,
                    side: THREE.DoubleSide,
                });
                const page = new THREE.Mesh(pageGeo, mat);
                page.position.set(
                    (Math.random() - 0.5) * 35,
                    (Math.random() - 0.5) * 25,
                    -5 - Math.random() * 25
                );
                page.rotation.set(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.3
                );
                page.userData = {
                    floatSpeed: 0.2 + Math.random() * 0.3,
                    floatOffset: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.005,
                };
                pages.push(page);
                scene.add(page);
            }

            // ═══ ۲. خطوط متصل (مثل دانش) ═══
            const nodeCount = isMobile ? 20 : 40;
            const nodePositions = [];
            for (let i = 0; i < nodeCount; i++) {
                nodePositions.push({
                    x: (Math.random() - 0.5) * 30,
                    y: (Math.random() - 0.5) * 20,
                    z: -5 - Math.random() * 20,
                });
            }

            const linePositions = [];
            for (let i = 0; i < nodeCount; i++) {
                for (let j = i + 1; j < nodeCount; j++) {
                    const dx = nodePositions[i].x - nodePositions[j].x;
                    const dy = nodePositions[i].y - nodePositions[j].y;
                    const dz = nodePositions[i].z - nodePositions[j].z;
                    if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 8) {
                        linePositions.push(
                            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
                            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
                        );
                    }
                }
            }

            const lineGeo = new THREE.BufferGeometry();
            lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            const lineMat = new THREE.LineBasicMaterial({
                color: theme.glow,
                transparent: true,
                opacity: 0.1,
            });
            const lines = new THREE.LineSegments(lineGeo, lineMat);
            scene.add(lines);

            // ═══ ۳. ذرات نوری (مثل ایده) ═══
            const ideaCount = isMobile ? 50 : 150;
            const ideaGeo = new THREE.BufferGeometry();
            const ideaPositions = new Float32Array(ideaCount * 3);
            for (let i = 0; i < ideaCount; i++) {
                ideaPositions[i * 3] = (Math.random() - 0.5) * 40;
                ideaPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
                ideaPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
            }
            ideaGeo.setAttribute('position', new THREE.BufferAttribute(ideaPositions, 3));
            const ideaMat = new THREE.PointsMaterial({
                color: theme.accent,
                size: 0.15,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
            });
            const ideas = new THREE.Points(ideaGeo, ideaMat);
            scene.add(ideas);

            // ═══ انیمیشن ═══
            let frameId;
            const clock = new THREE.Clock();

            const animate = () => {
                frameId = requestAnimationFrame(animate);
                if (document.hidden || dead) return;

                const t = clock.getElapsedTime();

                camera.position.y = Math.sin(t * 0.05) * 1;
                camera.lookAt(0, 0, -10);

                pages.forEach((page) => {
                    page.position.y += Math.sin(t * page.userData.floatSpeed + page.userData.floatOffset) * 0.003;
                    page.rotation.y += page.userData.rotSpeed;
                });

                ideas.rotation.y = t * 0.02;

                renderer.render(scene, camera);
            };

            animate();

            cleanupFn = () => {
                cancelAnimationFrame(frameId);
                pageGeo.dispose();
                lineGeo.dispose(); lineMat.dispose();
                ideaGeo.dispose(); ideaMat.dispose();
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