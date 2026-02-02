<x-app-layout 
title="Tutorials | PixelLumo">

    <div class="hero-box p-12 text-center">
        <h1 class="glow pink-text text-5xl md:text-6xl font-bold">Tutorials & Guides</h1>
        <p class="mt-4 text-lg md:text-xl opacity-80">Learn tips, tricks, and techniques from the community.</p>
    </div>

    @php
        $featuredTutorials = [
            [
                'title' => 'How to Build an Epic Minecraft Base (Without It Looking Like a Box)',
                'description' => 'A step-by-step walkthrough with real examples, common mistakes, and easy upgrades you can flex later.',
                'tags' => ['🎥 Video', '🏅 Badge'],
                'cta' => 'Watch & Build'
            ],
            [
                'title' => 'Rocket League: From Zero to “I Meant to Do That”',
                'description' => 'Learn the few mechanics that actually matter before you embarrass yourself in ranked.',
                'tags' => ['🚗 Beginner', '⚡ Fast'],
                'cta' => 'Start Training'
            ],
            [
                'title' => 'Minecraft Redstone: Nerd Mode Activated',
                'description' => 'Understand logic, automate farms, and build things that make friends suspicious.',
                'tags' => ['⚙️ Advanced', '🧠 Brain Required'],
                'cta' => 'Enter Redstone'
            ],
        ];

        $featured = $featuredTutorials[array_rand($featuredTutorials)];

        $headlineFlair = [
            '🔥 Featured Right Now',
            '✨ Recommended for You',
            '📈 Popular Today',
            '🎯 Worth Your Time'
        ];
    @endphp

    <main class="max-w-6xl mx-auto my-8 space-y-12">
        <section class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 relative overflow-hidden">

            <div class="mb-8">
                <h2 class="text-3xl md:text-4xl font-extrabold mb-2">
                    🎓 Learn Something New Today
                </h2>
                <p class="text-white/80 max-w-2xl">
                    You don’t need to be a pro already. Start messy, learn fast, and steal smart ideas from people who’ve already failed before you.
                </p>
            </div>

            <div class="mb-8">
                <div class="bg-gray-800/80 border border-white/10 p-6 rounded-xl hover:scale-[1.02] transition-all duration-300">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xl font-bold">{{ $headlineFlair[array_rand($headlineFlair)] }}</h3>
                        <span class="px-3 py-1 bg-purple-600/90 rounded-full text-sm text-white">Picked for you</span>
                    </div>

                    <h4 class="font-bold text-white text-lg mb-1">{{ $featured['title'] }}</h4>
                    <p class="text-white/80 mb-4">{{ $featured['description'] }}</p>

                    <div class="flex items-center justify-between flex-wrap gap-3">
                        <div class="flex gap-2">
                            @foreach($featured['tags'] as $tag)
                                <span class="px-2 py-1 bg-gray-700 rounded text-white text-sm">{{ $tag }}</span>
                            @endforeach
                        </div>
                        <a href="{{ route('tutorials') }}" class="btn-primary px-5 py-2">{{ $featured['cta'] }} →</a>
                    </div>
                </div>
            </div>

            <div>
                <h3 class="text-xl font-semibold mb-4">🧭 Pick Your Path</h3>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="card p-5 bg-gray-800/80 border border-white/10 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                        <h4 class="font-bold text-white mb-2">🚗 Rocket League: From Zero to “I Meant to Do That”</h4>
                        <ul class="list-disc list-inside text-white/80 text-sm space-y-1">
                            <li>Set up the game properly</li>
                            <li>Survive the tutorial</li>
                            <li>Learn the 3 moves that actually matter</li>
                            <li>Queue your first real match</li>
                        </ul>
                        <span class="inline-block mt-3 px-3 py-1 bg-green-600 rounded-full text-white text-sm">Beginner Friendly</span>
                    </div>
                    <div class="card p-5 bg-gray-800/80 border border-white/10 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                        <h4 class="font-bold text-white mb-2">⚙️ Minecraft Redstone: Nerd Mode Activated</h4>
                        <ul class="list-disc list-inside text-white/80 text-sm space-y-1">
                            <li>Redstone logic (explained simply)</li>
                            <li>Build a clean piston door</li>
                            <li>Automate something useful</li>
                            <li>Hide it all in a secret base</li>
                        </ul>
                        <span class="inline-block mt-3 px-3 py-1 bg-yellow-600 rounded-full text-white text-sm">Advanced / Brain Required</span>
                    </div>
                </div>
            </div>

            <div class="mt-8 text-center">
                <p class="text-white/70 mb-3">New guides drop as the community grows. Yours could be next.</p>
                <a href="{{ route('tutorials') }}" class="btn-primary inline-block px-6 py-2">Explore All Tutorials →</a>
            </div>

        </section>

        <section class="mb-10">
            <h3 class="text-2xl font-bold mb-4 text-purple-400 flex items-center gap-2">🧠 Community Tutorials <span class="text-sm opacity-70">(Built by players)</span></h3>

            @if(isset($tutorials) && $tutorials->count())
                <div class="space-y-4">
                    @foreach($tutorials as $tutorial)
                        <a href="{{ route('tutorials.show', $tutorial) }}" class="block group bg-gray-800/70 border border-white/10 p-5 rounded-xl hover:border-purple-500/50 transition-all duration-300">
                            <div class="flex items-center justify-between mb-1">
                                <h4 class="font-bold text-white group-hover:text-purple-400 transition">{{ $tutorial->title }}</h4>
                                <span class="text-xs text-white/60">{{ $tutorial->created_at->diffForHumans() }}</span>
                            </div>
                            <p class="text-white/70 text-sm mb-2">{{ Str::limit($tutorial->description, 90) }}</p>
                            <div class="flex items-center justify-between text-xs text-white/60">
                                <span>By {{ $tutorial->user->name }}</span>
                                <span class="group-hover:translate-x-1 transition">Read →</span>
                            </div>
                        </a>
                    @endforeach
                </div>
            @else
                <div class="bg-gray-800/60 border border-dashed border-white/20 p-6 rounded-xl text-center">
                    <h4 class="font-bold text-lg mb-2 text-white">No tutorials yet — that means opportunity 👀</h4>
                    <p class="text-white/70 mb-4">Be the first to share a guide, strategy, or walkthrough. Even short tips help someone.</p>
                    <a href="{{ route('tutorials.create') }}" class="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition">Create the First Tutorial</a>
                </div>
            @endif
        </section>

        <div class="bg-gray-800 p-6 rounded-xl shadow">
            <h3 class="text-xl font-semibold mb-4">Want to share your own tutorial?</h3>
            <form action="{{ route('tutorials.store') }}" method="POST" class="space-y-4">
                @csrf
                <div>
                    <label class="block mb-1 font-semibold" for="title">Tutorial Title</label>
                    <input id="title" name="title" type="text" class="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="Enter title" required>
                </div>
                <div>
                    <label class="block mb-1 font-semibold" for="description">Description</label>
                    <textarea id="description" name="description" class="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white" rows="3" placeholder="Enter description" required></textarea>
                </div>
                <div>
                    <label class="block mb-1 font-semibold" for="video">Video URL (optional)</label>
                    <input id="video" name="video" type="url" class="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="YouTube or other link">
                </div>
                <button type="submit" class="px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded font-bold text-white">Submit</button>
            </form>
        </div>

    </main>

</x-app-layout>
