import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ThreeBackground from '@/Components/ThreeBackground';

const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />,
    articles: <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />,
    pages: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
    assets: <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />,
    settings: <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />,
};

export function Icon({ name, className = 'h-5 w-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
            {icons[name]}
        </svg>
    );
}

const nav = [
    { href: '/admin', label: 'داشبورد', icon: 'dashboard' },
    { href: '/admin/users', label: 'کاربران', icon: 'users' },
    { href: '/admin/articles', label: 'مقالات', icon: 'articles' },
    { href: '/admin/pages', label: 'صفحات', icon: 'pages' },
    { href: '/admin/assets', label: 'دارایی‌های سه‌بعدی', icon: 'assets' },
    { href: '/admin/settings', label: 'تنظیمات', icon: 'settings' },
];

export default function AdminLayout({ title, children }) {
    const [open, setOpen] = useState(false);
    const { url } = usePage();
    const auth = usePage().props.auth;

    const isActive = (href) => (href === '/admin' ? url === '/admin' : url.startsWith(href));

    return (
        <div className="relative min-h-screen bg-slate-950 text-white">
            <div className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950" aria-hidden="true" />
            <ThreeBackground density={0.5} />

            {/* Overlay موبایل */}
            {open && (
                <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
            )}

            {/* سایدبار (سمت راست چون RTL) */}
            <aside className={`fixed inset-y-0 right-0 z-40 flex w-72 transform flex-col border-l border-white/10 bg-slate-950/85 backdrop-blur-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>
                <div className="flex items-center justify-between p-6">
                    <Link href="/admin" className="bg-gradient-to-l from-cyan-300 to-blue-500 bg-clip-text text-2xl font-black text-transparent">
                        پالوده
                    </Link>
                    <button className="text-slate-400 hover:text-white md:hidden" onClick={() => setOpen(false)} aria-label="بستن منو">✕</button>
                </div>

                <nav className="flex-1 space-y-1 px-4" aria-label="منوی اصلی پنل">
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                                isActive(item.href)
                                    ? 'bg-gradient-to-l from-cyan-500/20 to-blue-600/20 font-bold text-cyan-300 shadow-inner'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <Icon name={item.icon} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="border-t border-white/10 p-4">
                    <div className="mb-3 px-2">
                        <p className="truncate text-sm font-bold text-white">{auth?.user?.name}</p>
                        <p className="truncate text-xs text-slate-500" dir="ltr">{auth?.user?.email}</p>
                    </div>
                    <button
                        onClick={() => router.post('/logout')}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-400 transition-all hover:bg-rose-500/10 hover:text-rose-300"
                    >
                        <Icon name="logout" />
                        خروج از حساب
                    </button>
                </div>
            </aside>

            {/* محتوای اصلی */}
            <div className="md:mr-72">
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <button className="text-slate-300 hover:text-white md:hidden" onClick={() => setOpen(true)} aria-label="باز کردن منو">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                        </button>
                        <h1 className="text-lg font-extrabold">{title}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {auth?.user?.roles?.map((role) => (
                            <span key={role} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                                {role}
                            </span>
                        ))}
                    </div>
                </header>

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}