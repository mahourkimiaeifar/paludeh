<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="admin-path" content="{{ env('ADMIN_LOGIN_PATH', 'login') }}">
    <meta name="admin-path" content="{{ env('ADMIN_LOGIN_PATH', 'login') }}">
    <title inertia>پالوده</title>
    <link rel="icon" type="image/png" href="/logo.png">
    <link rel="apple-touch-icon" href="/logo.png">
    <script>
        (function () {
            if ((localStorage.getItem('theme') || 'dark') === 'dark') {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>
    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    <link rel="stylesheet" href="/ckeditor-custom.css">
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>