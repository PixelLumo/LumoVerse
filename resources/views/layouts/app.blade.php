<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Pixellumo')</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>

<body>

    <!-- Layout wrapper -->
    <div class="layout-wrapper">

        <!-- Header -->
        <x-header />

        <!-- Sidebar/Menu -->
        <x-menu />

        <!-- Main content -->
        <div class="layout-wrapper">
            <main class="main-content">
                @yield('content')
            </main>
        </div>  

        <!-- Footer -->
        <x-footer />

        <x-particles />
    </div>

    @stack('scripts')
</body>
</html>
