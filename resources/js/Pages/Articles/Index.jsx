import PublicLayout from '@/Layouts/PublicLayout';
import { Link, Head } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Index({ articles }) {
    const containerRef = useRef(null);
    const safeArticles = Array.isArray(articles) ? articles : [];
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <PublicLayout>
            <Head>
                <title>مقالات | پالوده</title>
                <meta name="description" content="جدیدترین مقالات و نوشته‌های پالوده" />
            </Head>
            {/* Hero Section with Parallax */}
            <motion.section
                ref={containerRef}
                style={{ y: heroY, opacity: heroOpacity }}
                className="relative mb-20 overflow-hidden rounded-3xl"
            >
                <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/40 via-cyan-500/10 to-blue-600/10 p-12 backdrop-blur-2xl dark:border-white/10 dark:from-white/5 dark:via-cyan-500/5 dark:to-blue-600/5 md:p-20">
                    {/* Decorative orbs */}
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/30 blur-3xl dark:bg-cyan-500/20" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/30 blur-3xl dark:bg-blue-500/20" />

                    <div className="relative text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-700 backdrop-blur-sm dark:text-cyan-300"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                            </span>
                            {safeArticles.length} مقاله منتشرشده
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="mb-6 text-5xl font-black leading-tight text-slate-900 dark:text-white md:text-7xl"
                        >
                            مقالات{' '}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-l from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-500">
                                    پالوده
                                </span>
                                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 8C50 2 150 2 198 8" stroke="url(#grad1)" strokeWidth="4" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="grad1">
                                            <stop stopColor="#06b6d4" />
                                            <stop offset="1" stopColor="#3b82f6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300 md:text-xl"
                        >
                            دانش، تجربه و ایده‌هایی که با عشق نوشتیم و دوست داریم با تو به اشتراک بذاریم
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {safeArticles.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/40 p-16 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
                >
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/50"
                    >
                        <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </motion.div>
                    <h3 className="mb-3 text-3xl font-black text-slate-900 dark:text-white">
                        هنوز مقاله‌ای منتشر نشده
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        اولین مقاله به زودی منتشر میشه! 🚀
                    </p>
                </motion.div>
            ) : (
                <>
                    {/* Featured Article (اولین مقاله بزرگ) */}
                    {safeArticles.length > 0 && safeArticles[0] && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="mb-12"
                        >
                            <Link href={`/articles/${safeArticles[0].slug}`} className="group block">
                                <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 backdrop-blur-2xl transition-all duration-500 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20 dark:border-white/10 dark:bg-white/5">
                                    <div className="grid md:grid-cols-2">
                                        <div className="relative aspect-video overflow-hidden md:aspect-auto md:min-h-[400px]">
                                            {safeArticles[0].featured_image ? (
                                                <img
                                                    src={safeArticles[0].featured_image}
                                                    alt={safeArticles[0].title}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700">
                                                    <svg className="h-32 w-32 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute left-4 top-4">
                                                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                                                    جدیدترین
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-center p-8 md:p-12">
                                            <div className="mb-4 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">
                                                        {safeArticles[0].author?.charAt(0) || '?'}
                                                    </div>
                                                    <span className="font-medium">{safeArticles[0].author || 'ناشناس'}</span>
                                                </div>
                                                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                                <span>{safeArticles[0].published_at || '—'}</span>
                                            </div>

                                            <h2 className="mb-4 text-3xl font-black leading-tight text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300 md:text-4xl">
                                                {safeArticles[0].title}
                                            </h2>

                                            <p className="mb-6 line-clamp-3 text-slate-600 dark:text-slate-300 md:text-lg">
                                                {safeArticles[0].excerpt || 'ادامه مطلب را بخوانید...'}
                                            </p>

                                            <div className="flex items-center gap-2 font-bold text-cyan-600 transition-all group-hover:gap-4 dark:text-cyan-300">
                                                <span>ادامه مطلب</span>
                                                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* بقیه مقالات - Grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {safeArticles.slice(1).filter(Boolean).map((article, i) => (
                            <motion.article
                                key={article.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="group"
                            >
                                <Link href={`/articles/${article.slug}`} className="block h-full">
                                    <div className="relative h-full overflow-hidden rounded-2xl border border-white/20 bg-white/40 backdrop-blur-2xl transition-all duration-500 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 dark:border-white/10 dark:bg-white/5">
                                        {/* تصویر */}
                                        <div className="relative aspect-video overflow-hidden">
                                            {article.featured_image ? (
                                                <img
                                                    src={article.featured_image}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/30 via-blue-600/30 to-indigo-700/30">
                                                    <svg className="h-16 w-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                            {/* Read indicator */}
                                            <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                                <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-900 backdrop-blur-sm">
                                                    <span>ادامه مطلب</span>
                                                    <svg className="h-3.5 w-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* محتوا */}
                                        <div className="p-6">
                                            <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-[10px] font-bold text-white">
                                                    {article.author?.charAt(0) || '?'}
                                                </div>
                                                <span className="font-medium">{article.author || 'ناشناس'}</span>
                                                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                                <span>{article.published_at || '—'}</span>
                                            </div>

                                            <h3 className="mb-3 line-clamp-2 text-xl font-black leading-tight text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300">
                                                {article.title}
                                            </h3>

                                            <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                                                {article.excerpt || 'ادامه مطلب را بخوانید...'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                </>
            )}
        </PublicLayout>
    );
}