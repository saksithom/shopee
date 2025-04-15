<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="@yield('meta_description', 'โปรโมทสินค้าจาก Shopee Affiliates')">
    <meta name="keywords" content="@yield('meta_keywords', 'Shopee, Affiliates, โปรโมทสินค้า')">
    <meta name="author" content="Your Name">
    <title>@yield('title', 'Shopee Affiliates')</title>
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="@yield('title', 'Shopee Affiliates')">
    <meta property="og:description" content="@yield('meta_description', 'โปรโมทสินค้าจาก Shopee Affiliates')">
    <meta property="og:image" content="@yield('meta_image', asset('images/logo.png'))">
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ url()->current() }}">
    <meta property="twitter:title" content="@yield('title', 'Shopee Affiliates')">
    <meta property="twitter:description" content="@yield('meta_description', 'โปรโมทสินค้าจาก Shopee Affiliates')">
    <meta property="twitter:image" content="@yield('meta_image', asset('images/logo.png'))">
    <!-- Styles -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body class="frontend">
    @include('layouts.header')
    <div class="container pt-4">
        @yield('content')
    </div>
    @include('layouts.footer')
    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    @yield('scripts')

</body>
</html>