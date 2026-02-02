<x-app-layout title="Artz | PixelLumo">
    <div class="hero-box px-4 sm:px-6 py-12 text-center">
        <h1 class="glow pink-text text-4xl sm:text-5xl md:text-6xl font-bold">Artz</h1>
        <p class="mt-4 text-base sm:text-lg md:text-xl opacity-80">
            Explore artworks from our creative community.
        </p>
    </div>

    <main class="max-w-6xl mx-4 sm:mx-auto my-6 sm:my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        @forelse($artworks as $art)
            <div class="card p-4 sm:p-6 bg-gray-800 rounded-xl shadow hover:scale-[1.02] transition-transform">
                <h3 class="font-bold text-white mb-2 text-lg sm:text-xl">{{ $art->title }}</h3>
                <p class="text-white/90 text-sm sm:text-base">{{ $art->description }}</p>
            </div>
        @empty
            <div class="col-span-full text-center text-gray-400 py-12">
                No artworks have been posted yet. Check back soon!
            </div>
        @endforelse
    </main>

    @if($artworks->hasPages())
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            {{ $artworks->links('pagination::tailwind') }}
        </div>
    @endif
</x-app-layout>
