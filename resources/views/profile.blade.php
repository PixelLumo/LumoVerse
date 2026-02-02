<x-app-layout title="Profile - PixelLumo">

    <div class="hero-box p-0">
        <div class="relative w-full h-44 rounded-t-2xl overflow-hidden bg-gradient-to-r from-purple-700 to-purple-900">
            <img id="profile-banner-img" src="{{ asset('assets/default-banner.jpg') }}" alt="Banner" class="w-full h-full object-cover opacity-70">
        </div>

        <div class="relative -mt-12 text-center">
            <img id="profile-avatar" src="{{ asset('assets/default-avatar.png') }}" alt="Avatar" class="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto">
            <h1 id="profile-displayName" class="glow text-pink-500 text-2xl font-bold mt-2"></h1>
            <p id="profile-bio" class="text-white/80 italic mb-2"></p>
            <div id="profile-socials" class="mb-2 flex justify-center"></div>
            <a href="{{ route('profile.edit') }}" class="btn-secondary">Edit Profile</a>
        </div>
    </div>

    <main class="mt-4">
        <div class="flex flex-wrap justify-around gap-4 mb-6 max-w-3xl mx-auto">
            <div class="card text-center min-w-[100px]">
                <div class="text-2xl">⭐</div>
                <div id="profile-achievements">0</div>
                <div class="text-sm text-white/80">Achievements</div>
            </div>
            <div class="card text-center min-w-[100px]">
                <div class="text-2xl">🖼️</div>
                <div id="profile-artcount">0</div>
                <div class="text-sm text-white/80">Artworks</div>
            </div>
            <div class="card text-center min-w-[100px]">
                <div class="text-2xl">📝</div>
                <div id="profile-postcount">0</div>
                <div class="text-sm text-white/80">Posts</div>
            </div>
        </div>

        <div class="flex justify-center gap-4 mb-4">
            <button class="btn-secondary tab-button" data-tab="posts">Posts</button>
            <button class="btn-secondary tab-button" data-tab="art">Art</button>
            <button class="btn-secondary tab-button" data-tab="achievements">Achievements</button>
        </div>
        <div id="profile-tab-content" class="min-h-[120px] max-w-3xl mx-auto p-4 bg-gray-800 rounded-xl shadow text-white/90"></div>
    </main>

    <script type="module">
        import { createClient } from '/js/supabase.js';
        import { loadProfile } from '/js/profile.js';

        const supabase = createClient();

        function renderSocialLinks(links) {
            if (!links) return '';
            let html = '';
            if (links.twitter) html += `<a href="${links.twitter}" target="_blank" class="mx-1"><img src="{{ asset('assets/twitter.svg') }}" class="w-5" alt="Twitter"></a>`;
            if (links.instagram) html += `<a href="${links.instagram}" target="_blank" class="mx-1"><img src="{{ asset('assets/instagram.svg') }}" class="w-5" alt="Instagram"></a>`;
            if (links.website) html += `<a href="${links.website}" target="_blank" class="mx-1"><img src="{{ asset('assets/link.svg') }}" class="w-5" alt="Website"></a>`;
            return html;
        }

        function renderTabContent(profile, tab) {
            if (!profile) return '<p class="text-center">Profile data unavailable.</p>';
            switch(tab) {
                case 'posts':
                    if(!profile.posts?.length) return '<p class="text-center">No posts yet.</p>';
                    return profile.posts.map(p => `<div class="bg-gray-700 p-4 rounded mb-3">
                        <h4 class="font-bold text-white">${p.title}</h4>
                        <p class="text-white/80">${p.content}</p>
                    </div>`).join('');
                case 'art':
                    if(!profile.art?.length) return '<p class="text-center">No artworks yet.</p>';
                    return profile.art.map(a => `<div class="bg-gray-700 p-4 rounded mb-3">
                        <h4 class="font-bold text-white">${a.title}</h4>
                        <img src="${a.url}" class="rounded mt-2">
                    </div>`).join('');
                case 'achievements':
                    if(!profile.achievements?.length) return '<p class="text-center">No achievements yet.</p>';
                    return profile.achievements.map(a => `<div class="bg-gray-700 p-4 rounded mb-3">
                        <p>${a}</p>
                    </div>`).join('');
                default:
                    return '<p class="text-center">Select a tab to view content.</p>';
            }
        }

        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) return location.href = '{{ route("login") }}';
            const profile = await loadProfile(user.id);

            if(!profile) return;

            document.getElementById('profile-avatar').src = profile.avatar || '{{ asset("assets/default-avatar.png") }}';
            document.getElementById('profile-displayName').textContent = profile.displayName || 'Unnamed';
            document.getElementById('profile-bio').textContent = profile.bio || '';
            document.getElementById('profile-socials').innerHTML = renderSocialLinks(profile.socials);

            document.getElementById('profile-achievements').textContent = profile.achievements?.length || 0;
            document.getElementById('profile-artcount').textContent = profile.art?.length || 0;
            document.getElementById('profile-postcount').textContent = profile.posts?.length || 0;

            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContent = document.getElementById('profile-tab-content');

            tabButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    tabContent.innerHTML = renderTabContent(profile, btn.dataset.tab);
                    tabButtons.forEach(b => b.classList.remove('bg-pink-500', 'text-white'));
                    btn.classList.add('bg-pink-500', 'text-white');
                });
            });

            // Default tab
            tabButtons[0].click();
        });
    </script>

</x-app-layout>
