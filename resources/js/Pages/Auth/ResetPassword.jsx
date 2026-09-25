import GuestLayout from '@/Layouts/GuestLayout';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const inputClass = (hasError) =>
    `w-full rounded-xl border px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 ${hasError
        ? 'border-rose-300/40 bg-rose-400/10 focus:border-rose-300/60 focus:ring-rose-300/20'
        : 'border-slate-200 dark:border-white/10 bg-white/5 focus:border-cyan-400/60 focus:bg-white/10 focus:ring-cyan-400/25'
    }`;

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <GuestLayout>
            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">رمز جدید بساز</h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">یه رمز قوی انتخاب کن؛ ترکیبی از حرف و عدد و علامت 💪</p>
                </motion.div>

                <form onSubmit={submit} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">رمز عبور جدید</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                dir="ltr"
                                autoComplete="new-password"
                                placeholder="حداقل ۸ کاراکتر"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`${inputClass(!!errors.password)} pl-12`}
                                aria-invalid={!!errors.password}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 transition-colors hover:text-cyan-300"
                                aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1.5 text-xs leading-5 text-rose-200/90">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">تکرار رمز جدید</label>
                        <input
                            id="password_confirmation"
                            type={showPassword ? 'text' : 'password'}
                            dir="ltr"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className={inputClass(!!errors.password_confirmation)}
                            aria-invalid={!!errors.password_confirmation}
                        />
                        {errors.password_confirmation && <p className="mt-1.5 text-xs leading-5 text-rose-200/90">{errors.password_confirmation}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-slate-900 dark:text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-400/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                    >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
                        {processing ? 'در حال ذخیره...' : 'ذخیره‌ی رمز جدید'}
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}