<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>تایید ایمیل</title>
</head>
<body style="font-family: Tahoma, Arial, sans-serif; background-color: #f0f9ff; padding: 40px 20px; margin: 0;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <h1 style="color: #0891b2; margin-bottom: 20px;">سلام {{ $user->name }}! 💙</h1>
        <p style="color: #334155; line-height: 1.8; font-size: 16px;">
            به پالوده خوش اومدی! برای فعال‌سازی حسابت، لطفاً روی دکمه زیر کلیک کن:
        </p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $url }}" style="background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                تایید ایمیل من
            </a>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            اگه دکمه بالا کار نکرد، این لینک رو تو مرورگرت کپی کن:<br>
            <span style="color: #0891b2; word-break: break-all;">{{ $url }}</span>
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            این ایمیل به صورت خودکار ارسال شده. اگه درخواست ثبت‌نام ندادی، این ایمیل رو نادیده بگیر.
        </p>
    </div>
</body>
</html>