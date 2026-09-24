<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head><meta charset="UTF-8"><title>بازیابی رمز</title></head>
<body style="font-family: Tahoma, Arial, sans-serif; background-color: #f0f9ff; padding: 40px 20px; margin: 0;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <h1 style="color: #0891b2; margin-bottom: 20px;">سلام {{ $user->name }}! 🔑</h1>
        <p style="color: #334155; line-height: 1.8; font-size: 16px;">
            درخواست بازیابی رمز عبور دادی. روی دکمه زیر کلیک کن و یه رمز جدید و قوی انتخاب کن:
        </p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $url }}" style="background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                تغییر رمز عبور
            </a>
        </div>
        <p style="color: #64748b; font-size: 14px;">این لینک فقط ۶۰ دقیقه اعتبار داره.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            اگه درخواست بازیابی ندادی، این ایمیل رو نادیده بگیر؛ رمزت امن می‌مونه 💙
        </p>
    </div>
</body>
</html>