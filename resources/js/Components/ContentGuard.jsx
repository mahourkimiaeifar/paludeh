import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function ContentGuard() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const watermarkText = user ? `${user.name} • ${user.email}` : 'پالوده';
    const [devToolsOpen, setDevToolsOpen] = useState(false);

    useEffect(() => {
        // ۱. راست کلیک
        const preventContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', preventContextMenu);

        // ۲. کلیدهای میانبر خطرناک
        const preventKeys = (e) => {
            // F12
            if (e.key === 'F12') { e.preventDefault(); return false; }
            // Ctrl+Shift+I / J / C (DevTools)
            if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
                e.preventDefault(); return false;
            }
            // Ctrl+U (view source)
            if (e.ctrlKey && e.key.toUpperCase() === 'U') {
                e.preventDefault(); return false;
            }
            // Ctrl+S (save)
            if (e.ctrlKey && e.key.toUpperCase() === 'S') {
                e.preventDefault(); return false;
            }
            // Ctrl+P (print)
            if (e.ctrlKey && e.key.toUpperCase() === 'P') {
                e.preventDefault(); return false;
            }
            // Ctrl+A (select all) - فقط در input ها مجاز
            if (e.ctrlKey && e.key.toUpperCase() === 'A') {
                const tag = e.target.tagName;
                if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !e.target.isContentEditable) {
                    e.preventDefault(); return false;
                }
            }
            // Ctrl+C - فقط در input ها
            if (e.ctrlKey && e.key.toUpperCase() === 'C') {
                const tag = e.target.tagName;
                if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !e.target.isContentEditable) {
                    e.preventDefault(); return false;
                }
            }
        };
        document.addEventListener('keydown', preventKeys);

        // ۳. Drag تصاویر
        const preventDrag = (e) => {
            if (e.target.tagName === 'IMG') e.preventDefault();
        };
        document.addEventListener('dragstart', preventDrag);

        // ۴. تشخیص DevTools (با مقایسه window.outer vs inner)
        const checkDevTools = () => {
            const threshold = 160;
            const widthDiff = window.outerWidth - window.innerWidth > threshold;
            const heightDiff = window.outerHeight - window.innerHeight > threshold;
            setDevToolsOpen(widthDiff || heightDiff);
        };
        const devToolsInterval = setInterval(checkDevTools, 1000);

        // ۵. تشخیص اسکرین‌شات احتمالی (visibility change سریع)
        const handleVisibility = () => {
            if (document.hidden) {
                // میتونیم لاگ بفرستیم به سرور
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // ۶. پاک کردن کنسول هر چند ثانیه (برای جلوگیری از paste در کنسول)
        const consoleClear = setInterval(() => {
            try {
                console.clear();
            } catch {}
        }, 2000);

        // پیام هشدار در کنسول
        console.log('%c⚠️ توقف!', 'color: red; font-size: 40px; font-weight: bold;');
        console.log('%cاین یک قابلیت مرورگر برای توسعه‌دهندگان است.', 'font-size: 16px;');
        console.log('%cاگر کسی به شما گفته اینجا چیزی paste کنید، احتمالاً کلاهبرداری است.', 'font-size: 16px; color: orange;');

        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
            document.removeEventListener('keydown', preventKeys);
            document.removeEventListener('dragstart', preventDrag);
            document.removeEventListener('visibilitychange', handleVisibility);
            clearInterval(devToolsInterval);
            clearInterval(consoleClear);
        };
    }, []);

    return (
        <>
            {/* Watermark قابل ردیابی */}
            <div
                className="pointer-events-none fixed inset-0 z-[100] overflow-hidden opacity-[0.04] dark:opacity-[0.03]"
                aria-hidden="true"
                style={{ mixBlendMode: 'multiply' }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            -45deg,
                            transparent,
                            transparent 120px,
                            rgba(6,182,212,0.3) 120px,
                            rgba(6,182,212,0.3) 121px
                        )`,
                    }}
                />
                <div
                    className="absolute inset-0 flex flex-wrap items-center justify-center gap-12 p-8 text-xs font-bold text-cyan-600"
                    style={{
                        transform: 'rotate(-20deg) scale(1.5)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {Array.from({ length: 80 }).map((_, i) => (
                        <span key={i} className="select-none">{watermarkText}</span>
                    ))}
                </div>
            </div>

            {/* هشدار DevTools */}
            {devToolsOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl">
                    <div className="mx-4 max-w-md rounded-3xl border border-rose-500/30 bg-slate-900 p-8 text-center shadow-2xl shadow-rose-500/20">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20">
                                <svg className="h-8 w-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="mb-2 text-2xl font-black text-white">دسترسی محدود</h2>
                        <p className="text-slate-400">
                            ابزار توسعه‌دهنده تشخیص داده شد. برای حفظ امنیت محتوا، لطفاً آن را ببندید.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}