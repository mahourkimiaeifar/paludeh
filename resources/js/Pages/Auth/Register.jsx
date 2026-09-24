import GuestLayout from '@/Layouts/GuestLayout';
import { useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const stagger = {
    hidden: { opacity: 0, y: 16 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.08, duration: 0.45, ease: 'easeOut' } }),
};

const inputClass = (hasError) =>
    `w-full rounded-xl border px-4 py-3 text-white placeholder-slate-500 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 ${
        hasError
            ? 'border-rose-300/40 bg-rose-400/10 focus:border-rose-300/60 focus:ring-rose-300/20'
            : 'border-white/10 bg-white/5 focus:border-cyan-400/60 focus:bg-white/10 focus:ring-cyan-400/25'
    }`;

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        website_url: '', // honeypot
    });
    const [showPassword, setShowPassword] = useState(false);
    const hasErrors = Object.keys(errors).length > 0;

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <GuestLayout>
            <div className="space-y-6">
                <motion.div custom={0} variants={stagger} initial="hidden" animate="show" className="text-center">
                    <h1 className="text-2xl font-extrabold text-white">ساخت حساب</h1>
                    <p className="mt-2 text-sm text-slate-400">به پالوده خوش اومدی!</p>
                </motion.div>

                <AnimatePresence>
                    {hasErrors && (
                        <motion.div
                            key="error-banner"
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            role="alert"
                            className="flex items-start gap-3 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 backdrop-blur-sm"
                        >
                            <span className="mt-0.5 text-lg" aria-hidden="true">🤍</span>
                            <div className="text-sm leading-6 text-rose-100">
                                <p className="font-semibold text-rose-200">چند تا مورد کوچیک!</p>
                                <p>اشکالی نداره، موارد پایین رو درست کن و دوباره امتحان کن.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={submit} className="space-y-4" noValidate>
                    {/* Honeypot - invisible to humans */}
                    <input
                        type="text"
                        name="website_url"
                        value={data.website_url}
                        onChange={(e) => setData('website_url', e.target.value)}
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                    />

                    <motion.div custom={1} variants={stagger} initial="hidden" animate="show">
                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">نام کامل</label>
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            placeholder="نام شما"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={inputClass(!!errors.name)}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        {errors.name && (
                            <p id="name-error" className="mt-1.5 text-xs leading-5 text-rose-200/90">{errors.name}</p>
                        )}
                    </motion.div>

                    <motion.div custom={2} variants={stagger} initial="hidden" animate="show">
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">ایمیل</label>
                        <input
                            id="email"
                            type="email"
                            dir="ltr"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={inputClass(!!errors.email)}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                            <p id="email-error" className="mt-1.5 text-xs leading-5 text-rose-200/90">{errors.email}</p>
                        )}
                    </motion.div>

                    <motion.div custom={3} variants={stagger} initial="hidden" animate="show">
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">رمز عبور</label>
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
                                aria-describedby={errors.password ? 'password-error' : undefined}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-cyan-300"
                                aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5s8.577 3.01 9.963 7.178c.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5S3.423 16.49 2.036 12.322z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p id="password-error" className="mt-1.5 text-xs leading-5 text-rose-200/90">{errors.password}</p>
                        )}
                    </motion.div>

                    <motion.div custom={4} variants={stagger} initial="hidden" animate="show">
                        <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium text-slate-300">تکرار رمز عبور</label>
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
                            aria-describedby={errors.password_confirmation ? 'password_confirmation-error' : undefined}
                        />
                        {errors.password_confirmation && (
                            <p id="password_confirmation-error" className="mt-1.5 text-xs leading-5 text-rose-200/90">{errors.password_confirmation}</p>
                        )}
                    </motion.div>

                    <motion.div custom={5} variants={stagger} initial="hidden" animate="show">
                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-400/40 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                        >
                            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
                            {processing ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                        </button>
                    </motion.div>
                </form>

                <motion.p custom={6} variants={stagger} initial="hidden" animate="show" className="text-center text-sm text-slate-400">
                    حساب داری؟{' '}
                    <Link href="/login" className="font-medium text-cyan-300 transition-colors hover:text-cyan-200">وارد شو</Link>
                </motion.p>
            </div>
        </GuestLayout>
    );
}