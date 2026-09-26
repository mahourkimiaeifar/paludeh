import { Link, router, usePage } from '@inertiajs/react';
import { useState, lazy, Suspense, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/Components/Logo';
import ThemeToggle from '@/Components/ThemeToggle';

const ThreeBackground = lazy(() => import('@/Components/ThreeBackground'));

export default function PublicLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { url } = usePage();
    const { props } = usePage();
    const auth = props.initialPage?.props?.auth || props.auth;
    const userMenuRef = useRef(null);
    const searchInputRef = useRef(null);
    const user = auth?.user;
    const isAdmin = user?.roles?.some((r) => ['super_admin', 'content_manager', 'support'].includes(r));

    const navItems = [
        { href: '/', label: 'خانه', exact: true },
        { href: '/articles', label: 'مقالات' },
        { href: '/about', label: 'درباره ما' },
        { href: '/contact', label: 'تماس' },
    ];

    const isActive = (item) => item.exact ? url === item.href : url.startsWith(item.href);

    // بستن dropdown user با کلیک بیرون
    useEffect(() => {
        const onClick = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    // Focus روی input جستجو وقتی باز میشه
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    // بستن search با Escape
    useEffect(() => {
        const onEscape = (e) => {
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }, []);

    // جلوگیری از اسکرول وقتی منو بازه
    useEffect(() => {
        if (mobileMenuOpen || searchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen, searchOpen]);

    return (
        <div className="relative min-h-screen text-slate-900 dark:text-slate-100">
            <div className="fixed inset-0 -z-30 bg-slate-50 dark:bg-slate-950" aria-hidden="true" />
            <Suspense fallback={null}>
                <ThreeBackground density={0.7} />
            </Suspense>
            <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-blue-100/40 via-cyan-50/30 to-indigo-100/40 dark:from-transparent dark:via-transparent dark:to-transparent" aria-hidden="true" />

            {/* Header */}
            <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
                <div className="mx-auto max-w-7xl">
                    <div className="relative flex items-center justify-between gap-3 rounded-2xl border border-white/40 bg-white/70 px-3 py-2.5 shadow-xl shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/30 sm:px-6 sm:py-3">
                        <div className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" aria-hidden="true" />

                        {/* Logo */}
                        <Link href="/" className="group flex shrink-0 items-center gap-2.5 sm:gap-3">
                            <Logo className="h-9 w-9 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 sm:h-10 sm:w-10" />
                            <span className="bg-gradient-to-l from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-lg font-black text-transparent dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-400 sm:text-xl">
                                پالوده
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden items-center gap-1 md:flex">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive(item) ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                    {isActive(item) && (
                                        <motion.span layoutId="nav-underline" className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {/* Search Button */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/60 text-slate-600 transition-all hover:border-cyan-500/40 hover:bg-white hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-400/40 dark:hover:bg-white/10 dark:hover:text-cyan-300 sm:h-10 sm:w-10"
                                aria-label="جستجو"
                            >
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>

                            {/* Admin Quick Actions - فقط دسکتاپ */}
                            {isAdmin && (
                                <Link
                                    href="/admin/articles/create"
                                    className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110 lg:flex lg:px-4 lg:text-sm"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span className="hidden xl:inline">مقاله جدید</span>
                                </Link>
                            )}

                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* User Dropdown */}
                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen((v) => !v)}
                                        className="group flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white/70 py-1 pr-1 pl-2 transition-all hover:border-cyan-500/40 hover:bg-white hover:shadow-lg hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/40 sm:gap-2.5 sm:pr-1.5 sm:pl-3"
                                    >
                                        <span className="hidden text-sm font-bold text-slate-700 dark:text-slate-200 sm:inline">
                                            {user.name}
                                        </span>
                                        <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md transition-transform group-hover:scale-105 sm:h-8 sm:w-8">
                                            {user.name.charAt(0)}
                                        </div>
                                        <svg
                                            className={`hidden h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:text-cyan-600 dark:text-slate-400 dark:group-hover:text-cyan-400 sm:block ${userMenuOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute left-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95"
                                            >
                                                <div className="border-b border-slate-200 p-4 dark:border-white/10">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                                                    <p className="truncate text-xs text-slate-500" dir="ltr">{user.email}</p>
                                                </div>
                                                <div className="p-2">
                                                    {isAdmin && (
                                                        <>
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
                                                            <Link
                                                                href="/admin/articles/create"
                                                                onClick={() => setUserMenuOpen(false)}
                                                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-cyan-500/10"
                                                            >
                                                                <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                </svg>
                                                                مقاله جدید
                                                            </Link>
                                                        </>
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : null}

                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-600 hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300 md:hidden"
                                aria-label="منو"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu - Fullscreen overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] overflow-y-auto border-l border-white/10 bg-white/95 backdrop-blur-2xl dark:bg-slate-950/95 md:hidden"
                        >
                            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-white/10">
                                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                                    <Logo className="h-9 w-9" />
                                    <span className="bg-gradient-to-l from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-lg font-black text-transparent dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-400">
                                        پالوده
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <nav className="p-4">
                                <div className="mb-4">
                                    <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">منو</p>
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive(item)
                                                    ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
                                                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>

                                {user && (
                                    <div className="border-t border-slate-200 pt-4 dark:border-white/10">
                                        <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">حساب کاربری</p>
                                        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/5">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                                                <p className="truncate text-xs text-slate-500" dir="ltr">{user.email}</p>
                                            </div>
                                        </div>

                                        {isAdmin && (
                                            <>
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
                                                    </svg>
                                                    پنل مدیریت
                                                </Link>
                                                <Link
                                                    href="/admin/articles/create"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                    مقاله جدید
                                                </Link>
                                            </>
                                        )}

                                        <button
                                            onClick={() => router.post('/logout')}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                            </svg>
                                            خروج از حساب
                                        </button>
                                    </div>
                                )}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            {/* Search Modal */}
            <AnimatePresence>
                {searchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSearchOpen(false)}
                            className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-x-3 top-4 z-[70] sm:inset-x-auto sm:left-1/2 sm:top-[15%] sm:w-full sm:max-w-2xl sm:-translate-x-1/2"
                        >
                            <div className="overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
                                <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-white/10 sm:px-5">
                                    <svg className="h-5 w-5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="جستجو در مقالات..."
                                        className="min-w-0 flex-1 bg-transparent py-3.5 text-base text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-slate-500 sm:py-4 sm:text-lg"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') setSearchOpen(false);
                                        }}
                                    />
                                    <button
                                        onClick={() => setSearchOpen(false)}
                                        className="flex-shrink-0 rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 sm:hidden"
                                    >
                                        بستن
                                    </button>
                                    <kbd className="hidden rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-500 sm:inline-block dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                                        ESC
                                    </kbd>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        برای جستجو شروع به تایپ کنید...
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {['هوش مصنوعی', 'پالوده', 'نرم افزار', 'خبر'].map((tag) => (
                                            <button
                                                key={tag}
                                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition-colors hover:border-cyan-500/40 hover:bg-cyan-50 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-cyan-400/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="mx-auto max-w-7xl px-3 py-12 sm:px-6 sm:py-16">{children}</main>

            {/* Footer - همون قبلی */}
            <footer className="relative mt-20 border-t border-slate-200/60 dark:border-white/10">
                <div className="pointer-events-none absolute inset-x-1/4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" aria-hidden="true" />
                <div className="mx-auto max-w-7xl px-6 py-20">
                    <div className="grid gap-12 lg:grid-cols-12">
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
                            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5 p-6 dark:border-white/10">
                                <h3 className="mb-2 text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">عضویت در خبرنامه</h3>
                                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">جدیدترین مقالات رو مستقیم تو ایمیلت بگیر. بدون اسپم!</p>
                                <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                                    <input type="email" dir="ltr" placeholder="your@email.com" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-500" />
                                    <button type="submit" className="flex-shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110">عضویت</button>
                                </form>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
                            <div>
                                <h3 className="mb-5 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">پالوده</h3>
                                <ul className="space-y-3">
                                    {navItems.map((item) => (
                                        <li key={item.href}>
                                            <Link href={item.href} className="group flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300">
                                                <span className="h-1 w-1 rounded-full bg-slate-300 transition-all group-hover:w-3 group-hover:bg-cyan-500 dark:bg-slate-600" />
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-5 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">منابع</h3>
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
                                <h3 className="mb-5 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">ارتباط</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="mailto:contact@paludeh.com" className="group flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                            ایمیل
                                        </a>
                                    </li>
                                    <li>
                                        <Link href="/contact" className="group flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>
                                            تماس با ما
                                        </Link>
                                    </li>
                                </ul>
                                <div className="mt-6 flex gap-2">
                                    {['Twitter', 'GitHub', 'Telegram'].map((s) => (
                                        <a key={s} href="#" aria-label={s} className="group flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/60 text-slate-500 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-cyan-400/40 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300">
                                            <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-8 dark:border-white/10 md:flex-row">
                        <p className="text-sm text-slate-500 dark:text-slate-500">© {new Date().getFullYear()} <span className="font-bold text-slate-700 dark:text-slate-300">پالوده</span> — ساخته شده با 💙 در ایران</p>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300"
                        >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
                            بازگشت به بالا
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}