<x-guest-layout title="Welcome to PixelLumo">
    {{-- Hero Section --}}
    <div class="hero-box p-12 text-center bg-linear-to-r from-purple-800 to-pink-500">
        <h1 class="glow text-5xl md:text-6xl font-bold">Welcome to PixelLumo</h1>
        <p class="mt-4 text-lg md:text-xl text-white/90">
            A quiet, aesthetic-first social space for creators, gamers, and anyone looking to belong.
        </p>
        <div class="mt-8 flex justify-center gap-4">
            @php
                $ctaButtons = [
                    ['label' => 'Join PixelLumo', 'route' => 'register', 'style' => 'btn-primary'],
                    ['label' => 'Explore the vibe', 'route' => 'community', 'style' => 'btn-secondary'],
                ];
            @endphp
            @foreach($ctaButtons as $button)
                <a href="{{ route($button['route']) }}" class="{{ $button['style'] }} px-6 py-3 rounded-lg text-lg font-semibold">
                    {{ $button['label'] }}
                </a>
            @endforeach
        </div>
    </div>

    {{-- Featured Sections --}}
    @php
        $featuredSections = [
            ['title' => 'Featured Artworks', 'id' => 'featuredArtworks'],
            ['title' => 'Featured Tutorials', 'id' => 'featuredTutorials'],
            ['title' => 'Featured Members', 'id' => 'featuredMembers'],
        ];
    @endphp

    <section class="max-w-6xl mx-auto my-12 grid md:grid-cols-3 gap-6">
        @foreach($featuredSections as $section)
            <div class="card p-4 bg-gray-800 rounded-xl shadow">
                <h2 class="font-bold text-xl mb-2">{{ $section['title'] }}</h2>
                <div id="{{ $section['id'] }}" class="grid grid-cols-1 gap-3"></div>
            </div>
        @endforeach
    </section>

    {{-- Why PixelLumo Section --}}
    <section class="max-w-4xl mx-auto my-12 text-center">
        <h2 class="text-3xl font-bold text-white/90 mb-4">Why PixelLumo?</h2>
        @php
            $reasons = [
                "PixelLumo is a place to create, share, and connect without algorithms, trends, or pressure.",
                "Small curated spaces, quiet presence, and full creative freedom — find your people and your vibe."
            ];
        @endphp
        @foreach($reasons as $reason)
            <p class="text-white/80 mb-2">{{ $reason }}</p>
        @endforeach
    </section>
</x-guest-layout>
