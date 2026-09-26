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

export default function PortfolioBackground({ colorTheme = 'purple' }) {
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
            scene.fog = new THREE.FogExp2(theme.bg, 0.012);

            const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.1, 200);
            camera.position.z = 15;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.setClearColor(theme.bg, 1);
            mount.appendChild(renderer.domElement);

            const isMobile = window.innerWidth < 768;

            // ═══ اشکال هندسی متنوع (خلاقیت) ═══
            const shapes = [];
            const geometries = [
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.SphereGeometry(0.7, 32, 32),
                new THREE.ConeGeometry(0.6, 1.2, 32),
                new THREE.TorusGeometry(0.6, 0.25, 16, 100),
                new THREE.OctahedronGeometry(0.8),
                new THREE.DodecahedronGeometry(0.7),
                new THREE.TetrahedronGeometry(0.8),
            ];

            const rainbowColors = [0xff6b6b, 0xfeca57, 0x48dbfb, 0xff9ff3, 0x54a0ff, 0x5f27cd];
            const shapeCount = isMobile ? 10 : 20;

            for (let i = 0; i < shapeCount; i++) {
                const geo = geometries[i % geometries.length];
                const mat = new THREE.MeshBasicMaterial({
                    color: rainbowColors[i % rainbowColors.length],
                    wireframe: true,
                    transparent: true,
                    opacity: 0.4,
                });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 20,
                    -5 - Math.random() * 20
                );
                mesh.userData = {
                    rotSpeed: {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                    },
                    floatSpeed: 0.3 + Math.random() * 0.5,
                    floatOffset: Math.random() * Math.PI * 2,
                };
                shapes.push(mesh);
                scene.add(mesh);
            }

            // ═══ ذرات رنگی پراکنده ═══
            const particleCount = isMobile ? 200 : 500;
            const particleGeo = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);
            const particleColors = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                particlePositions[i * 3] = (Math.random() - 0.5) * 50;
                particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
                particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;

                const c = new THREE.Color(rainbowColors[Math.floor(Math.random() * rainbowColors.length)]);
                particleColors[i * 3] = c.r;
                particleColors[i * 3 + 1] = c.g;
                particleColors[i * 3 + 2] = c.b;
            }

            particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

            const particleMat = new THREE.PointsMaterial({
                size: 0.08,
                vertexColors: true,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
            });
            const particles = new THREE.Points(particleGeo, particleMat);
            scene.add(particles);

            // ═══ انیمیشن ═══
            let frameId;
            const clock = new THREE.Clock();

            const animate = () => {
                frameId = requestAnimationFrame(animate);
                if (document.hidden || dead) return;

                const t = clock.getElapsedTime();

                camera.position.x = Math.sin(t * 0.08) * 1.5;
                camera.position.y = Math.cos(t * 0.06) * 1;
                camera.lookAt(0, 0, -10);

                shapes.forEach((shape) => {
                    shape.rotation.x += shape.userData.rotSpeed.x;
                    shape.rotation.y += shape.userData.rotSpeed.y;
                    shape.position.y += Math.sin(t * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.005;
                });

                particles.rotation.y = t * 0.01;

                renderer.render(scene, camera);
            };

            animate();

            cleanupFn = () => {
                cancelAnimationFrame(frameId);
                geometries.forEach(g => g.dispose());
                particleGeo.dispose(); particleMat.dispose();
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