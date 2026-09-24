import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ density = 1 }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        // ذرات شناور (تعداد کمتر روی موبایل = پرفورمنس بهتر)
        const isMobile = window.innerWidth < 768;
        const count = Math.floor((isMobile ? 350 : 900) * density);
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: 0x67e8f9,
            size: 0.035,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // کریستال سیمی آبی در عمق صحنه
        const crystalGeo = new THREE.IcosahedronGeometry(2.4, 1);
        const crystalMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.16 });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.set(0, 0, -2);
        scene.add(crystal);

        // پارالاکس نرم با حرکت موس
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
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            if (document.hidden) return; // توقف رندر وقتی تب مخفیه = عمر باتری بیشتر
            const t = clock.getElapsedTime();
            points.rotation.y = t * 0.03;
            points.rotation.x = Math.sin(t * 0.1) * 0.05;
            crystal.rotation.x = t * 0.12;
            crystal.rotation.y = t * 0.16;
            target.x += (mouse.x * 0.6 - target.x) * 0.05;
            target.y += (mouse.y * 0.4 - target.y) * 0.05;
            camera.position.x = target.x;
            camera.position.y = target.y;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        };

        if (prefersReduced) {
            renderer.render(scene, camera); // دسترسی‌پذیری: فریم ثابت برای حساس‌ها به حرکت
        } else {
            animate();
        }

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            geometry.dispose();
            material.dispose();
            crystalGeo.dispose();
            crystalMat.dispose();
            renderer.dispose();
            mount.removeChild(renderer.domElement);
        };
    }, [density]);

    return <div ref={mountRef} className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />;
}