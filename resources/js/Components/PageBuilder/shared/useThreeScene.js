import { useEffect, useRef } from 'react';

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

export default function useThreeScene({ background = 0x000814, fogDensity = 0.012 } = {}) {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        let dead = false;
        let cleanupFn = null;

        loadThree().then((THREE) => {
            if (dead) return;

            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(background, fogDensity);

            const camera = new THREE.PerspectiveCamera(
                75,
                mount.clientWidth / mount.clientHeight,
                0.1,
                200
            );
            camera.position.z = 15;

            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.setClearColor(background, 1);
            mount.appendChild(renderer.domElement);

            const isMobile = window.innerWidth < 768;
            const clock = new THREE.Clock();

            sceneRef.current = { THREE, scene, camera, renderer, isMobile };

            const onResize = () => {
                camera.aspect = mount.clientWidth / mount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mount.clientWidth, mount.clientHeight);
            };
            window.addEventListener('resize', onResize);

            cleanupFn = () => {
                window.removeEventListener('resize', onResize);
                renderer.dispose();
                if (mount.contains(renderer.domElement)) {
                    mount.removeChild(renderer.domElement);
                }
            };
        }).catch(console.error);

        return () => {
            dead = true;
            cleanupFn?.();
        };
    }, []);

    return { mountRef, sceneRef };
}