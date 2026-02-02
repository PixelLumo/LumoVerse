<x-app-layout title="Suggestions | PixelLumo">

    <div class="hero-box p-12 text-center">
        <h1 class="glow pink-text text-5xl md:text-6xl font-bold">Share Your Ideas</h1>
        <p class="mt-4 text-lg md:text-xl opacity-80">Have suggestions, feedback, or ideas for PixelLumo? We’re listening!</p>
    </div>

    <main class="max-w-2xl mx-auto my-12 p-6 bg-gray-800 rounded-xl shadow-lg">

        @if(session('success'))
            <div class="bg-green-600 text-white p-3 rounded mb-6">
                {{ session('success') }}
            </div>
        @endif

        <form action="{{ route('suggestions.submit') }}" method="POST" class="space-y-4">
            @csrf
            <div>
                <label for="name" class="block mb-1 font-semibold text-white">Name (optional)</label>
                <input type="text" name="name" id="name" class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" value="{{ old('name') }}">
                @error('name') <p class="text-red-400 text-sm mt-1">{{ $message }}</p> @enderror
            </div>

            <div>
                <label for="email" class="block mb-1 font-semibold text-white">Email (optional)</label>
                <input type="email" name="email" id="email" class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" value="{{ old('email') }}">
                @error('email') <p class="text-red-400 text-sm mt-1">{{ $message }}</p> @enderror
            </div>

            <div>
                <label for="message" class="block mb-1 font-semibold text-white">Your Suggestion</label>
                <textarea name="message" id="message" rows="6" class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" required>{{ old('message') }}</textarea>
                @error('message') <p class="text-red-400 text-sm mt-1">{{ $message }}</p> @enderror
            </div>

            <button type="submit" class="btn-primary w-full py-3 font-bold">Submit Suggestion</button>
        </form>

    </main>

</x-app-layout>
