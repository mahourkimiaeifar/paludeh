import GuestLayout from '@/Layouts/GuestLayout';
import { useForm, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const status = usePage().props.status;

    const submit = (e) => {
        e.preventDefault();
        post(window.location.pathname);
    };

    return (
        <GuestLayout>
            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">رمزت یادت رفته؟</h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">اشکالی نداره، برای همه پیش میاد! ایمیلت رو بنویس تا لینک بازیابی بفرستیم 💙</p>
                </motion.div>

                <AnimatePresence>
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            role="status"
                            className="rounded-2xl border border-green-400/25 bg-green-500/10 p-4 text-sm leading-6 text-green-200 backdrop-blur-sm"
                        >
                            {status}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={submit} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">ایمیل</label>
                        <input
                            id="email"
                            type="email"
                            dir="ltr"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full rounded-xl border px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 ${errors.email
                                    ? 'border-rose-300/40 bg-rose-400/10 focus:border-rose-300/60 focus:ring-rose-300/20'
                                    : 'border-slate-200 dark:border-white/10 bg-white/5 focus:border-cyan-400/60 focus:bg-white/10 focus:ring-cyan-400/25'
                                }`}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && <p className="mt-1.5 text-xs leading-5 text-rose-200/90">{errors.email}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-slate-900 dark:text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-400/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                    >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
                        {processing ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    <Link href="/login" className="font-medium text-cyan-300 transition-colors hover:text-cyan-200">برگشت به صفحه‌ی ورود</Link>
                </p>
            </div>
        </GuestLayout>
    );
}