import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

export default function Index({ articles }) {
    const { flash } = usePage().props;
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const safeArticles = Array.isArray(articles) ? articles : [];

    const stats = useMemo(() => ({
        all: safeArticles.length,
        published: safeArticles.filter((a) => a.status === 'published').length,
        draft: safeArticles.filter((a) => a.status === 'draft').length,
    }), [safeArticles]);

    const filtered = useMemo(() => {
        return safeArticles.filter((a) => {
            const matchFilter = filter === 'all' || a.status === filter;
            const matchSearch = !search || 
                a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.author.toLowerCase().includes(search.toLowerCase());
            return matchFilter && matchSearch;
        });
    }, [safeArticles, filter, search]);

    const deleteArticle = (id) => {
        if (confirm('آیا مطمئنی؟ این مقاله برای همیشه حذف میشه!')) {
            router.delete(`/admin/articles/${id}`);
        }
    };

    const filters = [
        { key: 'all', label: 'همه', count: stats.all },
        { key: 'published', label: 'منتشرشده', count: stats.published },
        { key: 'draft', label: 'پیش‌نویس', count: stats.draft },
    ];

    return (
        <AdminLayout title="مدیریت مقالات">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 grid grid-cols-3 gap-4"
            >
                {filters.map((f, i) => (
                    <motion.button
                        key={f.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setFilter(f.key)}
                        className={`group relative overflow-hidden rounded-2xl border p-5 text-right transition-all duration-300 ${
                            filter === f.key
                                ? 'border-cyan-400/50 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 shadow-lg shadow-cyan-500/20 dark:border-cyan-400/30'
                                : 'border-slate-200 bg-white/70 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-white/20'
                        }`}
                    >
                        <div className="relative">
                            <div className="mb-1 flex items-center justify-between">
                                <span className={`text-3xl font-black ${
                                    filter === f.key ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-900 dark:text-white'
                                }`}>
                                    {f.count}
                                </span>
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                    filter === f.key ? 'bg-cyan-500/20' : 'bg-slate-100 dark:bg-white/5'
                                }`}>
                                    {f.key === 'published' && <span className="h-3 w-3 rounded-full bg-green-500" />}
                                    {f.key === 'draft' && <span className="h-3 w-3 rounded-full bg-amber-500" />}
                                    {f.key === 'all' && (
                                        <svg className={`h-5 w-5 ${filter === f.key ? 'text-cyan-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <p className={`text-sm font-medium ${
                                filter === f.key ? 'text-cyan-600 dark:text-cyan-300' : 'text-slate-600 dark:text-slate-400'
                            }`}>
                                {f.label}
                            </p>
                        </div>
                    </motion.button>
                ))}
            </motion.div>

            <AnimatePresence>
                {flash?.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 flex items-center gap-3 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-600 dark:text-green-300"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">{flash.success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-md">
                    <svg className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="جستجو در مقالات..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pr-11 pl-4 text-slate-900 transition-all focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-500"
                    />
                </div>

                <Link
                    href="/admin/articles/create"
                    className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110"
                >
                    <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    مقاله جدید
                </Link>
            </div>

            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
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
                        {safeArticles.length === 0 ? 'هنوز مقاله‌ای ننوشتی!' : 'چیزی پیدا نشد'}
                    </h3>
                    <p className="mb-8 max-w-md text-center text-slate-600 dark:text-slate-400">
                        {safeArticles.length === 0
                            ? 'اولین مقاله‌ت رو بنویس و با دنیا به اشتراک بذار 🚀'
                            : 'عبارت جستجو یا فیلتر رو تغییر بده'}
                    </p>

                    {safeArticles.length === 0 && (
                        <Link
                            href="/admin/articles/create"
                            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110"
                        >
                            <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            نوشتن اولین مقاله
                        </Link>
                    )}
                </motion.div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <AnimatePresence>
                        {filtered.map((article, i) => (
                            <motion.article
                                key={article.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-cyan-400/30"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    {article.featured_image ? (
                                        <img
                                            src={article.featured_image}
                                            alt={article.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20">
                                            <svg className="h-20 w-20 text-cyan-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                        </div>
                                    )}

                                    <div className="absolute left-3 top-3">
                                        {article.status === 'published' ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/90 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                                                منتشرشده
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                پیش‌نویس
                                            </span>
                                        )}
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <Link
                                            href={`/admin/articles/${article.id}/edit`}
                                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 transition-transform hover:scale-110"
                                            title="ویرایش"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => deleteArticle(article.id)}
                                            className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/90 text-white transition-transform hover:scale-110"
                                            title="حذف"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <Link href={`/admin/articles/${article.id}/edit`} className="block">
                                        <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300">
                                            {article.title}
                                        </h3>
                                    </Link>

                                    <div className="mb-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                            <span>{article.author}</span>
                                        </div>
                                        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        <div className="flex items-center gap-1.5">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                            </svg>
                                            <span dir="ltr">{article.published_at || article.created_at}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/admin/articles/${article.id}/edit`}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-600/10 py-2.5 text-sm font-bold text-cyan-600 transition-all hover:from-cyan-500/20 hover:to-blue-600/20 dark:text-cyan-300"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                                        </svg>
                                        ویرایش مقاله
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </AdminLayout>
    );
}