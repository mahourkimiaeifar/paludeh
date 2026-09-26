import AdminLayout from '@/Layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Index({ cache_info }) {
    const { props } = usePage();
    const flash = props.initialPage?.props?.flash || props.flash || {};
    const [clearing, setClearing] = useState(null);

    const clearCache = (type, confirmMessage) => {
        if (confirmMessage && !confirm(confirmMessage)) return;
        setClearing(type);
        router.post(`/admin/cache/clear/${type}`, {}, {
            onFinish: () => setClearing(null),
        });
    };

    const cacheItems = [
        { type: 'config', title: 'کش تنظیمات', desc: 'تنظیمات اپلیکیشن (فایل‌های config)', icon: '⚙️', color: 'from-blue-500 to-cyan-500' },
        { type: 'cache', title: 'کش اپلیکیشن', desc: 'داده‌های کش شده (sessions, queries)', icon: '🗃️', color: 'from-purple-500 to-pink-500' },
        { type: 'route', title: 'کش مسیرها', desc: 'Route های کامپایل شده', icon: '🛣️', color: 'from-amber-500 to-orange-500' },
        { type: 'view', title: 'کش ویوها', desc: 'فایل‌های blade کامپایل شده', icon: '👁️', color: 'from-emerald-500 to-teal-500' },
    ];

    return (
        <AdminLayout title="مدیریت کش">
            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mb-6 flex items-center gap-3 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-700 dark:text-green-300">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{flash.success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Clear All Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-l from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-6 backdrop-blur-xl dark:border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="mb-1 text-xl font-black text-slate-900 dark:text-white">پاکسازی کامل کش</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">همه‌ی کش‌های سیستم را یکجا پاک کنید</p>
                    </div>
                    <button
                        onClick={() => clearCache('all', 'آیا مطمئن هستید؟ همه‌ی کش‌ها پاک خواهند شد!')}
                        disabled={clearing === 'all'}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3 font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-rose-400/40 hover:brightness-110 disabled:opacity-60"
                    >
                        {clearing === 'all' ? (
                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        )}
                        پاکسازی کامل
                    </button>
                </div>
            </motion.div>

            {/* Cache Items */}
            <div className="grid gap-6 md:grid-cols-2">
                {cacheItems.map((item, i) => (
                    <motion.div
                        key={item.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
                    >
                        <div className="mb-4 flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-xl shadow-lg`}>
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => clearCache(item.type)}
                            disabled={clearing === item.type}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-100 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                        >
                            {clearing === item.type ? (
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            )}
                            پاک کردن کش
                        </button>
                    </motion.div>
                ))}
            </div>
        </AdminLayout>
    );
}