import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/AppLayout';
import Swal from 'sweetalert2';
import { useEffect } from 'react';

export default function Contact() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    
    post('/contact', {
      onSuccess: () => {
        Swal.fire({
          title: 'پیام شما ارسال شد!',
          text: 'به زودی با شما تماس خواهیم گرفت.',
          icon: 'success',
          confirmButtonText: 'باشه',
          confirmButtonColor: '#3b82f6',
          background: '#1f2937',
          color: '#fff',
        });
        reset();
      },
      onError: () => {
        Swal.fire({
          title: 'خطا!',
          text: 'لطفاً تمام فیلدها را به درستی پر کنید.',
          icon: 'error',
          confirmButtonText: 'باشه',
          confirmButtonColor: '#ef4444',
          background: '#1f2937',
          color: '#fff',
        });
      },
    });
  };

  return (
    <AppLayout>
      <Head title="تماس با ما - پالوده" />
      
      <section className="py-20 min-h-[60vh]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              تماس با ما
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  اطلاعات تماس
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">آدرس</h3>
                      <p className="text-gray-600 dark:text-gray-300">تهران، خیابان خلاقیت، پلاک ۱</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📞</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">تلفن</h3>
                      <p className="text-gray-600 dark:text-gray-300">021-12345678</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">ایمیل</h3>
                      <p className="text-gray-600 dark:text-gray-300">info@paludeh.com</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <h3 className="text-lg font-semibold mb-2">ساعات کاری</h3>
                  <p className="opacity-90">شنبه تا چهارشنبه: ۹ صبح تا ۵ عصر</p>
                  <p className="opacity-90">پنجشنبه: ۹ صبح تا ۱ ظهر</p>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  فرم تماس
                </h2>
                
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.name 
                          ? 'border-red-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ایمیل
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.email 
                          ? 'border-red-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      موضوع
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={data.subject}
                      onChange={(e) => setData('subject', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.subject 
                          ? 'border-red-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      پیام
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={data.message}
                      onChange={(e) => setData('message', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.message 
                          ? 'border-red-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'در حال ارسال...' : 'ارسال پیام'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </AppLayout>
  );
}
