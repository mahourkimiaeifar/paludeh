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

export default function CompanyBackground({ colorTheme = 'cyan' }) {
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
            camera.position.z = 20;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.setClearColor(theme.bg, 1);
            mount.appendChild(renderer.domElement);

            const isMobile = window.innerWidth < 768;

            // ═══ ۱. شبکه سه‌بعدی (ساختار سازمانی) ═══
            const gridSize = isMobile ? 8 : 12;
            const gridGeo = new THREE.BufferGeometry();
            const gridPositions = [];

            for (let x = -gridSize; x <= gridSize; x += 3) {
                for (let y = -gridSize; y <= gridSize; y += 3) {
                    for (let z = -gridSize; z <= gridSize; z += 3) {
                        gridPositions.push(x, y, z - 10);
                    }
                }
            }

            gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
            const gridMat = new THREE.PointsMaterial({
                color: theme.primary,
                size: 0.08,
                transparent: true,
                opacity: 0.3,
            });
            const grid = new THREE.Points(gridGeo, gridMat);
            scene.add(grid);

            // ═══ ۲. خطوط صاف و حرفه‌ای ═══
            const linesGroup = new THREE.Group();
            const lineCount = isMobile ? 10 : 20;
            for (let i = 0; i < lineCount; i++) {
                const lineGeo = new THREE.CylinderGeometry(0.01, 0.01, 40, 8);
                const lineMat = new THREE.MeshBasicMaterial({
                    color: theme.glow,
                    transparent: true,
                    opacity: 0.08,
                });
                const line = new THREE.Mesh(lineGeo, lineMat);
                line.position.set((i - lineCount / 2) * 2.5, 0, -15);
                line.rotation.z = Math.PI / 2;
                linesGroup.add(line);
            }
            scene.add(linesGroup);

            // ═══ ۳. کره زمین چرخان ═══
            const globeGeo = new THREE.SphereGeometry(4, 32, 32);
            const globeMat = new THREE.MeshBasicMaterial({
                color: theme.primary,
                wireframe: true,
                transparent: true,
                opacity: 0.2,
            });
            const globe = new THREE.Mesh(globeGeo, globeMat);
            globe.position.z = -20;
            scene.add(globe);

            // ═══ انیمیشن ═══
            let frameId;
            const clock = new THREE.Clock();

            const animate = () => {
                frameId = requestAnimationFrame(animate);
                if (document.hidden || dead) return;

                const t = clock.getElapsedTime();

                camera.position.x = Math.sin(t * 0.05) * 1;
                camera.lookAt(0, 0, -10);

                grid.rotation.y = t * 0.02;
                globe.rotation.y = t * 0.1;
                globe.rotation.x = Math.sin(t * 0.05) * 0.1;

                renderer.render(scene, camera);
            };

            animate();

            cleanupFn = () => {
                cancelAnimationFrame(frameId);
                gridGeo.dispose(); gridMat.dispose();
                globeGeo.dispose(); globeMat.dispose();
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