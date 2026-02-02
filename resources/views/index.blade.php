<x-app-layout title="Welcome to PixelLumo">

    {{-- Hero Section --}}
    <div class="hero-box flex flex-col items-start md:items-center px-6 sm:px-12 md:px-16 py-24 md:py-32 gap-8">
        <h1 class="glow pink-text text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
            You’re more than a username.
        </h1>
        <p class="text-lg sm:text-xl md:text-2xl text-white/90 max-w-4xl">
            PixelLumo is a quieter social space for real identity, not noise.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 w-full max-w-lg">
            <a href="{{ route('login') }}" class="btn-primary w-full sm:w-auto px-6 py-3 text-lg text-center">Join PixelLumo</a>
            <a href="{{ route('guest-home') }}" class="btn-secondary w-full sm:w-auto px-6 py-3 text-lg text-center">Explore the Vibe</a>
            <a href="{{ route('suggestions') }}" class="btn-outline w-full sm:w-auto px-6 py-3 text-lg text-center
                bg-linear-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500">
                Share Your Ideas
            </a>
        </div>
    </div>

    {{-- Main Sections --}}
    <section class="flex flex-col space-y-16 px-4 sm:px-8 md:px-12 my-20">

        {{-- Origin Story --}}
        <div class="block w-full max-w-4xl bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80
                    border border-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 class="font-bold text-3xl sm:text-4xl mb-6 mt-12 text-white inline-block" style="padding-top: 20px;">🌟 Origin Story</h3>
            <p class="text-white/90 mb-4 text-lg sm:text-xl">
                PixelLumo was created to fill a gap on the internet. Most platforms push creators to fit into a mold, prioritizing algorithms over authenticity, trends over identity, and noise over meaning. PixelLumo does the opposite. It is a space where creativity, expression, and community come first.
            </p>
            <p class="text-white/90 text-lg sm:text-xl">
                A digital home where you can create, share, talk, and belong, bringing together art, conversation, learning, and competition in one evolving space.
            </p>
        </div>

        {{-- Values --}}
        <div class="block w-full max-w-4xl bg-gradient-to-tr from-gray-900/70 via-gray-800/60 to-gray-900/70
                    border border-white/10 ring-1 ring-white/5 p-10 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 class="font-bold text-3xl sm:text-4xl mb-8 mt-12 text-white inline-block" style="padding-top: 20px;">🌈 Values</h3>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white/90 text-lg list-none p-0">
                    <li>
                        <span class="underline decoration-yellow-400 underline-offset-4 text-yellow-300">Creativity</span>:
                        Everyone is an <span class="text-yellow-300">artist, thinker, builder</span>.
                    </li>

                    <li>
                        <span class="underline decoration-rose-400 underline-offset-4 text-rose-300">Identity</span>:
                        <span class="font-semibold italic text-rose-300">Be yourself</span>, always.
                    </li>

                    <li>
                        <span class="underline decoration-emerald-400 underline-offset-4 text-emerald-300">Community</span>:
                        <span class="text-emerald-300">Support, share, grow together</span>.
                    </li>

                    <li>
                        <span class="underline decoration-sky-400 underline-offset-4 text-sky-300">Freedom</span>:
                        <span class="italic text-sky-300">Express, explore, and experiment without fear</span>.
                    </li>

                    <li>
                        <span class="underline decoration-fuchsia-400 underline-offset-4 text-fuchsia-300">Respect</span>:
                        <span class="font-semibold text-fuchsia-300">Kindness and inclusion</span> are at our core.
                    </li>
                </ul>
        </div>
    </section>

    <footer class="w-full bg-gray-900/90 py-16 px-6 sm:px-12 flex flex-col md:flex-row justify-between gap-12">
        
        <div class="max-w-md">
            <h3 class="font-bold text-3xl sm:text-4xl text-white mb-4 mt-12" style="padding-top: 20px;">👤 Who PixelLumo Is For</h3>
            <p class="text-white/90 text-lg mb-4">
                Gamers, artists, creators, and anyone who wants to belong. People tired of being just a number or a trend. Those who want to share, learn, and connect in a positive space.
            </p>
            <p class="text-white/90 text-lg font-semibold">
                Not for: Anyone looking to spam, troll, or bring negativity. Those who don't value creativity, kindness, or community.
            </p>
        </div>

        <div class="max-w-md flex flex-col justify-center">
            <h3 class="font-bold text-3xl sm:text-4xl text-white mb-4" style="padding-top: 20px;">Ready to join the fun?</h3>
            <p class="text-white/90 text-lg mb-6">
                Create your account and start sharing your creations today.
            </p>
            <a href="{{ route('register') }}" class="btn-primary w-full sm:w-auto px-8 py-3 text-lg text-center">Sign Up Free</a>
        </div>

    </footer>

</x-app-layout>
