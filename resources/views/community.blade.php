<x-app-layout title="Community | PixelLumo">
    <div class="hero-box px-4 sm:px-6 py-12 text-center">
        <h1 class="glow pink-text text-4xl sm:text-5xl md:text-6xl font-bold">Community</h1>
        <p class="mt-4 text-base sm:text-lg md:text-xl opacity-80">
            Connect with others, share ideas, and explore creative spaces.
        </p>
    </div>

    <main class="max-w-6xl mx-4 sm:mx-auto my-12 px-2 sm:px-4 space-y-8 sm:space-y-12">

        {{-- Join Discussions --}}
        <section>
            <h2 class="text-2xl font-bold mb-4 text-pink-400">💬 Join Discussions</h2>
            <p class="text-white/90 mb-6 text-sm sm:text-base">
                Participate in community channels, micro-groups, or chat with friends. Spaces are intentionally small; presence matters more than noise.
            </p>
            <a href="{{ route('chat') }}" class="btn-primary px-6 py-3 w-full sm:w-auto">Go to Chat</a>
        </section>

        {{-- Featured Members --}}
        <section class="mb-16 w-full">
            <h2 class="text-2xl font-bold mb-8 text-pink-400 text-center">🌟 Featured Members</h2>
            
            <p class="text-gray-400 mb-10 text-center text-sm sm:text-base">
                Currently, <span class="text-pink-400 font-semibold">{{ $totalMembers }}</span> members are part of PixelLumo!
            </p>

            @if($featuredMembers->count())
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mx-auto px-4">
                    @foreach($featuredMembers as $member)
                        <div class="group flex flex-col items-center">
                            <div class="w-full bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 hover:border-pink-400/50 transition-all duration-300 text-center shadow-sm hover:shadow-pink-500/10">
                                <h3 class="font-semibold text-gray-100 group-hover:text-pink-400 transition-colors">
                                    {{ $member->name }}
                                </h3>
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <div class="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 text-center max-w-sm mx-auto">
                    <h3 class="font-bold text-lg mb-1 text-pink-400">{{ auth()->user()->name }}</h3>
                    <p class="text-gray-400 text-sm">Founder & Creator</p>
                </div>
                <p class="mt-6 text-gray-500 text-center italic text-sm">
                    More members will appear here as they join the community.
                </p>
            @endif
        </section>

        {{-- Squads & Groups --}}
        <section>
            <h2 class="text-2xl font-bold mb-6 text-pink-400">👑 Squads & Groups</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div class="bg-linear-to-br from-purple-900 via-purple-800 to-purple-700 p-4 rounded-xl shadow">
                    <h3 class="font-bold text-lg mb-1">Founders</h3>
                    <p class="opacity-80 text-sm sm:text-base">Original creators and admins helping shape PixelLumo’s future.</p>
                </div>
                <div class="bg-gray-800 p-4 rounded-xl shadow">
                    <h3 class="font-bold text-lg mb-1">Builders</h3>
                    <p class="opacity-80 text-sm sm:text-base">Community event organizers, moderators, and helpers.</p>
                </div>
                <div class="bg-gray-800 p-4 rounded-xl shadow">
                    <h3 class="font-bold text-lg mb-1">Artists</h3>
                    <p class="opacity-80 text-sm sm:text-base">Share art, memes, and creative projects with your squad.</p>
                </div>
            </div>
        </section>

        {{-- User Directory --}}
        <section>
            <h2 class="text-2xl font-bold mb-6 text-pink-400">🗂️ User Directory</h2>
            <p class="text-white/80 mb-4 text-sm sm:text-base">All users in the community, organized by squad, badges, and rank.</p>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse bg-gray-800 rounded-xl shadow text-sm sm:text-base">
                    <thead>
                        <tr class="border-b border-gray-600">
                            <th scope="col" class="px-2 sm:px-4 py-2 text-pink-400">#</th> {{-- Rank Column --}}
                            <th scope="col" class="px-2 sm:px-4 py-2 text-white">User</th>
                            <th scope="col" class="px-2 sm:px-4 py-2 text-white">Role</th>
                            <th scope="col" class="px-2 sm:px-4 py-2 text-white text-center">Badges</th>
                            <th scope="col" class="px-2 sm:px-4 py-2 text-white">Score</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-700">
                        @foreach($users as $user)
                            <tr class="border-b border-gray-700">
                                <td class="px-2 sm:px-4 py-2 font-bold text-pink-500">{{ $loop->iteration }}</td>
                                <td class="px-2 sm:px-4 py-2 text-white/90">{{ $user->name }}</td>
                                <td class="px-2 sm:px-4 py-2 text-white/80">{{ $user->role ?? '-' }}</td>
                                <td class="px-2 sm:px-4 py-2 text-white/80 text-center">{{ $user->badges ?? '-' }}</td>
                                <td class="px-2 sm:px-4 py-2 text-white/80 font-mono">{{ $user->score ?? '-' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </section>

        {{-- Community Rules --}}
        <section class="mb-12 relative">
            <h2 class="text-3xl font-bold mb-6 text-pink-400 text-center animate-fadeIn">📜 Community Rules</h2>

            <div class="flex overflow-x-auto gap-4 sm:gap-6 py-4 px-2 animate-fadeIn">
                @foreach($rules as $rule)
                    <div class="rule-card shrink-0 w-64 p-6 bg-linear-to-br from-purple-900 via-purple-800 to-purple-700 rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:rotate-1 relative overflow-hidden">
                        <div class="absolute -top-4 -left-4 text-4xl animate-bounce">{{ $rule['icon'] }}</div>
                        <p class="text-white font-semibold mt-6">{{ $rule['text'] }}</p>
                        <div class="sparkles absolute inset-0 pointer-events-none"></div>
                    </div>
                @endforeach
            </div>

            <p class="mt-4 text-gray-300 text-center text-sm sm:text-base">
                Scroll to explore all the rules, and hover to see them come alive!
            </p>
        </section>

    </main>

    @push('scripts')
    <script>
        document.querySelectorAll('.rule-card').forEach(card => {
            const sparkleContainer = card.querySelector('.sparkles');
            for (let i = 0; i < 10; i++) { // reduced number for performance
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.width = sparkle.style.height = (2 + Math.random() * 3) + 'px';
                sparkle.style.background = 'radial-gradient(circle, #fff, transparent)';
                sparkle.style.position = 'absolute';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.opacity = Math.random();
                sparkle.style.animation = `sparkleMove ${3 + Math.random() * 2}s infinite alternate`;
                sparkleContainer.appendChild(sparkle);
            }
        });
    </script>
    @endpush

    @push('styles')
    <style>
        @keyframes sparkleMove {
            0% { transform: translate(0,0) scale(1); opacity: 0.3; }
            50% { transform: translate(2px,-2px) scale(1.2); opacity: 1; }
            100% { transform: translate(-2px,2px) scale(1); opacity: 0.3; }
        }
        .sparkle { border-radius: 50%; }
        .animate-fadeIn { opacity:0; transform:translateY(10px); animation: fadeIn 0.6s ease forwards; }
        @keyframes fadeIn { to { opacity:1; transform:translateY(0); } }
    </style>
    @endpush

</x-app-layout>
