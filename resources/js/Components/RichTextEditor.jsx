import { useEffect, useRef, useState } from 'react';

const CDN_URL = 'https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js';

let ckPromise = null;
function loadCKEditor() {
    if (window.ClassicEditor) return Promise.resolve(window.ClassicEditor);
    if (ckPromise) return ckPromise;
    ckPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = CDN_URL;
        s.async = true;
        s.onload = () => resolve(window.ClassicEditor);
        s.onerror = () => reject(new Error('load-failed'));
        document.head.appendChild(s);
    });
    return ckPromise;
}

export default function RichTextEditor({ value, onChange, placeholder }) {
    const boxRef = useRef(null);
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let dead = false;

        loadCKEditor()
            .then((ClassicEditor) => {
                if (dead || !boxRef.current) return;
                return ClassicEditor.create(boxRef.current, {
                    initialData: value || '',
                    language: 'fa',
                    placeholder: placeholder || 'محتوا رو اینجا بنویس...',
                }).then((editor) => {
                    if (dead) { editor.destroy(); return; }
                    editorRef.current = editor;
                    editor.model.document.on('change:data', () => onChange(editor.getData()));
                    setLoading(false);
                });
            })
            .catch(() => { if (!dead) { setFailed(true); setLoading(false); } });

        return () => {
            dead = true;
            editorRef.current?.destroy();
            editorRef.current = null;
        };
    }, []);

    if (failed) {
        return (
            <textarea
                rows="12"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/70 p-4 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                placeholder="ویرایشگر لود نشد؛ می‌تونی خام بنویسی (HTML)"
            />
        );
    }

    return (
        <div className="relative">
            {loading && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-10 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                    در حال بارگذاری ویرایشگر...
                </div>
            )}
            <div ref={boxRef} className={`${loading ? 'hidden' : ''} min-h-[400px]`} />
        </div>
    );
}