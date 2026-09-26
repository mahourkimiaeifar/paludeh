import { Link, router, usePage } from '@inertiajs/react';
import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/Components/ThemeToggle';
import Clock from '@/Components/Clock';
import Logo from '@/Components/Logo';

const ThreeBackground = lazy(() => import('@/Components/ThreeBackground'));

// ═══════════════════════════════════════════
// ICON COMPONENT
// ═══════════════════════════════════════════
const Icon = ({ name, className = 'h-[18px] w-[18px]' }) => {
    const paths = {
        dashboard: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
        articles: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
        pages: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
        comments: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
        users: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
        contacts: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
        logs: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.5c0-.621.504-1.125 1.125-1.125h2.25C20.496 3.375 21 3.879 21 4.5v15.375c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.5z',
        cache: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
        backup: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
        settings: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.25 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z',
        assets: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
        logout: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
        menu: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
        close: 'M6 18L18 6M6 6l12 12',
        external: 'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25',
    };

    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
            <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
        </svg>
    );
};

// ═══════════════════════════════════════════
// SIDEBAR SECTIONS (با آمار)
// ═══════════════════════════════════════════
const getSidebarSections = (stats) => [
    {
        title: 'داشبورد',
        items: [
            { href: '/admin', label: 'نمای کلی', icon: 'dashboard', exact: true },
        ],
    },
    {
        title: 'مدیریت محتوا',
        items: [
            { href: '/admin/articles', label: 'مقالات', icon: 'articles' },
            { href: '/admin/pages', label: 'صفحات', icon: 'pages' },
            { 
                href: '/admin/comments', 
                label: 'کامنت‌ها', 
                icon: 'comments',
                badge: stats?.new_comments > 0 ? stats.new_comments : null,
                badgeColor: 'bg-amber-500',
            },
        ],
    },
    {
        title: 'کاربران و دسترسی',
        items: [
            { href: '/admin/users', label: 'مدیریت کاربران', icon: 'users' },
        ],
    },
    {
        title: 'ارتباطات',
        items: [
            { 
                href: '/admin/contacts', 
                label: 'پیام‌های تماس', 
                icon: 'contacts',
                badge: stats?.new_messages > 0 ? stats.new_messages : null,
                badgeColor: 'bg-cyan-500',
            },
        ],
    },
    {
        title: 'سیستم و مانیتورینگ',
        items: [
            { 
                href: '/admin/activity-logs', 
                label: 'لاگ‌های سیستم', 
                icon: 'logs',
                badge: stats?.today_logs > 0 ? stats.today_logs : null,
                badgeColor: 'bg-purple-500',
            },
            { 
                href: '/admin/cache', 
                label: 'مدیریت کش', 
                icon: 'cache',
                badge: stats?.cache_size,
                badgeColor: 'bg-emerald-500',
                isText: true,
            },
            { href: '/admin/backup', label: 'بکاپ‌گیری', icon: 'backup' },
            { href: '/admin/settings', label: 'تنظیمات', icon: 'settings' },
        ],
    },
    {
        title: 'رسانه و دارایی',
        items: [
            { href: '/admin/assets', label: 'دارایی‌های سه‌بعدی', icon: 'assets' },
        ],
    },
];

// ═══════════════════════════════════════════
// MAIN LAYOUT
// ═══════════════════════════════════════════
export default function AdminLayout({ title, children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { url, props } = usePage();
    const auth = props.initialPage?.props?.auth || props.auth;
    const adminStats = props.initialPage?.props?.admin_stats || props.admin_stats || {};

    // ساخت سایدبار با آمار زنده
    const sidebarSections = getSidebarSections(adminStats);

    const isActive = (href, exact = false) => {
        if (exact) return url === href;
        return url === href || url.startsWith(href + '/');
    };

    const handleLinkClick = () => {
        setMobileOpen(false);
    };

    return (
        <div className="relative min-h-screen text-slate-900 dark:text-white">
            {/* Background */}
            <div className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950" aria-hidden="true" />
            <Suspense fallback={null}>
                <ThreeBackground density={0.5} />
            </Suspense>

            {/* ═══ MOBILE BACKDROP ═══ */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileOpen(false)}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* ═══ SIDEBAR ═══ */}
            <aside
                className={`fixed top-0 z-40 h-screen w-72 shrink-0 border-r border-slate-200 bg-white/90 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 dark:border-white/10 dark:bg-slate-900/90 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
                        <Link href="/admin" className="flex items-center gap-3">
                            <Logo className="h-9 w-9" />
                            <div>
                                <h1 className="text-base font-black text-slate-900 dark:text-white">پالوده</h1>
                                <p className="text-[10px] font-medium text-slate-500">پنل مدیریت</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-white/5"
                        >
                            <Icon name="close" className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="sidebar-scroll flex-1 space-y-6 overflow-y-auto px-4 py-5">
                        {sidebarSections.map((section) => (
                            <div key={section.title}>
                                <p className="mb-2 flex items-center gap-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <span className="h-px flex-1 bg-slate-200/60 dark:bg-white/10" />
                                    <span className="shrink-0">{section.title}</span>
                                    <span className="h-px flex-1 bg-slate-200/60 dark:bg-white/10" />
                                </p>
                                <div className="mt-3 space-y-1">
                                    {section.items.map((item) => {
                                        const active = isActive(item.href, item.exact);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={handleLinkClick}
                                                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                                    active
                                                        ? 'bg-gradient-to-l from-cyan-500/15 to-blue-600/10 text-cyan-700 shadow-sm dark:from-cyan-500/20 dark:to-blue-600/15 dark:text-cyan-300'
                                                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                                                }`}
                                            >
                                                {active && (
                                                    <motion.span
                                                        layoutId="sidebar-active-indicator"
                                                        className="absolute right-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-cyan-500 to-blue-600"
                                                    />
                                                )}
                                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                                    active
                                                        ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300'
                                                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-700 dark:bg-white/5 dark:text-slate-400 dark:group-hover:bg-white/10 dark:group-hover:text-white'
                                                }`}>
                                                    <Icon name={item.icon} />
                                                </span>
                                                <span className="flex-1">{item.label}</span>
                                                
                                                {/* ✨ Badge */}
                                                {item.badge && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                        className={`flex h-5 min-w-[20px] items-center justify-center rounded-full ${item.badgeColor || 'bg-cyan-500'} px-1.5 text-[10px] font-bold text-white shadow-lg`}
                                                    >
                                                        {item.isText ? item.badge : (item.badge > 99 ? '99+' : item.badge)}
                                                    </motion.span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer - User Card */}
                    <div className="border-t border-slate-200 p-4 dark:border-white/10">
                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                                {auth?.user?.name?.charAt(0) || '?'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{auth?.user?.name}</p>
                                <p className="truncate text-xs text-slate-500" dir="ltr">{auth?.user?.email}</p>
                            </div>
                            <button
                                onClick={() => router.post('/logout')}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                                title="خروج"
                            >
                                <Icon name="logout" className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="lg:mr-72">
                {/* Header */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 lg:hidden"
                            aria-label="باز کردن منو"
                        >
                            <Icon name="menu" className="h-5 w-5" />
                        </button>
                        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">{title}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-cyan-500/40 hover:text-cyan-600 sm:flex dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300"
                        >
                            <Icon name="external" className="h-4 w-4" />
                            مشاهده سایت
                        </Link>
                        <div className="hidden lg:block">
                            <Clock />
                        </div>
                        <ThemeToggle />
                        {auth?.user?.roles?.map((role) => (
                            <span key={role} className="hidden rounded-full border border-cyan-500/30 bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700 md:inline dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200">
                                {role}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}