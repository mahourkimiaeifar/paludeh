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

export default function LandingBackground({ colorTheme = 'rose' }) {
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
            scene.fog = new THREE.FogExp2(theme.bg, 0.015);

            const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 200);
            camera.position.z = 15;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.setClearColor(theme.bg, 1);
            mount.appendChild(renderer.domElement);

            const isMobile = window.innerWidth < 768;

            // ═══ ۱. ذرات هدفمند (فلش به جلو) ═══
            const arrowCount = isMobile ? 100 : 300;
            const arrowGeo = new THREE.BufferGeometry();
            const arrowPositions = new Float32Array(arrowCount * 3);
            const arrowSpeeds = new Float32Array(arrowCount);

            for (let i = 0; i < arrowCount; i++) {
                arrowPositions[i * 3] = (Math.random() - 0.5) * 40;
                arrowPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
                arrowPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
                arrowSpeeds[i] = 0.05 + Math.random() * 0.15;
            }

            arrowGeo.setAttribute('position', new THREE.BufferAttribute(arrowPositions, 3));
            const arrowMat = new THREE.PointsMaterial({
                color: theme.primary,
                size: 0.12,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending,
            });
            const arrows = new THREE.Points(arrowGeo, arrowMat);
            scene.add(arrows);

            // ═══ ۲. خطوط انرژی ═══
            const energyLines = [];
            for (let i = 0; i < 8; i++) {
                const lineGeo = new THREE.CylinderGeometry(0.03, 0.03, 50, 8);
                const lineMat = new THREE.MeshBasicMaterial({
                    color: theme.glow,
                    transparent: true,
                    opacity: 0.15,
                    blending: THREE.AdditiveBlending,
                });
                const line = new THREE.Mesh(lineGeo, lineMat);
                line.position.set((i - 4) * 5, 0, -20);
                line.rotation.x = Math.PI / 2;
                energyLines.push(line);
                scene.add(line);
            }

            // ═══ ۳. پالس‌های ضربان ═══
            const pulses = [];
            const pulseGeo = new THREE.RingGeometry(0.5, 0.6, 32);
            for (let i = 0; i < 4; i++) {
                const pulseMat = new THREE.MeshBasicMaterial({
                    color: theme.primary,
                    transparent: true,
                    opacity: 0.4,
                    side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending,
                });
                const pulse = new THREE.Mesh(pulseGeo, pulseMat);
                pulse.position.z = -10;
                pulse.userData = { delay: i * 1, maxScale: 20 };
                pulses.push(pulse);
                scene.add(pulse);
            }

            // ═══ انیمیشن ═══
            let frameId;
            const clock = new THREE.Clock();

            const animate = () => {
                frameId = requestAnimationFrame(animate);
                if (document.hidden || dead) return;

                const t = clock.getElapsedTime();

                camera.position.x = Math.sin(t * 0.1) * 0.5;
                camera.lookAt(0, 0, -10);

                // ذرات به سمت جلو حرکت می‌کنن
                for (let i = 0; i < arrowCount; i++) {
                    arrowPositions[i * 3 + 2] += arrowSpeeds[i];
                    if (arrowPositions[i * 3 + 2] > 20) arrowPositions[i * 3 + 2] = -20;
                }
                arrowGeo.attributes.position.needsUpdate = true;

                // خطوط انرژی
                energyLines.forEach((line, i) => {
                    line.material.opacity = 0.1 + Math.sin(t * 2 + i) * 0.05;
                });

                // پالس‌های ضربان
                pulses.forEach((p) => {
                    const elapsed = (t + p.userData.delay) % 3;
                    const progress = elapsed / 3;
                    const scale = 1 + progress * p.userData.maxScale;
                    p.scale.set(scale, scale, scale);
                    p.material.opacity = Math.max(0, 0.4 * (1 - progress));
                });

                renderer.render(scene, camera);
            };

            animate();

            cleanupFn = () => {
                cancelAnimationFrame(frameId);
                arrowGeo.dispose(); arrowMat.dispose();
                pulseGeo.dispose();
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