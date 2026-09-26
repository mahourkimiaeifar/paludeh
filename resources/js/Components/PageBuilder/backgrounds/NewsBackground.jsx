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

export default function NewsBackground({ colorTheme = 'blue' }) {
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

            // ═══ صفحات شناور (مثل روزنامه) ═══
            const pages = [];
            const pageCount = isMobile ? 10 : 20;
            const pageGeo = new THREE.PlaneGeometry(3, 4);

            for (let i = 0; i < pageCount; i++) {
                const mat = new THREE.MeshBasicMaterial({
                    color: i % 2 === 0 ? theme.primary : theme.secondary,
                    transparent: true,
                    opacity: 0.1,
                    side: THREE.DoubleSide,
                });
                const page = new THREE.Mesh(pageGeo, mat);
                page.position.set(
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 20,
                    -5 - Math.random() * 20
                );
                page.rotation.y = (Math.random() - 0.5) * 0.5;
                page.userData = {
                    floatSpeed: 0.1 + Math.random() * 0.2,
                    floatOffset: Math.random() * Math.PI * 2,
                };
                pages.push(page);
                scene.add(page);
            }

            // ═══ خطوط متن محو ═══
            const textLines = [];
            for (let i = 0; i < 15; i++) {
                const lineGeo = new THREE.PlaneGeometry(4 + Math.random() * 3, 0.05);
                const lineMat = new THREE.MeshBasicMaterial({
                    color: theme.accent,
                    transparent: true,
                    opacity: 0.1,
                    side: THREE.DoubleSide,
                });
                const line = new THREE.Mesh(lineGeo, lineMat);
                line.position.set(
                    (Math.random() - 0.5) * 25,
                    (Math.random() - 0.5) * 15,
                    -10 - Math.random() * 10
                );
                textLines.push(line);
                scene.add(line);
            }

            // ═══ انیمیشن ═══
            let frameId;
            const clock = new THREE.Clock();

            const animate = () => {
                frameId = requestAnimationFrame(animate);
                if (document.hidden || dead) return;

                const t = clock.getElapsedTime();

                camera.position.y = Math.sin(t * 0.03) * 0.5;
                camera.lookAt(0, 0, -10);

                pages.forEach((page) => {
                    page.position.y += Math.sin(t * page.userData.floatSpeed + page.userData.floatOffset) * 0.002;
                });

                renderer.render(scene, camera);
            };

            animate();

            cleanupFn = () => {
                cancelAnimationFrame(frameId);
                pageGeo.dispose();
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