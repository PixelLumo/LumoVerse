@extends('layouts.app')

@section('title', 'Support | PixelLumo')

@section('content')
<div class="hero-box p-12 text-center">
    <h1 class="text-5xl md:text-6xl font-extrabold glow-title pink-text animate-pulse flex justify-center items-center gap-3">
        💬 <span>Support</span>
    </h1>
    <p class="mt-4 text-lg md:text-xl opacity-80 animate-fade-in">
        Got questions, problems, or epic ideas? We’re all ears! 🌟
    </p>
</div>

<main class="page-flair max-w-2xl mx-auto mt-8">
    <section class="bg-gray-800 p-6 rounded-xl shadow space-y-6 animate-fade-in-up">
        <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            🧩 Need Help? Let’s Solve It!
        </h2>
        <p class="text-white/90">
            Whether you hit a bug, have a question, or just want to suggest a crazy idea, this is your place to be heard. Don’t hold back! 🚀
        </p>


        <div class="max-w-xl mx-auto relative">
            @if(session('success'))
                <div id="support-toast" class="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg opacity-0 transform translate-y-10 transition-all duration-500 animate-bounce">
                    {{ session('success') }}
                </div>
            @endif

            <form action="{{ route('support.send') }}" method="POST" class="bg-gray-800 p-6 rounded-xl shadow space-y-4">
                @csrf
                <input type="text" name="name" placeholder="Your Name" required class="w-full p-3 rounded bg-gray-700 text-white">
                <input type="email" name="email" placeholder="Your Email" required class="w-full p-3 rounded bg-gray-700 text-white">
                <textarea name="message" placeholder="Your Message" required class="w-full p-3 rounded bg-gray-700 text-white h-32"></textarea>
                <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded transition">Send Message</button>
            </form>
        </div>

        <p class="text-white/70 mt-4 text-sm italic">
            We’ll get back to you faster than you can say “PixelLumo rocks!” ⚡
        </p>

        <script>
        document.addEventListener('DOMContentLoaded', () => {
            const toast = document.getElementById('support-toast');
            if (toast) {
                // Show toast
                toast.classList.remove('opacity-0', 'translate-y-10');
                toast.classList.add('opacity-100', 'translate-y-0');

                // Hide after 4 seconds
                setTimeout(() => {
                    toast.classList.remove('opacity-100', 'translate-y-0');
                    toast.classList.add('opacity-0', 'translate-y-10');
                }, 4000);
            }
        });
        </script>
    </section>
</main>
@endsection
