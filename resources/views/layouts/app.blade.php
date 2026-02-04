<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Pixellumo')</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>

<body>
    
    <x-header />

    <x-menu />

    <div >
        <main >
            @yield('content')
        </main>
    </div>

    <x-particles />

    <x-footer />

    @stack('scripts')

</body>
</html>
