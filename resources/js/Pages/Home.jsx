import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Logo from '@/Components/Logo';
import HomeBackground from '@/Components/HomeBackground';
import ThemeToggle from '@/Components/ThemeToggle';
import Clock from '@/Components/Clock';

const navItems = [
    { href: '/', label: 'خانه', exact: true },
    { href: '/articles', label: 'مقالات' },
    { href: '/about', label: 'درباره ما' },
    { href: '/contact', label: 'تماس' },
];

const sections = [
    { id: 'hero', label: 'شروع', icon: '01' },
    { id: 'features', label: 'ویژگی‌ها', icon: '02' },
    { id: 'stats', label: 'آمار', icon: '03' },
    { id: 'cta', label: 'تماس', icon: '04' },
];

const features = [
    { icon: '📚', title: 'مقالات عمیق', desc: 'محتوایی که با دقت نوشته شده تا پیچیده‌ترین مفاهیم رو ساده کنه.', gradient: 'from-cyan-500 to-blue-600' },
    { icon: '🤖', title: 'هوش مصنوعی', desc: 'از جدیدترین تکنولوژی‌های هوش مصنوعی برای بهتر کردن تجربه‌ی شما.', gradient: 'from-purple-500 to-pink-600' },
    { icon: '👥', title: 'جامعه‌ی پویا', desc: 'با بیش از ۱۰ هزار عضو فعال، هم‌سفر یادگیری و رشد باشید.', gradient: 'from-emerald-500 to-teal-600' },
    { icon: '⚡', title: 'سرعت بالا', desc: 'با معماری مدرن و بهینه‌سازی شده، تجربه‌ای سریع و روان.', gradient: 'from-amber-500 to-orange-600' },
];

const stats = [
    { v: '+۱۵۰', l: 'مقاله' },
    { v: '+۵۰K', l: 'بازدید ماهانه' },
    { v: '+۱۰K', l: 'دنبال‌کننده' },
    { v: '۹۸٪', l: 'رضایت' },
];

export default function Home() {
    const containerRef = useRef(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [hoveredSection, setHoveredSection] = useState(null);
    const [scrollPercent, setScrollPercent] = useState(0);
    const userMenuRef = useRef(null);
    const searchInputRef = useRef(null);
    
    const { url, props } = usePage();
    const auth = props.initialPage?.props?.auth || props.auth;
    const user = auth?.user;
    const isAdmin = user?.roles?.some((r) => ['super_admin', 'content_manager', 'support'].includes(r));

    const isActive = (item) => item.exact ? url === item.href : url.startsWith(item.href);

    // ═══ Scroll tracking (بهینه‌شده با requestAnimationFrame) ═══
    useEffect(() => {
        let rafId = null;
        let lastScrollY = -1;

        const onScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (scrollY !== lastScrollY) {
                    lastScrollY = scrollY;
                    
                    // Progress percent
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                    setScrollPercent(maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0);
                    
                    // Active section
                    const scrollPos = scrollY + window.innerHeight / 2;
                    let current = 'hero';
                    sections.forEach((section) => {
                        const el = document.getElementById(section.id);
                        if (el && scrollPos >= el.offsetTop) {
                            current = section.id;
                        }
                    });
                    setActiveSection(current);
                }
                rafId = null;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    // ═══ Scroll to section (دقیق و روان) ═══
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const navbarOffset = 90; // فاصله از بالای صفحه
            const top = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    // Close dropdowns
    useEffect(() => {
        const onClick = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    useEffect(() => {
        if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
    }, [searchOpen]);

    useEffect(() => {
        const onEscape = (e) => {
            if (e.key === 'Escape') { setSearchOpen(false); setMobileMenuOpen(false); }
        };
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }, []);

    useEffect(() => {
        document.body.style.overflow = (mobileMenuOpen || searchOpen) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen, searchOpen]);

    return (
        <div ref={containerRef} className="relative bg-slate-950 text-white">
            <Head>
                <title>پالوده | سفری در عمق دانش</title>
                <meta name="description" content="پالوده، جایی که دانش و هوش مصنوعی به هم می‌رسن" />
            </Head>

            {/* Three.js Background */}
            <HomeBackground />

            {/* Dark overlay */}
            <div className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/80" />

            {/* ═══ NAVBAR ═══ */}
            <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
                <div className="mx-auto max-w-7xl">
                    <div className="relative flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2.5 shadow-xl shadow-black/30 backdrop-blur-2xl sm:px-6 sm:py-3">
                        <div className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" aria-hidden="true" />
                        <Link href="/" className="group flex shrink-0 items-center gap-2.5 sm:gap-3">
                            <Logo className="h-9 w-9 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 sm:h-10 sm:w-10" />
                            <span className="bg-gradient-to-l from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-lg font-black text-transparent sm:text-xl">پالوده</span>
                        </Link>
                        <nav className="hidden items-center gap-1 md:flex">
                            {navItems.map((item) => (
                                <Link key={item.href} href={item.href} className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive(item) ? 'text-cyan-300' : 'text-slate-300 hover:text-white'}`}>
                                    {item.label}
                                    {isActive(item) && <motion.span layoutId="nav-underline" className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button onClick={() => setSearchOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-cyan-400/40 hover:bg-white/10 hover:text-cyan-300 sm:h-10 sm:w-10" aria-label="جستجو">
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                            </button>
                            <div className="hidden lg:block"><Clock dark /></div>
                            <ThemeToggle />
                            {user && (
                                <div className="relative" ref={userMenuRef}>
                                    <button onClick={() => setUserMenuOpen((v) => !v)} className="group flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-1 pr-1 pl-2 transition-all hover:border-cyan-400/40 hover:bg-white/10 sm:gap-2.5 sm:pr-1.5 sm:pl-3">
                                        <span className="hidden text-sm font-bold text-slate-200 sm:inline">{user.name}</span>
                                        <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md transition-transform group-hover:scale-105 sm:h-8 sm:w-8">{user.name.charAt(0)}</div>
                                        <svg className={`hidden h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:text-cyan-300 sm:block ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                    </button>
                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} className="absolute left-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-xl shadow-black/40 backdrop-blur-2xl">
                                                <div className="border-b border-white/10 p-4">
                                                    <p className="text-sm font-bold text-white">{user.name}</p>
                                                    <p className="truncate text-xs text-slate-400" dir="ltr">{user.email}</p>
                                                </div>
                                                <div className="p-2">
                                                    {isAdmin && (
                                                        <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-cyan-500/10">
                                                            <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" /></svg>
                                                            پنل مدیریت
                                                        </Link>
                                                    )}
                                                    <button onClick={() => router.post('/logout')} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/10">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                                                        خروج از حساب
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300 md:hidden" aria-label="منو">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ═══ PROGRESS BAR ═══ */}
            <div className="fixed left-4 top-1/2 z-40 hidden h-48 w-1 -translate-y-1/2 rounded-full bg-white/10 lg:block">
                <div 
                    className="w-full rounded-full bg-gradient-to-b from-cyan-400 to-blue-500 transition-all duration-150 ease-out"
                    style={{ height: `${scrollPercent}%`, transformOrigin: 'top' }}
                />
            </div>

            {/* ═══ SECTION DOTS ═══ */}
            <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 lg:flex">
                <div className="absolute right-[15px] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    const isHovered = hoveredSection === section.id;
                    return (
                        <button key={section.id} onClick={() => scrollToSection(section.id)} onMouseEnter={() => setHoveredSection(section.id)} onMouseLeave={() => setHoveredSection(null)} className="group relative flex items-center justify-end py-3">
                            <AnimatePresence>
                                {(isActive || isHovered) && (
                                    <motion.div initial={{ opacity: 0, x: 10, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 10, scale: 0.9 }} className={`mr-4 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-xl transition-colors ${isActive ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/30' : 'border-white/10 bg-white/5 text-slate-300'}`}>
                                        <span className="font-mono opacity-60">{section.icon}</span>
                                        <span className="mx-2 text-white/20">|</span>
                                        {section.label}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="relative">
                                {isActive && (
                                    <motion.div layoutId="activeDotGlow" className="absolute inset-0 rounded-full bg-cyan-400 blur-md" initial={false} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                                )}
                                <div className={`relative h-[30px] w-[30px] rounded-full border-2 transition-all duration-300 flex items-center justify-center ${isActive ? 'border-cyan-400 bg-cyan-500/20' : 'border-white/30 bg-transparent group-hover:border-white/60'}`}>
                                    <motion.div layoutId="activeDot" className={`h-2 w-2 rounded-full transition-colors ${isActive ? 'bg-cyan-400' : 'bg-white/40 group-hover:bg-white/80'}`} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ═══ MOBILE MENU ═══ */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] overflow-y-auto border-l border-white/10 bg-slate-950/95 backdrop-blur-2xl md:hidden">
                            <div className="flex items-center justify-between border-b border-white/10 p-4">
                                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                                    <Logo className="h-9 w-9" />
                                    <span className="bg-gradient-to-l from-cyan-400 to-blue-500 bg-clip-text text-lg font-black text-transparent">پالوده</span>
                                </Link>
                                <button onClick={() => setMobileMenuOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <nav className="p-4">
                                {navItems.map((item) => (
                                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive(item) ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-300 hover:bg-white/5'}`}>{item.label}</Link>
                                ))}
                                {user && isAdmin && <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="mt-4 flex items-center gap-3 rounded-xl bg-cyan-500/10 px-3 py-3 text-sm font-medium text-cyan-300">پنل مدیریت</Link>}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ═══ SEARCH MODAL ═══ */}
            <AnimatePresence>
                {searchOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSearchOpen(false)} className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-x-3 top-4 z-[70] sm:inset-x-auto sm:left-1/2 sm:top-[15%] sm:w-full sm:max-w-2xl sm:-translate-x-1/2">
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl">
                                <div className="flex items-center gap-3 border-b border-white/10 px-4 sm:px-5">
                                    <svg className="h-5 w-5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                    <input ref={searchInputRef} type="text" placeholder="جستجو در مقالات..." className="min-w-0 flex-1 bg-transparent py-3.5 text-base text-white placeholder-slate-500 focus:outline-none sm:py-4 sm:text-lg" onKeyDown={(e) => { if (e.key === 'Escape') setSearchOpen(false); }} />
                                    <button onClick={() => setSearchOpen(false)} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-slate-400 hover:bg-white/10 sm:hidden">بستن</button>
                                    <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-400 sm:inline-block">ESC</kbd>
                                </div>
                                <div className="p-4 sm:p-5">
                                    <p className="text-sm text-slate-400">برای جستجو شروع به تایپ کنید...</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {['React', 'Laravel', 'Tailwind', 'JavaScript'].map((tag) => (
                                            <button key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300">{tag}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ═══ SECTION 1: HERO ═══ */}
            <section id="hero" className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
                <div className="text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
                        <div className="relative mx-auto mb-8 flex h-36 w-36 items-center justify-center">
                            <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500/40 blur-3xl" />
                            <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl ring-2 ring-white/20">
                                <Logo className="h-24 w-24" />
                            </div>
                        </div>
                        <motion.h1 className="mb-6 text-6xl font-black tracking-tight sm:text-8xl md:text-9xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}>
                            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">پالوده</span>
                        </motion.h1>
                        <motion.p className="mx-auto max-w-2xl text-xl text-slate-300 sm:text-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}>
                            سفری در عمق دانش و هوش مصنوعی
                        </motion.p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Link href="/articles" className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-bold shadow-2xl shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-cyan-400/70">
                            شروع سفر
                            <svg className="h-5 w-5 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
                        </Link>
                        <Link href="/contact" className="rounded-2xl border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-medium backdrop-blur-sm transition-all hover:border-cyan-400/50 hover:bg-white/10">تماس با ما</Link>
                    </motion.div>
                </div>
                <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 flex flex-col items-center gap-2 text-slate-400">
                    <span className="text-sm">اسکرول کنید تا به عمق برسید</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
                </motion.div>
            </section>

            {/* ═══ SECTION 2: FEATURES ═══ */}
            <section id="features" className="relative z-10 flex min-h-[85vh] flex-col justify-center px-6 pb-20 pt-32">
                <div className="mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8 }} className="mb-12 text-center">
                        <span className="mb-4 inline-block rounded-full border border-cyan-500/40 bg-cyan-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-sm">چرا پالوده؟</span>
                        <h2 className="text-4xl font-black sm:text-5xl">
                            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">تجربه‌ای متفاوت</span>
                        </h2>
                    </motion.div>
                    <div className="grid gap-5 md:grid-cols-2">
                        {features.map((f, i) => (
                            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="group relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900/80 p-7 backdrop-blur-xl transition-all hover:border-cyan-400/40 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-cyan-500/30">
                                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} text-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}>{f.icon}</div>
                                <h3 className="mb-2 text-xl font-bold">{f.title}</h3>
                                <p className="text-sm leading-relaxed text-slate-300">{f.desc}</p>
                                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl transition-all group-hover:bg-cyan-500/20" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 3: STATS ═══ */}
            <section id="stats" className="relative z-10 flex min-h-[70vh] flex-col justify-center px-6 pb-20 pt-24">
                <div className="mx-auto max-w-4xl text-center">
                    <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="mb-12 text-4xl font-black sm:text-5xl">
                        <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">پالوده در یک نگاه</span>
                    </motion.h2>
                    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                        {stats.map((s, i) => (
                            <motion.div key={s.l} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group rounded-2xl border border-white/15 bg-slate-900/80 p-6 backdrop-blur-xl transition-all hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/30">
                                <div className="mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">{s.v}</div>
                                <div className="text-xs text-slate-400">{s.l}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 4: CTA ═══ */}
            <section id="cta" className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 pb-20 pt-24">
                <div className="max-w-3xl text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}>
                        <div className="mb-6 flex justify-center">
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/60">
                                <Logo className="h-16 w-16" />
                            </div>
                        </div>
                        <h2 className="mb-5 text-4xl font-black sm:text-6xl">
                            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">با ما در تماس باشید</span>
                        </h2>
                        <p className="mb-8 text-lg text-slate-300 sm:text-xl">سوالی داری؟ پیشنهادی داری؟ یا می‌خوای باهامون همکاری کنی؟</p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link href="/contact" className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-bold shadow-2xl shadow-cyan-500/50 transition-all hover:scale-105">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                ارسال پیام
                            </Link>
                            <Link href="/articles" className="rounded-2xl border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-medium backdrop-blur-sm transition-all hover:border-cyan-400/50 hover:bg-white/10">مشاهده مقالات</Link>
                        </div>
                    </motion.div>
                </div>
                <div className="mt-12 text-center text-sm text-slate-500">© {new Date().getFullYear()} پالوده — ساخته شده با 💙</div>
            </section>
        </div>
    );
}