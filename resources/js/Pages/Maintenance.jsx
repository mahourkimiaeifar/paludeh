import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Logo from '@/Components/Logo';

export default function Maintenance() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
            <Head>
                <title>حالت تعمیر | پالوده</title>
            </Head>

            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center"
            >
                {/* Logo with pulse */}
                <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl"
                    />
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl ring-2 ring-white/20">
                        <Logo className="h-20 w-20" />
                    </div>
                </div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4 text-4xl font-black sm:text-6xl"
                >
                    <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                        در حال بروزرسانی
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mx-auto mb-8 max-w-md text-lg text-slate-300"
                >
                    سایت موقتاً برای بهبود تجربه‌ی شما در حال بروزرسانی است.
                    <br />
                    به زودی برمی‌گردیم! 💙
                </motion.p>

                {/* Progress Animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="h-1 w-64 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                    </div>
                </motion.div>

            </motion.div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-8 text-center text-sm text-slate-600">
                © {new Date().getFullYear()} پالوده — ساخته شده با 💙
            </div>
        </div>
    );
}