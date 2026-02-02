<x-app-layout 
title="About | PixelLumo">
<div class="relative w-full min-h-screen overflow-hidden bg-linear-to-b from-black via-purple-900/20 to-black">

    <div class="absolute top-0 left-10 text-2xl animate-bounce opacity-20">✨</div>
    <div class="absolute top-32 right-20 text-3xl animate-bounce delay-200 opacity-20">💫</div>
    <div class="absolute bottom-20 left-1/4 text-2xl animate-bounce delay-400 opacity-20">🌟</div>

    <section class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 text-center text-white">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-pink-400 animate-fade-in">
            About PixelLumo
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-white/80 mt-4 animate-fade-in delay-300">
            Your playground, your gallery, your community. Not a page, an experience.
        </p>
    </section>

    <section class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 text-white">

        <div class="text-center animate-fade-in">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-pink-400 mb-4">🌌 The Story of PixelLumo</h2>
            <p class="text-base sm:text-lg md:text-xl opacity-80">
                A journey of pixels, creativity, and a community built by a gamer, a football fan, a movie lover... Lumo.
            </p>
        </div>

        <div class="space-y-4 sm:space-y-6 animate-slide-in-left text-white/90 text-sm sm:text-base">
            <p>Hi, I’m Lumo. Okay, so maybe you’re curious how all of this came to be, or maybe you’re just here for the pixels. Either way, I’ll share the story, hope it makes sense, and maybe even convince you to jump in and join the fun.</p>
            <p>Gaming, movies, football, and creating things have always been a huge part of my life. Multiplayer gaming in particular. But the internet felt limiting. Platforms pushed trends, numbers, and algorithms over authenticity. I wanted something different.</p>
            <p>PixelLumo began as a small spark, a personal experiment to build a space where people could create, share, and belong. A website that wasn’t just a hub for content, but a home for ideas, creations, and conversation.</p>
        </div>

        <div class="space-y-4 sm:space-y-6 animate-slide-in-right text-white/90 text-sm sm:text-base">
            <p>One late night while streaming a match and watching movies at the same time, the idea hit me. Combine all the things I love. Gaming, creating, tutorials, community events, all in one living, breathing platform.</p>
            <p>Every detail mattered because every user would matter. Building PixelLumo wasn’t instant. There were long nights coding features, designing pages, and testing interactions, <span class="italic text-purple-400">sipping coffee with my cat on my lap while writing this</span>. Some ideas worked, some failed, but every step shaped the platform into what it is today. Each decision was guided by one principle. The community comes first.</p>
            <p>I wanted to create a space where your creativity could thrive, where your identity was respected, and where fun, growth, and connection were the foundation of everything.</p>
        </div>

        <div class="space-y-4 sm:space-y-6 animate-slide-in-left text-white/90 text-sm sm:text-base">
            <p>Today, PixelLumo is more than just a website. It’s a platform to share tutorials, join competitions, collaborate with friends, or just enjoy discovering new content. The story isn’t finished. It’s being written every day by everyone who uses it.</p>
            <p>My vision is simple. A space that grows with its users. Your ideas, suggestions, and creations shape what comes next. Every post, guide, and shared tip adds to the living story of PixelLumo.</p>
        </div>

        <div class="space-y-4 text-center animate-fade-in">
            <p class="text-base sm:text-lg md:text-xl opacity-90">
                Now, I invite you to join. Create. Explore. Connect. Whether you’re a gamer, movie fan, football enthusiast, or just curious, you belong here. PixelLumo isn’t complete without your voice, your contributions, and your spark.
            </p>
            <a href="{{ route('suggestions') }}"
               class="w-full sm:w-auto inline-block px-6 sm:px-8 py-3 bg-yellow-400 hover:bg-yellow-500 rounded-lg font-semibold transition-all animate-pulse">
                Share Your Idea
            </a>
        </div>

    </section>

    <section class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-24">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 xl:hidden">
            @foreach($blocks as $block)
                <div class="p-4 sm:p-6 rounded-xl shadow-lg backdrop-blur-md bg-white/10 animate-fade-in hover:scale-[1.02] transition-transform">
                    <div class="text-2xl sm:text-3xl mb-2">{{ $block['icon'] }}</div>
                    <h3 class="text-lg sm:text-xl font-bold text-white mb-1">{{ $block['title'] }}</h3>
                    <p class="opacity-90 text-sm sm:text-base leading-relaxed">{{ $block['text'] }}</p>
                </div>
            @endforeach
        </div>

        <div class="relative hidden xl:block min-h-212.5">
            @foreach($floatingBlocks as $block)
                <div
                    class="draggable absolute rounded-xl shadow-lg cursor-move animate-fade-in hover:scale-105 transition-transform bob backdrop-blur-md bg-white/10"
                    style="
                        top: {{ $block['top'] }};
                        left: {{ $block['left'] }};
                        width: {{ $block['size'] }};
                        transform: rotate({{ $block['rotate'] }});
                        animation-delay: {{ $block['delay'] }}ms;
                        padding: 1.5rem;
                    "
                >
                    <div class="text-3xl sm:text-3xl mb-2">{{ $block['icon'] }}</div>
                    <h3 class="text-lg sm:text-xl font-bold text-white mb-1">{{ $block['title'] }}</h3>
                    <p class="opacity-90 text-sm sm:text-base leading-relaxed">{{ $block['text'] }}</p>
                </div>
            @endforeach
        </div>
    </section>

    <section class="relative z-10 max-w-5xl mx-auto p-4 sm:p-6 rounded-xl shadow-lg text-white backdrop-blur-md bg-white/10 mb-12 sm:mb-24">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4">🔮 Roadmap & Your Voice</h2>
        <p class="opacity-90 mb-4 text-sm sm:text-base">
            We’re building PixelLumo with you. Every suggestion, vote, and creation shapes what comes next.
        </p>
        <ul class="list-disc list-inside space-y-2 opacity-90 mb-6 text-sm sm:text-base">
            <li>New community features driven by your feedback</li>
            <li>Expanded gaming tools and collaboration spaces</li>
            <li>Creative challenges, competitions, and showcases</li>
            <li>More customization and personalization options</li>
        </ul>
        <a href="{{ route('suggestions') }}"
           class="w-full sm:w-auto inline-block px-6 sm:px-8 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold transition-all">
            Help Shape PixelLumo
        </a>
    </section>

</div>
</x-app-layout>
