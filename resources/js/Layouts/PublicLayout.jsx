import { Link, router, usePage } from '@inertiajs/react';
import { useState, lazy, Suspense, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Logo from '@/Components/Logo';
import ThemeToggle from '@/Components/ThemeToggle';
import Clock from '@/Components/Clock';
import ContentGuard from '@/Components/ContentGuard';

const ThreeBackground = lazy(() => import('@/Components/ThreeBackground'));

export default function PublicLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { url, auth } = usePage();
    const userMenuRef = useRef(null);
    const user = auth?.user;
    const isAdmin = user?.roles?.some((r) => ['super_admin', 'content_manager', 'support'].includes(r));

    const navItems = [
        { href: '/', label: 'خانه', exact: true },
        { href: '/articles', label: 'مقالات' },
        { href: '/about', label: 'درباره ما' },
        { href: '/contact', label: 'تماس' },
    ];

    const isActive = (item) => item.exact ? url === item.href : url.startsWith(item.href);

    // بستن dropdown با کلیک بیرون
    useEffect(() => {
        const onClick = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    return (
        <div className="relative min-h-screen text-slate-900 dark:text-slate-100">
            {/* لایه ۱: پس‌زمینه کدر */}
            <div className="fixed inset-0 -z-30 bg-slate-50 dark:bg-slate-950" aria-hidden="true" />

            {/* لایه ۲: Three.js */}
            <Suspense fallback={null}>
                <ThreeBackground density={0.3} />
            </Suspense>

            {/* لایه ۳: Gradient overlay */}
            <div
                className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-blue-100/40 via-cyan-50/30 to-indigo-100/40 dark:from-transparent dark:via-transparent dark:to-transparent"
                aria-hidden="true"
            />

            {/* Floating Navbar */}
            <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="relative flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3 shadow-xl shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/30 sm:px-6">
                        {/* Glow خط بالا */}
                        <div className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" aria-hidden="true" />

                        {/* Logo */}
                        <Link href="/" className="group flex items-center gap-3">
                            <div className="relative">
                                <Logo className="h-10 w-10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                                <div className="absolute inset-0 -z-10 rounded-full bg-cyan-400/20 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                            <span className="bg-gradient-to-l from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-xl font-black text-transparent dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-400">
                                پالوده
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden items-center gap-1 md:flex">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive(item)
                                        ? 'text-cyan-700 dark:text-cyan-300'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                    {isActive(item) && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                                        />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <div className="hidden lg:block">
                                <Clock />
                            </div>
                            <ThemeToggle />

                            {/* User Menu */}
                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen((v) => !v)}
                                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 py-1.5 pr-1.5 pl-3 transition-all hover:border-cyan-500/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/40"
                                    >
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute left-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95">
                                            <div className="border-b border-slate-200 p-4 dark:border-white/10">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                                                <p className="truncate text-xs text-slate-500" dir="ltr">{user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                {isAdmin && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-cyan-500/10"
                                                    >
                                                        <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                                        </svg>
                                                        پنل مدیریت
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => router.post('/logout')}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                                    </svg>
                                                    خروج از حساب
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="rounded-xl border border-slate-200 bg-white/70 p-2.5 text-slate-600 hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300 md:hidden"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mx-auto mt-2 max-w-7xl md:hidden">
                        <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/90 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/90">
                            <nav className="p-3">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive(item)
                                            ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
                                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                {user ? (
                                    <>
                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-cyan-700 hover:bg-cyan-500/10 dark:text-cyan-300"
                                            >
                                                پنل مدیریت
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => router.post('/logout')}
                                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-300"
                                        >
                                            خروج از حساب
                                        </button>
                                    </>
                                ) : null}
                            </nav>
                        </div>
                    </div>
                )}
            </header>

            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">{children}</main>
            <ContentGuard />
            {/* Premium Footer */}
            <footer className="relative mt-20 border-t border-slate-200/60 dark:border-white/10">
                <div className="pointer-events-none absolute inset-x-1/4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" aria-hidden="true" />

                <div className="mx-auto max-w-7xl px-6 py-20">
                    {/* Top Grid */}
                    <div className="grid gap-12 lg:grid-cols-12">
                        {/* Brand - بزرگتر */}
                        <div className="lg:col-span-5">
                            <Link href="/" className="mb-6 flex items-center gap-3">
                                <Logo className="h-12 w-12" />
                                <span className="bg-gradient-to-l from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-2xl font-black text-transparent dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-400">
                                    پالوده
                                </span>
                            </Link>
                            <p className="mb-8 max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                                جایی که دانش، طراحی و تکنولوژی به هم می‌رسن تا تجربه‌ای مدرن از وب رو بسازن.
                            </p>

                            {/* Newsletter */}
                            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5 p-6 dark:border-white/10">
                                <h3 className="mb-2 text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                    عضویت در خبرنامه
                                </h3>
                                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                                    جدیدترین مقالات رو مستقیم تو ایمیلت بگیر. بدون اسپم، قول میدیم!
                                </p>
                                <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                                    <input
                                        type="email"
                                        dir="ltr"
                                        placeholder="your@email.com"
                                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-500"
                                    />
                                    <button
                                        type="submit"
                                        className="flex-shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110"
                                    >
                                        عضویت
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Navigation columns */}
                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
                            <div>
                                <h3 className="mb-5 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                    پالوده
                                </h3>
                                <ul className="space-y-3">
                                    {navItems.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="group flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
                                            >
                                                <span className="h-1 w-1 rounded-full bg-slate-300 transition-all group-hover:w-3 group-hover:bg-cyan-500 dark:bg-slate-600" />
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-5 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                    منابع
                                </h3>
                                <ul className="space-y-3">
                                    {['مستندات', 'آموزش‌ها', 'راهنمای شروع', 'سوالات متداول'].map((item) => (
                                        <li key={item}>
                                            <a href="#" className="group flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300">
                                                <span className="h-1 w-1 rounded-full bg-slate-300 transition-all group-hover:w-3 group-hover:bg-cyan-500 dark:bg-slate-600" />
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-5 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                    ارتباط
                                </h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="group flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                            ایمیل
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/contact" className="group flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                            </svg>
                                            تماس با ما
                                        </a>
                                    </li>
                                </ul>

                                {/* Socials */}
                                <div className="mt-6 flex gap-2">
                                    {[
                                        { name: 'Twitter', path: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                                        { name: 'GitHub', path: 'M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z' },
                                        { name: 'Telegram', path: 'M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' },
                                    ].map((s) => (
                                        <a
                                            key={s.name}
                                            href="#"
                                            aria-label={s.name}
                                            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/60 text-slate-500 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-cyan-400/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
                                        >
                                            <svg className="h-4 w-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                                                <path d={s.path} />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-8 dark:border-white/10 md:flex-row">
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                            © {new Date().getFullYear()} <span className="font-bold text-slate-700 dark:text-slate-300">پالوده</span> — ساخته شده با 💙 در ایران
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-500">
                            <a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-300">حریم خصوصی</a>
                            <a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-300">شرایط استفاده</a>
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300"
                            >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                                </svg>
                                بازگشت به بالا
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}