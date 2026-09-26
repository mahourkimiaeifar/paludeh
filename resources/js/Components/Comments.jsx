import { useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function CommentItem({ comment, onReply, depth = 0, parentAuthor = null }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { auth } = usePage().props;
    const isOwnComment = auth?.user?.id && comment.user_id === auth.user.id;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
        >
            {/* ═══ Connector Line برای پاسخ‌ها ═══ */}
            {depth > 0 && (
                <div className="absolute right-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 via-blue-500/30 to-transparent sm:right-8" />
            )}

            <div className={`${depth > 0 ? 'mr-6 pr-4 sm:mr-10 sm:pr-6' : ''} relative`}>
                {/* ═══ Reply Indicator (بالای کامنت پاسخ) ═══ */}
                {depth > 0 && parentAuthor && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-2 flex items-center gap-2"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-300">
                            <svg className="h-3 w-3 rtl:scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            در پاسخ به <span className="font-bold text-cyan-600 dark:text-cyan-300">{parentAuthor}</span>
                        </span>
                    </motion.div>
                )}

                <div className={`relative rounded-2xl border p-5 backdrop-blur-xl transition-all hover:shadow-lg ${
                    comment.is_admin
                        ? 'border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 shadow-lg shadow-cyan-500/10'
                        : depth > 0
                        ? 'border-blue-200/50 bg-blue-50/50 dark:border-blue-400/20 dark:bg-blue-500/5'
                        : 'border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/[0.06]'
                }`}>
                    {/* ═══ Admin Badge ═══ */}
                    {comment.is_admin && (
                        <div className="absolute -top-2 right-4 flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-cyan-500/30">
                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                            نویسنده
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-3 flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white ${
                            comment.is_admin
                                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30'
                                : depth > 0
                                ? 'bg-gradient-to-br from-blue-400 to-indigo-500'
                                : 'bg-gradient-to-br from-slate-400 to-slate-500'
                        }`}>
                            {comment.author_initial}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`font-bold ${
                                    comment.is_admin 
                                        ? 'text-cyan-700 dark:text-cyan-300' 
                                        : 'text-slate-900 dark:text-white'
                                }`}>
                                    {comment.author_name}
                                </span>
                                {depth > 0 && !parentAuthor && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-300">
                                        <svg className="h-2.5 w-2.5 rtl:scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                        </svg>
                                        پاسخ
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-slate-500">{comment.created_at}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <p className="mb-3 break-words leading-relaxed text-slate-700 dark:text-slate-300" style={{ wordBreak: 'break-word' }}>
                        {comment.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onReply(comment.id, comment.author_name)}
                            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
                        >
                            <svg className="h-3.5 w-3.5 rtl:scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                            </svg>
                            پاسخ
                        </button>
                    </div>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {comment.replies.map((reply) => (
                            <CommentItem 
                                key={reply.id} 
                                comment={reply} 
                                onReply={onReply} 
                                depth={depth + 1}
                                parentAuthor={comment.author_name}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default function Comments({ articleId, comments, allowComments }) {
    const [replyTo, setReplyTo] = useState(null);
    const [replyToAuthor, setReplyToAuthor] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        parent_id: null,
        name: '',
        email: '',
    });

    const handleReply = (commentId, authorName) => {
        setReplyTo(commentId);
        setReplyToAuthor(authorName);
        setData('parent_id', commentId);
        document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/articles/${articleId}/comments`, {
            onSuccess: () => {
                reset();
                setReplyTo(null);
                setReplyToAuthor(null);
            },
        });
    };

    if (!allowComments) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-8 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
                <p className="text-slate-500">ثبت کامنت در حال حاضر غیرفعال است.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Comment Form */}
            <motion.div
                id="comment-form"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
            >
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                    <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                    </svg>
                    نظر خود را بنویسید
                </h3>

                <form onSubmit={submit} className="space-y-4">
                    {/* ═══ Reply Indicator با نام کاربر ═══ */}
                    <AnimatePresence>
                        {replyTo && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex items-center justify-between rounded-xl border border-cyan-400/30 bg-gradient-to-l from-cyan-500/10 to-blue-500/10 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                                            <svg className="h-3.5 w-3.5 rtl:scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">در حال پاسخ به:</p>
                                            <p className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{replyToAuthor}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { 
                                            setReplyTo(null); 
                                            setReplyToAuthor(null);
                                            setData('parent_id', null); 
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Guest Fields */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="نام شما"
                                className={`w-full rounded-xl border bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 backdrop-blur-xl transition-all focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white ${
                                    errors.name ? 'border-rose-400/60 focus:ring-rose-500/25' : 'border-slate-200 focus:border-cyan-500/60 focus:ring-cyan-500/25 dark:border-white/10'
                                }`}
                            />
                            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                        </div>
                        <div>
                            <input
                                type="email"
                                dir="ltr"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="ایمیل شما"
                                className={`w-full rounded-xl border bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 backdrop-blur-xl transition-all focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white ${
                                    errors.email ? 'border-rose-400/60 focus:ring-rose-500/25' : 'border-slate-200 focus:border-cyan-500/60 focus:ring-cyan-500/25 dark:border-white/10'
                                }`}
                            />
                            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <textarea
                            rows="4"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="نظر خود را بنویسید..."
                            className={`w-full rounded-xl border bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 backdrop-blur-xl transition-all focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white ${
                                errors.content ? 'border-rose-400/60 focus:ring-rose-500/25' : 'border-slate-200 focus:border-cyan-500/60 focus:ring-cyan-500/25 dark:border-white/10'
                            }`}
                        />
                        {errors.content && <p className="mt-1 text-xs text-rose-500">{errors.content}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-400/40 hover:brightness-110 disabled:opacity-60"
                    >
                        {processing ? (
                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 rtl:scale-x-[-1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        )}
                        {replyTo ? `ارسال پاسخ به ${replyToAuthor}` : 'ارسال کامنت'}
                    </button>
                </form>
            </motion.div>

            {/* Comments List */}
            <div className="space-y-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-sm font-bold text-cyan-600 dark:text-cyan-300">
                        {comments.length}
                    </span>
                    نظرات
                </h3>

                {comments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-white/10">
                        <p className="text-slate-500">هنوز کامنتی ثبت نشده. اولین نفر باشید! 💙</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} onReply={handleReply} depth={0} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}