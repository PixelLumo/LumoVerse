<x-app-layout title="👥 Squad | PixelLumo">

    <div class="hero-box p-12 text-center">
        <h1 class="glow pink-text text-5xl md:text-6xl font-bold">The Squad</h1>
        <p class="mt-4 text-lg md:text-xl opacity-80">Meet the people who make PixelLumo special.</p>
    </div>

    <main class="max-w-6xl mx-auto my-8 space-y-12">

        <section class="bg-gray-800 rounded-xl shadow p-6">
            <h2 class="text-3xl font-bold mb-2">🏆 Top</h2>
            <p class="text-white/90 mb-4">
                Motivation, status, and bragging rights. See who's leading the PixelLumo universe!
            </p>

            <h3 class="text-xl font-semibold mb-2">How to Earn Rewards & Climb the Ranks</h3>
            <ul class="list-disc list-inside mb-4 text-white/80">
                <li>Be active: chat, post, and participate in events.</li>
                <li>Get likes and favorites on your posts and art.</li>
                <li>Win tournaments and complete challenges.</li>
                <li>Support others and help the community grow.</li>
                <li>Top users earn badges, special roles, and exclusive rewards!</li>
            </ul>

            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 class="text-lg font-semibold mb-2">🔥 Most Active</h4>
                    <table class="w-full text-left text-white/90">
                        <thead>
                            <tr>
                                <th class="border-b border-white/20 pb-1">Rank</th>
                                <th class="border-b border-white/20 pb-1">Player</th>
                                <th class="border-b border-white/20 pb-1">Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>1</td><td>Lumo</td><td>245</td></tr>
                            <tr><td>2</td><td>PixelFan</td><td>201</td></tr>
                            <tr><td>3</td><td>ArtStar</td><td>188</td></tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-2">💖 Most Liked</h4>
                    <table class="w-full text-left text-white/90">
                        <thead>
                            <tr>
                                <th class="border-b border-white/20 pb-1">Rank</th>
                                <th class="border-b border-white/20 pb-1">Player</th>
                                <th class="border-b border-white/20 pb-1">Likes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>1</td><td>ArtStar</td><td>312</td></tr>
                            <tr><td>2</td><td>Lumo</td><td>299</td></tr>
                            <tr><td>3</td><td>PixelFan</td><td>250</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <section>
            <h2 class="text-3xl font-bold mb-6 text-pink-400">👥 All Members</h2>

            @php
                $members = \App\Models\User::all();
            @endphp

            @if($members->count() > 0)
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    @foreach($members as $member)
                        <div class="bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition-all duration-300 text-center">
                            <img src="{{ $member->avatar ?? asset('assets/default-avatar.png') }}" alt="{{ $member->name }}" class="w-16 h-16 rounded-full mx-auto mb-2">
                            <h3 class="font-bold text-lg">{{ $member->name }}</h3>
                            <p class="text-white/80 text-sm">{{ $member->role ?? 'Community Member' }}</p>
                            <p class="text-white/70 text-xs mt-1">{{ $member->squad ?? 'No Squad' }}</p>
                            @if($member->badges)
                                <div class="flex justify-center gap-1 mt-2 flex-wrap">
                                    @foreach(explode(',', $member->badges) as $badge)
                                        <span class="text-yellow-400 text-xs bg-gray-700 px-2 py-1 rounded">{{ $badge }}</span>
                                    @endforeach
                                </div>
                            @endif
                        </div>
                    @endforeach
                </div>
            @else
                <p class="text-white/80 text-center">No members found.</p>
            @endif
        </section>

    </main>

</x-app-layout>
