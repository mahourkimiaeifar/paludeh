import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'پالوده';

createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    resolve: (name) => {
        console.log('🔍 Resolving page:', name);
        const pages = import.meta.glob('./Pages/**/*.jsx');
        console.log('📁 Available pages:', Object.keys(pages));
        return resolvePageComponent(`./Pages/${name}.jsx`, pages);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#06b6d4',
    },
});