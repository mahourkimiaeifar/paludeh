import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import Logo from '@/Components/Logo';


const ThreeBackground = lazy(() => import('@/Components/ThreeBackground'));

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
            <div className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950" aria-hidden="true" />
            <Suspense fallback={null}><ThreeBackground /></Suspense>
            <div className="fixed -right-32 -top-32 -z-10 h-96 w-96 animate-pulse-slow rounded-full bg-cyan-500/15 blur-3xl" aria-hidden="true" />
            <div className="fixed -bottom-32 -left-32 -z-10 h-96 w-96 animate-pulse-slow rounded-full bg-blue-600/15 blur-3xl" aria-hidden="true" />

            <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative w-full max-w-md"
            >
                <Logo className="mx-auto mb-4 h-16 w-16" />
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-block">
                        <span className="bg-gradient-to-l from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-4xl font-black tracking-tight text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.35)]">
                            پالوده
                        </span>
                    </Link>
                </div>

                <div className="relative rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.06] p-8 shadow-2xl shadow-blue-950/60 backdrop-blur-2xl">
                    <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" aria-hidden="true" />
                    {children}
                </div>
            </motion.div>
        </div>
    );
}