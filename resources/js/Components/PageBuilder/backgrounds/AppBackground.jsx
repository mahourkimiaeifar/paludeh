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

export default function AppBackground({ colorTheme = 'purple' }) {
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

            // ═══ ۱. ذرات دیجیتال (پیکسل) ═══
            const pixelCount = isMobile ? 300 : 800;
            const pixelGeo = new THREE.BufferGeometry();
            const pixelPositions = new Float32Array(pixelCount * 3);
            const pixelColors = new Float32Array(pixelCount * 3);

            const c1 = new THREE.Color(theme.primary);
            const c2 = new THREE.Color(theme.accent);

            for (let i = 0; i < pixelCount; i++) {
                pixelPositions[i * 3] = (Math.random() - 0.5) * 50;
                pixelPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
                pixelPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;

                const c = Math.random() > 0.5 ? c1 : c2;
                pixelColors[i * 3] = c.r;
                pixelColors[i * 3 + 1] = c.g;
                pixelColors[i * 3 + 2] = c.b;
            }

            pixelGeo.setAttribute('position', new THREE.BufferAttribute(pixelPositions, 3));
            pixelGeo.setAttribute('color', new THREE.BufferAttribute(pixelColors, 3));

            const pixelMat = new THREE.PointsMaterial({
                size: 0.08,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
            });
            const pixels = new THREE.Points(pixelGeo, pixelMat);
            scene.add(pixels);

            // ═══ ۲. شبکه الکترونیکی ═══
            const nodeCount = isMobile ? 15 : 30;
            const nodes = [];
            for (let i = 0; i < nodeCount; i++) {
                nodes.push({
                    x: (Math.random() - 0.5) * 30,
                    y: (Math.random() - 0.5) * 20,
                    z: -5 - Math.random() * 15,
                });
            }

            const linePositions = [];
            for (let i = 0; i < nodeCount; i++) {
                for (let j = i + 1; j < nodeCount; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dz = nodes[i].z - nodes[j].z;
                    if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 10) {
                        linePositions.push(
                            nodes[i].x, nodes[i].y, nodes[i].z,
                            nodes[j].x, nodes[j].y, nodes[j].z
                        );
                    }
                }
            }

            const lineGeo = new THREE.BufferGeometry();
            lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            const lineMat = new THREE.LineBasicMaterial({
                color: theme.glow,
                transparent: true,
                opacity: 0.15,
            });
            const lines = new THREE.LineSegments(lineGeo, lineMat);
            scene.add(lines);

            // ═══ ۳. فریم گوشی شناور ═══
            const phoneGroup = new THREE.Group();
            const phoneGeo = new THREE.BoxGeometry(2.5, 5, 0.2);
            const phoneMat = new THREE.MeshBasicMaterial({
                color: theme.primary,
                wireframe: true,
                transparent: true,
                opacity: 0.3,
            });
            const phone = new THREE.Mesh(phoneGeo, phoneMat);
            phoneGroup.add(phone);

            // صفحه گوشی
            const screenGeo = new THREE.PlaneGeometry(2.2, 4.5);
            const screenMat = new THREE.MeshBasicMaterial({
                color: theme.glow,
                transparent: true,
                opacity: 0.1,
            });
            const screen = new THREE.Mesh(screenGeo, screenMat);
            screen.position.z = 0.15;
            phoneGroup.add(screen);

            phoneGroup.position.z = -10;
            scene.add(phoneGroup);

            // ═══ انیمیشن ═══
            let frameId;
            const clock = new THREE.Clock();

            const animate = () => {
                frameId = requestAnimationFrame(animate);
                if (document.hidden || dead) return;

                const t = clock.getElapsedTime();

                camera.position.x = Math.sin(t * 0.1) * 1;
                camera.lookAt(0, 0, -10);

                pixels.rotation.y = t * 0.02;
                phoneGroup.rotation.y = Math.sin(t * 0.3) * 0.3;
                phoneGroup.position.y = Math.sin(t * 0.5) * 0.5;

                renderer.render(scene, camera);
            };

            animate();

            cleanupFn = () => {
                cancelAnimationFrame(frameId);
                pixelGeo.dispose(); pixelMat.dispose();
                lineGeo.dispose(); lineMat.dispose();
                phoneGeo.dispose(); phoneMat.dispose();
                screenGeo.dispose(); screenMat.dispose();
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