import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Logo from '@/Components/Logo';

export default function Error({ status, title, description }) {
    const errorMessages = {
        404: {
            title: 'صفحه یافت نشد',
            description: 'متأسفانه صفحه‌ای که دنبالش هستید وجود ندارد یا حذف شده است.',
            emoji: '🔍',
            gradient: 'from-amber-500 to-orange-600',
        },
        500: {
            title: 'خطای سرور',
            description: 'یه مشکلی در سرور پیش اومده. تیم فنی در حال بررسیه.',
            emoji: '⚠️',
            gradient: 'from-rose-500 to-red-600',
        },
        403: {
            title: 'دسترسی غیرمجاز',
            description: 'شما اجازه دسترسی به این صفحه را ندارید.',
            emoji: '🚫',
            gradient: 'from-purple-500 to-pink-600',
        },
    };

    const error = errorMessages[status] || errorMessages[404];

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
            <Head>
                <title>{status} | {title}</title>
            </Head>

            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center"
            >
                {/* Error Code */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-6"
                >
                    <span className={`text-9xl font-black tabular-nums bg-gradient-to-r ${error.gradient} bg-clip-text text-transparent drop-shadow-2xl`}>
                        {status}
                    </span>
                </motion.div>

                {/* Emoji */}
                <motion.div
                    animate={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="mb-6 text-7xl"
                >
                    {error.emoji}
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-4 text-4xl font-black text-white sm:text-5xl"
                >
                    {title || error.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mx-auto mb-8 max-w-md text-lg text-slate-300"
                >
                    {description || error.description}
                </motion.p>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap items-center justify-center gap-3"
                >
                    <Link
                        href="/"
                        className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 hover:shadow-cyan-400/50"
                    >
                        <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        بازگشت به خانه
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-medium backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                    >
                        بازگشت به صفحه قبل
                    </button>
                </motion.div>
            </motion.div>

            {/* Bottom */}
            <div className="absolute bottom-8 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} پالوده — ساخته شده با 💙
            </div>
        </div>
    );
}