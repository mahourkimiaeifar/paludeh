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

export default function EventBackground({ colorTheme = 'cyan' }) {
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

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.setClearColor(theme.bg, 1);
            mount.appendChild(renderer.domElement);

            const isMobile = window.innerWidth < 768;

            // ═══ ۱. ذرات نورانی (مثل نورافشانی) ═══
            const sparkleCount = isMobile ? 300 : 800;
            const sparkleGeo = new THREE.BufferGeometry();
            const sparklePositions = new Float32Array(sparkleCount * 3);
            const sparkleColors = new Float32Array(sparkleCount * 3);
            const sparkleSpeeds = new Float32Array(sparkleCount);

            const color1 = new THREE.Color(theme.primary);
            const color2 = new THREE.Color(theme.secondary);
            const color3 = new THREE.Color(theme.accent);

            for (let i = 0; i < sparkleCount; i++) {
                sparklePositions[i * 3] = (Math.random() - 0.5) * 60;
                sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
                sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

                const colorChoice = Math.random();
                const c = colorChoice < 0.4 ? color1 : colorChoice < 0.7 ? color2 : color3;
                sparkleColors[i * 3] = c.r;
                sparkleColors[i * 3 + 1] = c.g;
                sparkleColors[i * 3 + 2] = c.b;

                sparkleSpeeds[i] = 0.02 + Math.random() * 0.05;
            }

            sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
            sparkleGeo.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3));

            const sparkleMat = new THREE.PointsMaterial({
                size: 0.15,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending,
            });
            const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
            scene.add(sparkles);

            // ═══ ۲. کانفتی شناور رنگی ═══
            const confettiCount = isMobile ? 50 : 150;
            const confettiGroup = new THREE.Group();
            const confettiColors = [theme.primary, theme.secondary, theme.accent, 0xfbbf24, 0xf472b6];
            const confettiGeo = new THREE.PlaneGeometry(0.3, 0.15);

            for (let i = 0; i < confettiCount; i++) {
                const mat = new THREE.MeshBasicMaterial({
                    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7,
                });
                const confetti = new THREE.Mesh(confettiGeo, mat);
                confetti.position.set(
                    (Math.random() - 0.5) * 40,
                    Math.random() * 30 - 15,
                    (Math.random() - 0.5) * 20 - 5
                );
                confetti.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                confetti.userData = {
                    fallSpeed: 0.02 + Math.random() * 0.04,
                    rotSpeed: { x: (Math.random() - 0.5) * 0.05, y: (Math.random() - 0.5) * 0.05 },
                    swaySpeed: Math.random() * 2,
                    swayOffset: Math.random() * Math.PI * 2,
                };
                confettiGroup.add(confetti);
            }
            scene.add(confettiGroup);

            // ═══ ۳. حلقه‌های چرخان (نورهای استیج) ═══
            const rings = [];
            for (let i = 0; i < 4; i++) {
                const ringGeo = new THREE.TorusGeometry(6 + i * 3, 0.05, 8, 100);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: i % 2 === 0 ? theme.primary : theme.accent,
                    transparent: true,
                    opacity: 0.3,
                    blending: THREE.AdditiveBlending,
                });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.position.z = -10 - i * 3;
                ring.userData = {
                    rotSpeed: 0.1 + i * 0.05,
                    wobble: Math.random() * Math.PI,
                };
                rings.push(ring);
                scene.add(ring);
            }

            // ═══ ۴. پالس‌های نور از مرکز ═══
            const pulses = [];
            const pulseGeo = new THREE.SphereGeometry(0.2, 16, 16);
            for (let i = 0; i < 5; i++) {
                const pulseMat = new THREE.MeshBasicMaterial({
                    color: theme.glow,
                    transparent: true,
                    opacity: 0.5,
                    blending: THREE.AdditiveBlending,
                });
                const pulse = new THREE.Mesh(pulseGeo, pulseMat);
                pulse.position.z = -5;
                pulse.userData = { delay: i * 0.8, maxScale: 25 };
                pulses.push(pulse);
                scene.add(pulse);
            }

            // ═══ ۵. ستاره‌های درخشان ═══
            const starCount = isMobile ? 200 : 500;
            const starGeo = new THREE.BufferGeometry();
            const starPositions = new Float32Array(starCount * 3);
            for (let i = 0; i < starCount; i++) {
                starPositions[i * 3] = (Math.random() - 0.5) * 100;
                starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
                starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            }
            starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            const starMat = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.1,
                transparent: true,
                opacity: 0.5,
            });
            const stars = new THREE.Points(starGeo, starMat);
            scene.add(stars);

            // ═══ انیمیشن ═══
            let frameId;
            const clock = new THREE.Clock();

            const animate = () => {
                frameId = requestAnimationFrame(animate);
                if (document.hidden || dead) return;

                const t = clock.getElapsedTime();

                // حرکت ملایم دوربین
                camera.position.x = Math.sin(t * 0.1) * 1;
                camera.position.y = Math.cos(t * 0.08) * 0.5;
                camera.lookAt(0, 0, -10);

                // ذرات نورانی - شناور به بالا
                for (let i = 0; i < sparkleCount; i++) {
                    sparklePositions[i * 3 + 1] += sparkleSpeeds[i];
                    if (sparklePositions[i * 3 + 1] > 20) sparklePositions[i * 3 + 1] = -20;
                }
                sparkleGeo.attributes.position.needsUpdate = true;
                sparkles.rotation.y = t * 0.02;

                // کانفتی - افتادن با چرخش
                confettiGroup.children.forEach((c) => {
                    c.position.y -= c.userData.fallSpeed;
                    c.position.x += Math.sin(t * c.userData.swaySpeed + c.userData.swayOffset) * 0.01;
                    c.rotation.x += c.userData.rotSpeed.x;
                    c.rotation.y += c.userData.rotSpeed.y;
                    if (c.position.y < -20) c.position.y = 20;
                });

                // حلقه‌های چرخان
                rings.forEach((ring, i) => {
                    ring.rotation.z = t * ring.userData.rotSpeed;
                    ring.rotation.x = Math.sin(t * 0.3 + ring.userData.wobble) * 0.2;
                });

                // پالس‌های نور
                pulses.forEach((p) => {
                    const elapsed = (t + p.userData.delay) % 4;
                    const progress = elapsed / 4;
                    const scale = 1 + progress * p.userData.maxScale;
                    p.scale.set(scale, scale, scale);
                    p.material.opacity = Math.max(0, 0.5 * (1 - progress));
                });

                // ستاره‌ها
                stars.rotation.y = t * 0.01;

                renderer.render(scene, camera);
            };

            animate();

            cleanupFn = () => {
                cancelAnimationFrame(frameId);
                sparkleGeo.dispose(); sparkleMat.dispose();
                confettiGeo.dispose();
                pulseGeo.dispose();
                starGeo.dispose(); starMat.dispose();
                rings.forEach(r => r.geometry.dispose());
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