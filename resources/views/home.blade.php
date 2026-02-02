@php
    $displayTitle = auth()->check() 
        ? "Welcome, " . auth()->user()->name 
        : "Welcome to PixelLumo";

    $features = [
        ['label' => 'Artz', 'desc' => 'Discover and post artworks in the Artz section.'],
        ['label' => 'Posts', 'desc' => 'Share your thoughts and stories in Posts.'],
        ['label' => 'Community', 'desc' => 'Connect with other gamers in the Community area.'],
        ['label' => 'Squad', 'desc' => 'Join or create teams in Squad for fun challenges.'],
        ['label' => 'Tutorials', 'desc' => 'Check out Tutorials if you want tips or guides.'],
    ];

    $highlights = [
        ['icon'=>'💬','title'=>'Chats','desc'=>'Talk with others, form strategies, or just hang out.','bg'=>'from-purple-900 via-purple-800 to-purple-700','delay'=>'delay-100'],
        ['icon'=>'📚','title'=>'Tutorials','desc'=>'Game guides, tips, and tutorials to level up your skills.','bg'=>'from-pink-900 via-pink-800 to-pink-700','delay'=>'delay-200'],
        ['icon'=>'📝','title'=>'Suggestions','desc'=>'Submit ideas or features you want to see.','bg'=>'from-indigo-900 via-indigo-800 to-indigo-700','delay'=>'delay-300'],
        ['icon'=>'👤','title'=>'Profile Edits','desc'=>'Update your avatar and info anytime.','bg'=>'from-yellow-900 via-yellow-800 to-yellow-700','delay'=>'delay-400'],
        ['icon'=>'🎨','title'=>'Artz & Posts','desc'=>'Showcase your creativity and engage with content.','bg'=>'from-green-900 via-green-800 to-green-700','delay'=>'delay-500'],
    ];

    $quickCards = [
        ['title'=>'Your Profile','textColor'=>'text-purple-400','desc'=>'View and edit your profile details and preferences.','route'=>'profile.edit','btn'=>'Go to Profile'],
        ['title'=>'Tutorials','textColor'=>'text-pink-400','desc'=>'Explore guides and tips to improve your skills.','route'=>'tutorials','btn'=>'View Tutorials'],
        ['title'=>'Suggestions','textColor'=>'text-yellow-400','desc'=>'Share your ideas to help improve PixelLumo.','route'=>'suggestions','btn'=>'Submit Suggestions'],
    ];

    $tips = [
        "Interact with others in posts and comments to stay active.",
        "Check Tutorials to improve your gameplay.",
        "Submit suggestions to help make PixelLumo even better.",
        "Customize your profile to showcase your style.",
    ];
    $tipOfTheDay = $tips[array_rand($tips)];
@endphp

<x-app-layout :title="$displayTitle" :subtitle="'Your ultimate gaming community hub'">
    <div class="main-content max-w-6xl mx-auto py-12 px-6 space-y-12">

        {{-- Welcome Card --}}
        <div class="card p-8 bg-gray-900 rounded-xl border border-gray-800 hover:shadow-lg transition-all duration-300 animate-fadeIn">
            <h1 class="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent animate-gradient">
                @auth
                    Welcome back, {{ auth()->user()->name }}!
                @else
                    Welcome to PixelLumo!
                @endauth
            </h1>
            <p class="text-lg text-gray-300 mb-4">
                You're now logged in. Here's a quick guide to explore PixelLumo:
            </p>
            <ul class="list-disc list-inside text-gray-300 space-y-2">
                @foreach($features as $feature)
                    <li><span class="font-bold text-white">{{ $feature['label'] }}</span>: {{ $feature['desc'] }}</li>
                @endforeach
            </ul>
        </div>

        {{-- Highlights Grid --}}
        <div>
            <h2 class="text-3xl font-bold mb-8 text-white text-center animate-fadeIn">What we offer</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($highlights as $item)
                    <div class="card p-6 rounded-xl bg-gradient-to-br {{ $item['bg'] }} hover:scale-105 transform transition duration-300 shadow-lg flex flex-col items-center text-center animate-fadeIn {{ $item['delay'] }}">
                        <div class="text-5xl mb-4">{{ $item['icon'] }}</div>
                        <h3 class="text-xl font-bold mb-2 text-white">{{ $item['title'] }}</h3>
                        <p class="text-gray-200">{{ $item['desc'] }}</p>
                    </div>
                @endforeach
            </div>
        </div>

        {{-- Action Cards --}}
        <div class="grid md:grid-cols-3 gap-6 mb-8">
            @foreach($quickCards as $card)
                <div class="card p-6 bg-gray-900 rounded-xl border border-gray-800 hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                    <h2 class="font-bold text-xl mb-2 {{ $card['textColor'] }}">{{ $card['title'] }}</h2>
                    <p class="text-gray-300 mb-4">{{ $card['desc'] }}</p>
                    
                    @if(Route::has($card['route']))
                        <a href="{{ route($card['route']) }}" class="inline-block w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-center transition">
                            {{ $card['btn'] }}
                        </a>
                    @else
                        <button class="w-full py-2 px-4 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed">
                            Coming Soon
                        </button>
                    @endif
                </div>
            @endforeach

            {{-- Tip of the Day --}}
            <div class="card p-8 rounded-xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 md:col-span-3 bg-gradient-to-r from-purple-800 via-pink-700 to-yellow-600">
                <h2 class="font-bold text-2xl mb-2 text-white flex items-center gap-2">
                    <span>💡</span> Tip of the Day
                </h2>
                <p class="text-xl text-white opacity-90 italic">"{{ $tipOfTheDay }}"</p>
            </div>
        </div>
    </div>

    <style>
        @keyframes gradientShift { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
        .animate-gradient { background-size:200% 200%; animation: gradientShift 5s ease infinite; }
        .animate-fadeIn { opacity:0; transform:translateY(10px); animation: fadeIn 0.6s ease forwards; }
        .delay-100 { animation-delay:0.1s; }
        .delay-200 { animation-delay:0.2s; }
        .delay-300 { animation-delay:0.3s; }
        .delay-400 { animation-delay:0.4s; }
        .delay-500 { animation-delay:0.5s; }
        @keyframes fadeIn { to { opacity:1; transform:translateY(0); } }
    </style>
</x-app-layout>