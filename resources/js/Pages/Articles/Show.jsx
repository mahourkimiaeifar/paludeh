import PublicLayout from '@/Layouts/PublicLayout';
import { Link, Head } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import Comments from '@/Components/Comments';

export default function Show({ article, comments, allowComments }) {
    const articleRef = useRef(null);
    const figureRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [activeHeading, setActiveHeading] = useState('');
    const [tocOpen, setTocOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const safeArticle = article ?? {};
    const title = String(safeArticle.meta_title || safeArticle.title || 'مقاله');
    const description = String(safeArticle.meta_description || safeArticle.excerpt || safeArticle.title || 'مقاله‌ای از پالوده');
    const authorName = String(safeArticle.author || 'ناشناس');
    const authorInitial = authorName.charAt(0) || '?';

    const { scrollYProgress: figProgress } = useScroll({
        target: figureRef,
        offset: ['start end', 'end start'],
    });
    const imgScale = useTransform(figProgress, [0, 1], [1.12, 1]);

    const readingTime = useMemo(() => {
        const text = (safeArticle.content || '').replace(/<[^>]*>/g, '');
        const words = text.trim().split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    }, [safeArticle.content]);

    const headings = useMemo(() => {
        const temp = document.createElement('div');
        temp.innerHTML = safeArticle.content || '';
        return Array.from(temp.querySelectorAll('h2, h3')).map((h, i) => ({
            id: `heading-${i}`,
            text: h.textContent,
            level: h.tagName.toLowerCase(),
        }));
    }, [safeArticle.content]);

    const processedContent = useMemo(() => {
        const temp = document.createElement('div');
        temp.innerHTML = safeArticle.content || '';
        temp.querySelectorAll('h2, h3').forEach((h, i) => { h.id = `heading-${i}`; });
        return temp.innerHTML;
    }, [safeArticle.content]);

    useEffect(() => {
        const onScroll = () => {
            if (!articleRef.current) return;
            const rect = articleRef.current.getBoundingClientRect();
            const total = rect.height - window.innerHeight;
            setProgress(total > 0 ? Math.min(100, (Math.max(0, -rect.top) / total) * 100) : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActiveHeading(e.target.id)),
            { rootMargin: '-20% 0px -70% 0px' }
        );
        headings.forEach((h) => {
            const el = document.getElementById(h.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [headings]);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { }
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <PublicLayout>
            <Head title={`${title} | پالوده`}>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="article" />
            </Head>

            {/* Reading Progress */}
            <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-slate-200/30 dark:bg-white/5" aria-hidden="true">
                <motion.div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" style={{ width: `${progress}%` }} />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
                    {/* TOC Sidebar */}
                    <aside className="sticky top-24 hidden h-fit max-h-[calc(100vh-8rem)] overflow-y-auto lg:block">
                        <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50">
                            <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                فهرست مطالب
                            </h3>
                            {headings.length > 0 ? (
                                <nav className="space-y-1">
                                    {headings.map((h) => (
                                        <a
                                            key={h.id}
                                            href={`#${h.id}`}
                                            className={`block rounded-lg px-3 py-2 text-sm transition-all ${h.level === 'h3' ? 'pr-6' : ''} ${activeHeading === h.id
                                                ? 'bg-cyan-500/10 font-bold text-cyan-700 dark:text-cyan-300'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            {h.text}
                                        </a>
                                    ))}
                                </nav>
                            ) : (
                                <p className="text-xs text-slate-500">این مقاله فهرست مطالب ندارد.</p>
                            )}
                        </div>
                    </aside>

                    <article ref={articleRef} className="min-w-0">
                        {/* Back */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
                            <Link href="/articles" className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300">
                                <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                بازگشت به مقالات
                            </Link>
                        </motion.div>

                        {/* Header */}
                        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12 max-w-3xl">
                            <div className="mb-8 flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/30">
                                        {authorInitial}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{authorName}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                            <span>{safeArticle.published_at || '—'}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                            <span>{readingTime} دقیقه مطالعه</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h1 className="mb-8 text-4xl font-black leading-[1.15] tracking-tight text-slate-900 dark:text-white md:text-6xl">
                                {safeArticle.title || 'بدون عنوان'}
                            </h1>

                            {safeArticle.excerpt && (
                                <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-300 md:text-2xl">{safeArticle.excerpt}</p>
                            )}

                            {headings.length > 0 && (
                                <button
                                    onClick={() => setTocOpen(!tocOpen)}
                                    className="mt-6 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/50 p-4 text-right backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-slate-900/50"
                                >
                                    <span className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                        فهرست مطالب ({headings.length})
                                    </span>
                                    <svg className={`h-4 w-4 transition-transform ${tocOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                            )}

                            {tocOpen && headings.length > 0 && (
                                <div className="mt-3 rounded-2xl border border-slate-200 bg-white/50 p-4 backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-slate-900/50">
                                    <nav className="space-y-1">
                                        {headings.map((h) => (
                                            <a key={h.id} href={`#${h.id}`} onClick={() => setTocOpen(false)}
                                                className={`block rounded-lg px-3 py-2 text-sm ${h.level === 'h3' ? 'pr-6' : ''} text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5`}>
                                                {h.text}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </motion.header>

                        {/* 🖼️ تصویر شاخص — قاب گرادیانی + Ken Burns */}
                        {safeArticle.featured_image && (
                            <motion.figure
                                ref={figureRef}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="relative mb-20"
                            >
                                <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-cyan-500/25 via-blue-500/15 to-indigo-500/25 blur-3xl" aria-hidden="true" />
                                <div className="relative rounded-[2rem] bg-gradient-to-tr from-cyan-500/60 via-blue-500/40 to-indigo-500/60 p-px shadow-2xl shadow-cyan-500/20">
                                    <div className="rounded-[calc(2rem-1px)] bg-white/80 p-2.5 backdrop-blur-xl dark:bg-slate-900/80">
                                        <div className="overflow-hidden rounded-[1.5rem]">
                                            <motion.img
                                                style={{ scale: imgScale }}
                                                src={safeArticle.featured_image}
                                                alt={safeArticle.title || ''}
                                                className="aspect-[16/9] w-full object-cover"
                                                onError={(e) => { e.currentTarget.closest('figure').style.display = 'none'; }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.figure>
                        )}

                        {/* Body */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="article-content mx-auto max-w-3xl"
                            dangerouslySetInnerHTML={{ __html: processedContent }}
                        />

                        {/* Share + Author */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mx-auto mt-24 max-w-3xl"
                        >
                            <div className="mb-12 flex items-center gap-4">
                                <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent dark:from-white/10" />
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">پایان</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
                            </div>

                            {/* Share row */}
                            <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">اشتراک‌گذاری:</span>
                                <button
                                    onClick={copyLink}
                                    className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${copied
                                        ? 'border-green-400/50 bg-green-500/10 text-green-600 dark:text-green-300'
                                        : 'border-slate-200 bg-white/60 text-slate-600 hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300'
                                        }`}
                                >
                                    {copied ? (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                                    )}
                                    {copied ? 'کپی شد!' : 'کپی لینک'}
                                </button>
                                <a
                                    href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300"
                                >
                                    تلگرام
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300"
                                >
                                    توییتر
                                </a>
                            </div>

                            {/* ✍️ باکس نویسنده — گرادیان فریم */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-cyan-500/50 via-blue-500/35 to-indigo-500/50 p-px shadow-xl shadow-cyan-500/10">
                                <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-white/90 p-8 backdrop-blur-xl dark:bg-slate-900/90">
                                    <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />
                                    <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl" aria-hidden="true" />

                                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
                                        <div className="relative mx-auto sm:mx-0">
                                            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-3xl font-black text-white shadow-xl shadow-cyan-500/30 ring-4 ring-white/60 dark:ring-white/10">
                                                {authorInitial}
                                            </div>
                                            <span className="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg ring-2 ring-white dark:ring-slate-900">
                                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                            </span>
                                        </div>

                                        <div className="flex-1 text-center sm:text-right">
                                            <p className="text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">نوشته‌شده توسط</p>
                                            <h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{authorName}</h3>
                                            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                                                نویسنده و عضو تیم پالوده؛ علاقه‌مند به تکنولوژی، طراحی و اشتراک‌گذاری دانش با زبانی ساده و صمیمی.
                                            </p>

                                            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                                                <Link
                                                    href="/articles"
                                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110"
                                                >
                                                    همه‌ی نوشته‌ها
                                                    <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                                </Link>
                                                <div className="flex gap-2">
                                                    {['Twitter', 'GitHub', 'Telegram'].map((s) => (
                                                        <a key={s} href="#" aria-label={s} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:text-slate-400 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        {/* Comments Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mx-auto mt-16 max-w-3xl"
                        >
                            <div className="mb-8 flex items-center gap-4">
                                <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent dark:from-white/10" />
                                <h2 className="flex items-center gap-2 text-2xl font-black text-slate-900 dark:text-white">
                                    <svg className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                    نظرات
                                </h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
                            </div>

                            <Comments
                                articleId={safeArticle.id}
                                comments={comments || []}
                                allowComments={allowComments ?? true}
                            />
                            {console.log('🔍 Article ID:', safeArticle.id)}
                        </motion.section>
                    </article>
                </div>
            </div>
        </PublicLayout>
    );
}