import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Index({ articles }) {
    const { flash } = usePage().props;

    const deleteArticle = (id) => {
        if (confirm('آیا مطمئنی؟ این مقاله برای همیشه حذف میشه!')) {
            router.delete(`/admin/articles/${id}`);
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'published') {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    منتشرشده
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                پیش‌نویس
            </span>
        );
    };

    return (
        <AdminLayout title="مدیریت مقالات">
            {flash?.success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-600 dark:text-green-300"
                >
                    {flash.success}
                </motion.div>
            )}

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {articles.length > 0 ? `${articles.length} مقاله` : 'هنوز مقاله‌ای ننوشتی'}
                    </p>
                </div>
                <Link
                    href="/admin/articles/create"
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110"
                >
                    <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    مقاله جدید
                </Link>
            </div>

            {articles.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-12 dark:border-white/10 dark:from-slate-900/50 dark:to-slate-950/50"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500/20 blur-xl" />
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/50">
                                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <h3 className="mb-2 text-2xl font-black text-slate-900 dark:text-white">
                        هنوز مقاله‌ای ننوشتی!
                    </h3>
                    <p className="mb-8 max-w-md text-center text-slate-600 dark:text-slate-400">
                        اولین مقاله‌ت رو بنویس و با دنیا به اشتراک بذار. یه سفر هزار فرسنگی با یه قدم شروع میشه! 🚀
                    </p>

                    <Link
                        href="/admin/articles/create"
                        className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110"
                    >
                        <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        نوشتن اولین مقاله
                    </Link>
                </motion.div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, i) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-cyan-400/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="relative">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="mb-1 text-lg font-bold text-slate-900 line-clamp-2 dark:text-white">
                                            {article.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400" dir="ltr">
                                            /{article.slug}
                                        </p>
                                    </div>
                                    {getStatusBadge(article.status)}
                                </div>

                                <div className="mb-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                        {article.author}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                        {article.published_at || article.created_at}
                                    </div>
                                </div>

                                <div className="flex gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
                                    <Link
                                        href={`/admin/articles/${article.id}/edit`}
                                        className="flex-1 rounded-lg bg-cyan-500/10 px-4 py-2 text-center text-sm font-medium text-cyan-600 transition-all hover:bg-cyan-500/20 dark:text-cyan-300"
                                    >
                                        ویرایش
                                    </Link>
                                    <button
                                        onClick={() => deleteArticle(article.id)}
                                        className="rounded-lg bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-600 transition-all hover:bg-rose-500/20 dark:text-rose-300"
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}