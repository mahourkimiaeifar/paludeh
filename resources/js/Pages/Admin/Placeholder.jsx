import AdminLayout from '@/Layouts/AdminLayout';

export default function Placeholder({ title }) {
    return (
        <AdminLayout title={title}>
            <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03]">
                <div className="text-center">
                    <p className="text-4xl">🏗️</p>
                    <p className="mt-4 text-lg font-bold text-white">{title}</p>
                    <p className="mt-2 text-sm text-slate-400">این بخش به‌زودی ساخته میشه!</p>
                </div>
            </div>
        </AdminLayout>
    );
}