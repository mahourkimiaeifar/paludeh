import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
        './app/View/**/*.php',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Vazirmatn', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 7s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
