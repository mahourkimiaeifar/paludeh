<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>پاسخ به پیام شما</title>
</head>
<body style="font-family: Tahoma, Arial, sans-serif; background-color: #f0f9ff; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px;">
        <h1 style="color: #0891b2;">سلام {{ $contact->name }}! 💙</h1>
        <p>پاسخ ما به پیام شما:</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
            {!! nl2br(e($reply)) !!}
        </div>
        <p style="color: #64748b; font-size: 14px;">
            با احترام،<br>تیم پالوده
        </p>
    </div>
</body>
</html>