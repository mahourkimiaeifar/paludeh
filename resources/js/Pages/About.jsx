import PublicLayout from '@/Layouts/PublicLayout';
import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

const stats = [
    { value: '+۱۵۰', label: 'مقاله منتشرشده', icon: '📚' },
    { value: '+۵۰K', label: 'بازدید ماهانه', icon: '👁️' },
    { value: '+۱۰K', label: 'دنبال‌کننده', icon: '💙' },
    { value: '۹۸٪', label: 'رضایت کاربران', icon: '⭐' },
];

const values = [
    {
        title: 'کیفیت اول',
        description: 'هر محتوایی که منتشر می‌کنیم با دقت، تحقیق و عشق نوشته شده.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        title: 'شفافیت کامل',
        description: 'با مخاطبان صادقیم؛ هیچ چیز رو پنهان نمی‌کنیم.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        title: 'نوآوری مداوم',
        description: 'همیشه دنبال بهترین راه‌حل‌های مدرن و خلاقانه‌ایم.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
        ),
    },
    {
        title: 'جامعه‌محور',
        description: 'مخاطبان ما خانواده‌ی ما هستن و با هم رشد می‌کنیم.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
        ),
    },
];

const timeline = [
    { year: '۱۴۰۲', title: 'شروع مسیر', desc: 'پالوده با ایده‌ی به اشتراک‌گذاری دانش راه‌اندازی شد.' },
    { year: '۱۴۰۳', title: 'رشد جامعه', desc: 'جامعه‌ی ما به بیش از ۱۰ هزار عضو فعال رسید.' },
    { year: '۱۴۰۴', title: 'گسترش محتوا', desc: 'بیش از ۱۵۰ مقاله تخصصی منتشر کردیم.' },
    { year: '۱۴۰۵', title: 'آینده‌ای روشن', desc: 'در حال توسعه‌ی قابلیت‌های جدید و تجربه‌های نوین.' },
];

const team = [
    { name: 'مهدی رضایی', role: 'بنیان‌گذار و مدیر فنی', initial: 'م' },
    { name: 'سارا محمدی', role: 'سردبیر', initial: 'س' },
    { name: 'علی احمدی', role: 'طراح ارشد', initial: 'ع' },
];

export default function About() {
    return (
        <PublicLayout>
            <Head title="درباره ما | پالوده">
                <meta name="description" content="با پالوده، داستان، ارزش‌ها و تیم ما آشنا شوید" />
            </Head>

            <div className="mx-auto max-w-7xl">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative mb-24 overflow-hidden rounded-[3rem]"
                >
                    <div className="absolute -inset-1 rounded-[3rem] bg-gradient-to-tr from-cyan-500/60 via-blue-500/40 to-indigo-500/60 blur-2xl" aria-hidden="true" />
                    <div className="relative overflow-hidden rounded-[calc(3rem-1px)] bg-gradient-to-br from-white/90 via-cyan-50/60 to-blue-50/60 p-12 backdrop-blur-2xl dark:from-slate-900/90 dark:via-cyan-950/40 dark:to-blue-950/40 md:p-20">
                        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden="true" />
                        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" aria-hidden="true" />

                        <div className="relative max-w-3xl">
                            <motion.span
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-700 backdrop-blur-sm dark:text-cyan-300"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                                درباره ما
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.7 }}
                                className="mb-6 text-5xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white md:text-7xl"
                            >
                                ما داستان‌گویانِ{' '}
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-l from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-400">
                                        دیجیتال
                                    </span>
                                </span>
                                یم
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.7 }}
                                className="text-xl leading-relaxed text-slate-600 dark:text-slate-300 md:text-2xl"
                            >
                                پالوده یک پلتفرم مدرنه که با عشق ساخته شده تا دانش، تجربه و ایده‌ها رو با زبونی ساده و صمیمی به اشتراک بذاره. ما معتقدیم هر داستان، یه درس داره و هر درس، یه قدم به سمت بهتر شدن.
                            </motion.p>
                        </div>
                    </div>
                </motion.section>

                {/* Stats */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-24"
                >
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl transition-all hover:border-cyan-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-slate-900/60"
                            >
                                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-cyan-500/5 blur-2xl transition-all group-hover:bg-cyan-500/10" aria-hidden="true" />
                                <div className="relative">
                                    <div className="mb-3 text-3xl">{stat.icon}</div>
                                    <div className="mb-1 bg-gradient-to-l from-cyan-600 to-blue-600 bg-clip-text text-4xl font-black text-transparent dark:from-cyan-300 dark:to-blue-400">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Mission */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-24 grid gap-12 lg:grid-cols-2 lg:items-center"
                >
                    <div>
                        <span className="mb-3 inline-block text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                            مأموریت ما
                        </span>
                        <h2 className="mb-6 text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl">
                            ساده‌سازی پیچیدگی‌ها، با{' '}
                            <span className="bg-gradient-to-l from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-300 dark:to-blue-400">
                                زبان دل
                            </span>
                        </h2>
                        <p className="mb-4 text-lg leading-loose text-slate-600 dark:text-slate-300">
                            ما معتقدیم دانش باید برای همه قابل دسترس باشه. به همین خاطر، هر محتوایی که منتشر می‌کنیم رو با دقت و وسواس می‌نویسیم تا پیچیده‌ترین مفاهیم رو به زبونی ساده و قابل فهم تبدیل کنیم.
                        </p>
                        <p className="text-lg leading-loose text-slate-600 dark:text-slate-300">
                            هدف ما ایجاد جامعه‌ای از یادگیرندگان مشتاقه که با هم رشد می‌کنن، با هم یاد می‌گیرن و با هم آینده رو می‌سازن.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 blur-2xl" aria-hidden="true" />
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-10 backdrop-blur-xl dark:border-white/10">
                            <svg className="mb-6 h-12 w-12 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.33 1.509 2.316V18" />
                            </svg>
                            <blockquote className="text-2xl font-bold italic leading-relaxed text-slate-900 dark:text-white">
                                "دانش قدرت نیست، مگر وقتی که به اشتراک گذاشته بشه."
                            </blockquote>
                            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                — فلسفه‌ی پالوده
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Values */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-24"
                >
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-block text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                            ارزش‌های ما
                        </span>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
                            آنچه بهش باور داریم
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {values.map((value, i) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-8 backdrop-blur-xl transition-all hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-slate-900/60"
                            >
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 text-cyan-600 transition-transform group-hover:scale-110 dark:text-cyan-300">
                                    {value.icon}
                                </div>
                                <h3 className="mb-3 text-xl font-black text-slate-900 dark:text-white">
                                    {value.title}
                                </h3>
                                <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Timeline */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-24"
                >
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-block text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                            مسیر ما
                        </span>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
                            داستان پالوده
                        </h2>
                    </div>

                    <div className="relative">
                        {/* خط عمودی */}
                        <div className="absolute right-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-500 via-blue-500 to-indigo-500 md:block" aria-hidden="true" />

                        <div className="space-y-12">
                            {timeline.map((item, i) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className={`relative flex flex-col md:flex-row ${
                                        i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                                >
                                    {/* کارت */}
                                    <div className="mb-4 flex-1 md:mb-0 md:px-8">
                                        <div className={`rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                            <div className="mb-2 inline-flex rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-xs font-bold text-white">
                                                {item.year}
                                            </div>
                                            <h3 className="mb-2 text-xl font-black text-slate-900 dark:text-white">{item.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                                        </div>
                                    </div>

                                    {/* نقطه روی خط */}
                                    <div className="absolute right-1/2 top-6 hidden h-4 w-4 -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50 ring-4 ring-white md:block dark:ring-slate-950" aria-hidden="true" />

                                    {/* فضای خالی */}
                                    <div className="flex-1 md:px-8" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Team */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-24"
                >
                    <div className="mb-12 text-center">
                        <span className="mb-3 inline-block text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                            تیم ما
                        </span>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
                            آدم‌های پشت پالوده
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-8 text-center backdrop-blur-xl transition-all hover:border-cyan-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-slate-900/60"
                            >
                                <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-3xl font-black text-white shadow-xl shadow-cyan-500/30 ring-4 ring-white/50 transition-transform group-hover:scale-110 dark:ring-white/10">
                                    {member.initial}
                                </div>
                                <h3 className="mb-1 text-xl font-black text-slate-900 dark:text-white">{member.name}</h3>
                                <p className="text-sm text-cyan-600 dark:text-cyan-400">{member.role}</p>

                                <div className="mt-4 flex justify-center gap-2">
                                    {['twitter', 'github', 'telegram'].map((social) => (
                                        <a
                                            key={social}
                                            href="#"
                                            aria-label={social}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:hover:border-cyan-400/40 dark:hover:text-cyan-300"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl"
                >
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 blur-2xl" aria-hidden="true" />
                    <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 p-12 text-center md:p-16">
                        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
                        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

                        <div className="relative">
                            <h2 className="mb-4 text-3xl font-black text-white md:text-5xl">
                                بیا با هم بسازیم!
                            </h2>
                            <p className="mx-auto mb-8 max-w-2xl text-lg text-cyan-100 md:text-xl">
                                اگه سوالی داری، پیشنهادی داری یا می‌خوای باهامون همکاری کنی، خوشحال میشیم ازت بشنویم.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link
                                    href="/contact"
                                    className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-cyan-700 shadow-xl transition-all hover:shadow-2xl hover:brightness-110"
                                >
                                    تماس با ما
                                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                                <Link
                                    href="/articles"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                                >
                                    مشاهده مقالات
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </div>
        </PublicLayout>
    );
}