<x-app-layout title="🛡️ Terms of Service | PixelLumo">

    <div class="hero-box p-12 text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold glow-title pink-text animate-pulse flex items-center justify-center gap-3">
            <span class="text-[3.5rem]">🛡️</span>
            <span>Terms of Service</span>
        </h1>
        <p class="mt-4 text-lg md:text-xl opacity-80 animate-fade-in">
            Keep your account safe and enjoy everything PixelLumo has to offer! 💫
        </p>
    </div>

    <main>
        <div class="page-flair max-w-2xl mx-auto space-y-6">
            <h2 class="text-2xl font-bold mb-2 text-purple-400 animate-fade-in">📜 Our Terms at a Glance</h2>
            <p class="text-white/80 mb-4 animate-fade-in">
                These rules help everyone have a fun, safe, and creative experience. Think of them as a guide to PixelLumo’s world!
            </p>

            <ul class="text-left text-white/90 list-disc pl-6 space-y-3">
                <li class="animate-fade-in delay-100">✨ <strong>Follow the rules:</strong> Respect our <a href="{{ route('rules') }}" class="text-yellow-400 underline">Community Rules</a>.</li>
                <li class="animate-fade-in delay-200">⚖️ <strong>Legal boundaries:</strong> Don’t use PixelLumo for anything illegal or shady.</li>
                <li class="animate-fade-in delay-300">🚫 <strong>Account safety:</strong> We may suspend accounts for violations — play fair!</li>
                <li class="animate-fade-in delay-400">🔒 <strong>Privacy matters:</strong> Check our <a href="{{ route('privacy') }}" class="text-yellow-400 underline">Privacy Policy</a> to see how we handle your data.</li>
                <li class="animate-fade-in delay-500">💬 <strong>Need help?</strong> Contact <a href="{{ route('support') }}" class="text-yellow-400 underline">Support</a> for any questions.</li>
            </ul>

            <div class="mt-6 text-center animate-fade-in delay-600">
                <form action="{{ route('terms.accept') }}" method="POST">
                    @csrf
                    <button type="submit" class="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition shadow-lg hover:shadow-xl">
                        ✅ I Agree, Let’s Play!
                    </button>
                </form>
            </div>
        </div>
    </main>

</x-app-layout>
