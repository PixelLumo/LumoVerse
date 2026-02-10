<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" 
        content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Pixellumo')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body>
    
    <x-header />

    <x-menu />  

    <div class="layout-wrapper">
        <main class="main-content">
            @yield('content')
        </main>
    </div>

    <x-particles />

    <x-footer />

    @stack('scripts')

</body>
</html>
