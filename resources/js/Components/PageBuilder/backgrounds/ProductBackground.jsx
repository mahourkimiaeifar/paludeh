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

export default function ProductBackground({ colorTheme = 'cyan' }) {
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

            const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 200);
            camera.position.z = 20;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.setClearColor(theme.bg, 1);
            mount.appendChild(renderer.domElement);

            const isMobile = window.innerWidth < 768;

            // ═══ ۱. شکل‌های هندسی مینیمال ═══
            const shapes = [];
            const geometries = [
                new THREE.BoxGeometry(1.5, 1.5, 1.5),
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.ConeGeometry(0.8, 1.5, 32),
                new THREE.TorusGeometry(0.8, 0.3, 16, 100),
                new THREE.OctahedronGeometry(1),
            ];

            const shapeCount = isMobile ? 8 : 15;
            for (let i = 0; i < shapeCount; i++) {
                const geo = geometries[i % geometries.length];
                const mat = new THREE.MeshBasicMaterial({
                    color: i % 3 === 0 ? theme.primary : i % 3 === 1 ? theme.secondary : theme.accent,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.3,
                });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 20,
                    -5 - Math.random() * 20
                );
                mesh.userData = {
                    rotSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 },
                    floatSpeed: 0.3 + Math.random() * 0.5,
                    floatOffset: Math.random() * Math.PI * 2,
                };
                shapes.push(mesh);
                scene.add(mesh);
            }

            // ═══ ۲. ذرات طلایی شناور ═══
            const goldCount = isMobile ? 100 : 300;
            const goldGeo = new THREE.BufferGeometry();
            const goldPositions = new Float32Array(goldCount * 3);
            for (let i = 0; i < goldCount; i++) {
                goldPositions[i * 3] = (Math.random() - 0.5) * 50;
                goldPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
                goldPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
            }
            goldGeo.setAttribute('position', new THREE.BufferAttribute(goldPositions, 3));
            const goldMat = new THREE.PointsMaterial({
                color: 0xfbbf24,
                size: 0.08,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
            });
            const gold = new THREE.Points(goldGeo, goldMat);
            scene.add(gold);

            // ═══ ۳. خطوط نورپردازی استودیویی ═══
            const lines = [];
            for (let i = 0; i < 5; i++) {
                const lineGeo = new THREE.CylinderGeometry(0.02, 0.02, 30, 8);
                const lineMat = new THREE.MeshBasicMaterial({
                    color: theme.glow,
                    transparent: true,
                    opacity: 0.15,
                    blending: THREE.AdditiveBlending,
                });
                const line = new THREE.Mesh(lineGeo, lineMat);
                line.position.set((i - 2) * 8, 0, -15);
                line.rotation.z = Math.PI / 6;
                lines.push(line);
                scene.add(line);
            }

            // ═══ ۴. هاله مرکزی ═══
            const glowGeo = new THREE.SphereGeometry(3, 32, 32);
            const glowMat = new THREE.MeshBasicMaterial({
                color: theme.primary,
                transparent: true,
                opacity: 0.1,
                blending: THREE.AdditiveBlending,
            });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            glow.position.z = -10;
            scene.add(glow);

            // ═══ انیمیشن ═══
            let frameId;
            const clock = new THREE.Clock();

            const animate = () => {
                frameId = requestAnimationFrame(animate);
                if (document.hidden || dead) return;

                const t = clock.getElapsedTime();

                camera.position.x = Math.sin(t * 0.05) * 2;
                camera.lookAt(0, 0, -10);

                shapes.forEach((shape) => {
                    shape.rotation.x += shape.userData.rotSpeed.x;
                    shape.rotation.y += shape.userData.rotSpeed.y;
                    shape.position.y += Math.sin(t * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.005;
                });

                gold.rotation.y = t * 0.02;

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
                geometries.forEach(g => g.dispose());
                goldGeo.dispose(); goldMat.dispose();
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