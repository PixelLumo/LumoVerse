@php
    $displayTitle = auth()->check() 
        ? "Welcome, " . auth()->user()->name 
        : "Welcome to PixelLumo";
@endphp
<x-app-layout 
    :title="auth()->check() ? 'Welcome, ' . auth()->user()->name : 'Welcome to PixelLumo'" 
    subtitle="Your ultimate gaming community hub">

    <script src="https://cdn.tailwindcss.com"></script>
    
    <div class="main-content max-w-6xl mx-auto py-20 px-6 space-y-24">

        {{-- Welcome Card --}}
        <div class="card p-8 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl animate-fadeIn">
            <h1 class="glow pink-text text-4xl sm:text-5xl font-bold mb-6">
                @auth 
                    Welcome back, {{ auth()->user()->name }}! 
                @else 
                    Welcome to PixelLumo! 
                @endauth
            </h1>
            <p class="text-xl text-white mb-6" style="padding: 10px;">
                You're now logged in. Here's your guide to the pixel-verse:
            </p>
            
            <x-features />
        </div>

        {{-- What We Offer --}}
        <section>
            <h2 class="glow pink-text text-4xl font-bold mb-20 text-center">What We Offer</h2>
            <x-highlights />
        </section>

        {{-- Action Cards --}}
        <section style="padding: 10px;">
            <h2 class="glow pink-text text-4xl font-bold mb-16 text-center" style="padding-bottom: 10px;">Quick Actions</h2>
            <x-quick-cards />
        </section>

        {{-- Tip of the Day --}}
        <section class="pt-12" style="padding-top: 40px;">
            <x-tip-of-the-day />
        </section>

    </div>
</x-app-layout>