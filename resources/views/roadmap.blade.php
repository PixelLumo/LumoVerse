<x-app-layout title="Roadmap | PixelLumo">

    <div class="hero-box p-12 text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold flex items-center justify-center gap-2">
            <span class="emoji">🚀</span>
            <span class="glow-title pink-text">Roadmap</span>
        </h1>

        <p class="mt-4 text-lg md:text-xl opacity-80 animate-fade-in">
            See what's coming next and help shape PixelLumo's future! 🌟
        </p>
    </div>

    @php
        $features = [
            '🎨 Real-time collaborative art boards – create together with your squad!',
            '📱 Mobile app – take PixelLumo wherever you go.',
            '🛒 Marketplace for digital goods – sell and trade your creations.',
            '🏅 More achievements and badges – show off your skills and creativity.',
            '🎉 Community events & contests – compete, win, and have fun!',
        ];

        $spotlightIndex = rand(0, count($features) - 1);
        $spotlightFeature = $features[$spotlightIndex];
    @endphp

    <div class="page-flair max-w-3xl mx-auto space-y-8 px-4 sm:px-0">
        <div class="bg-purple-700/80 p-6 rounded-2xl shadow-2xl animate-bounce hover:animate-none transition-all duration-500 text-center">
            <h2 class="text-3xl font-bold mb-2 text-yellow-400">🌟 Feature of the Day</h2>
            <p class="text-white/90 text-lg md:text-xl font-semibold">{{ $spotlightFeature }}</p>
            <p class="mt-2 text-white/70 italic text-sm">This one’s extra exciting today… go check it out! ✨</p>
        </div>

        <div class="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500">
            <h2 class="text-2xl font-bold mb-4 text-pink-400 flex items-center gap-2">🎯 Planned Features</h2>
            <ul class="list-disc pl-6 text-white/90 space-y-2">
                @foreach($features as $index => $feature)
                    @if($index !== $spotlightIndex)
                        <li>{{ $feature }}</li>
                    @endif
                @endforeach
            </ul>
        </div>

        <div class="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500">
            <h2 class="text-2xl font-bold mb-2 text-yellow-400 flex items-center gap-2">🗳️ User Voting</h2>
            <p class="text-white/90 mb-4">
                Vote on what you want to see next! Jump into the discussion and help guide PixelLumo's future.
                <a href="{{ route('squad') }}" class="text-yellow-400 font-semibold hover:underline">Join the conversation</a>.
            </p>
            <div class="text-center">
                <a href="{{ route('suggestions') }}"
                   class="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105">
                   💡 Add Your Suggestion
                </a>
            </div>
        </div>

        <div class="text-center text-white/80 mt-6 animate-bounce">
            🚀 Every idea counts! Help shape the next big thing in PixelLumo! ✨
        </div>
    </div>

</x-app-layout>
