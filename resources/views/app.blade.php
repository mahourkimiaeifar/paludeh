<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>پالوده</title>
    <script>
        (function () {
            if ((localStorage.getItem('theme') || 'dark') === 'dark') {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>
    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>