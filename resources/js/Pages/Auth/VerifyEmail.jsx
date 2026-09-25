import GuestLayout from '@/Layouts/GuestLayout';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function VerifyEmail() {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const resend = () => {
        setSending(true);
        router.post('/email/verification-notification', {}, {
            onSuccess: () => {
                setSent(true);
                setSending(false);
                setTimeout(() => setSent(false), 5000);
            },
            onError: () => setSending(false),
        });
    };

    return (
        <GuestLayout>
            <div className="space-y-6 text-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20 backdrop-blur-sm">
                        <svg className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">ایمیلت رو تایید کن</h1>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 leading-7">
                        یه لینک تایید به ایمیلت فرستادیم. <br />
                        لطفاً ایمیلت رو چک کن و روی لینک کلیک کن.
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                        (اگه ایمیل رو نمی‌بینی، پوشه‌ی spam رو هم چک کن!)
                    </p>
                </motion.div>

                {sent && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-green-400/30 bg-green-500/10 p-3 text-sm text-green-300">
                        لینک تایید دوباره ارسال شد! 💙
                    </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="space-y-3">
                    <button
                        onClick={resend}
                        disabled={sending}
                        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-slate-900 dark:text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-400/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                    >
                        {sending ? 'در حال ارسال...' : 'ارسال دوباره‌ی لینک تایید'}
                    </button>

                    <button
                        onClick={() => router.post('/logout')}
                        className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/5 py-3 text-sm text-slate-700 dark:text-slate-300 transition-all duration-300 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
                    >
                        خروج از حساب
                    </button>
                </motion.div>
            </div>
        </GuestLayout>
    );
}