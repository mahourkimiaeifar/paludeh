import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Show({ page }) {
    const safePage = page ?? {};
    const title = String(safePage.meta_title || safePage.title || 'صفحه');
    const description = String(safePage.meta_description || '');

    return (
        <PublicLayout>
            <Head title={`${title} | پالوده`}>
                {description && <meta name="description" content={description} />}
            </Head>

            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-4xl"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mb-12 text-5xl font-black leading-tight text-slate-900 dark:text-white md:text-6xl"
                >
                    {safePage.title || 'بدون عنوان'}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: safePage.content || '' }}
                />
            </motion.article>
        </PublicLayout>
    );
}