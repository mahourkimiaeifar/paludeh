import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/AppLayout';

export default function About() {
  return (
    <AppLayout>
      <Head title="درباره ما - پالوده" />
      
      <section className="py-20 min-h-[60vh]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              درباره ما
            </h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                پالوده یک پروژه خلاقانه است که با هدف ترکیب هنر و تکنولوژی ایجاد شده است. 
                ما معتقدیم که وبسایت‌ها باید تجربه‌ای فراتر از نمایش ساده اطلاعات باشند.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                با استفاده از آخرین تکنولوژی‌های گرافیکی سه‌بعدی و طراحی مدرن، 
                تلاش می‌کنیم تا فضایی immersive و جذاب برای کاربران خلق کنیم.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-3">
                    ماموریت ما
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    ارائه تجربه‌ای نوین و خلاقانه در فضای وب با استفاده از تکنولوژی‌های پیشرفته
                  </p>
                </div>
                
                <div className="p-6 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">
                    چشم‌انداز ما
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    تبدیل شدن به پیشرو در زمینه طراحی وبسایت‌های تعاملی و سه‌بعدی
                  </p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                تیم ما متشکل از توسعه‌دهندگان، طراحان و خلاقانی است که عاشق خلق چیزهای جدید هستند. 
                ما همواره در حال یادگیری و بهبود هستیم تا بهترین تجربه را برای کاربران خود فراهم کنیم.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </AppLayout>
  );
}
