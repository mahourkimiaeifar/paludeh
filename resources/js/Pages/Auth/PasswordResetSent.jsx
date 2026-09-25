import GuestLayout from '@/Layouts/GuestLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PasswordResetSent() {
    const sentEmail = usePage().props.flash?.sent_email;
    const [sending, setSending] = useState(false);

    const resend = () => {
        if (!sentEmail) return;
        setSending(true);
        router.post('/forgot-password', { email: sentEmail }, {
            preserveScroll: true,
            onFinish: () => setSending(false),
        });
    };

    return (
        <GuestLayout>
            <div className="space-y-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20 backdrop-blur-sm"
                >
                    <svg className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
                    <h1 className="text-2xl font-extrabold text-white">ایمیل تو راهه! 📬</h1>
                    <p className="mt-4 leading-7 text-slate-400">
                        {sentEmail ? (
                            <>لینک بازیابی رمز رو به <span className="font-bold text-cyan-300" dir="ltr">{sentEmail}</span> فرستادیم.</>
                        ) : (
                            <>لینک بازیابی رمز رو به ایمیلت فرستادیم.</>
                        )}
                        <br />
                        صندوق ورودی رو چک کن و روی دکمه‌ی ایمیل کلیک کن.
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                        ایمیل رو نمی‌بینی؟ پوشه‌ی Spam رو هم یه نگاه بنداز! لینک فقط ۶۰ دقیقه اعتبار داره ⏳
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="space-y-3">
                    <button
                        onClick={resend}
                        disabled={sending}
                        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-400/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                    >
                        {sending ? 'در حال ارسال دوباره...' : 'ارسال دوباره‌ی ایمیل'}
                    </button>

                    <Link
                        href="/login"
                        className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-slate-300 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-200"
                    >
                        برگشت به صفحه‌ی ورود
                    </Link>
                </motion.div>
            </div>
        </GuestLayout>
    );
}