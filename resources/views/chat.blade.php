<x-app-layout title="Chat | PixelLumo">

    <div class="hero-box px-4 sm:px-6 py-12 text-center">
        <h1 class="glow pink-text text-4xl sm:text-5xl md:text-6xl font-bold">Chat</h1>
        <p class="mt-4 text-base sm:text-lg md:text-xl opacity-80">
            Connect with friends in real-time conversations.
        </p>
    </div>

    <main class="max-w-4xl mx-4 sm:mx-auto my-6 sm:my-8 space-y-8 sm:space-y-12">

        {{-- Chat Channels --}}
        <section>
            <h2 class="text-2xl font-bold mb-4 text-white">Channels</h2>

            @if($channels->isEmpty())
                <p class="text-gray-400">No channels available. Check back later or create one!</p>
            @else
                <div id="chatChannels" class="space-y-3">
                    @foreach($channels as $channel)
                        <a href="{{ route('chat.channel', $channel->id) }}"
                           class="block px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-all shadow">
                            # {{ $channel->name }}
                            <span class="text-gray-400 text-sm ml-2">({{ $channel->users_count }} members)</span>
                        </a>
                    @endforeach
                </div>
            @endif
        </section>

        {{-- Contact / Ping --}}
        <section class="bg-gray-800 rounded-xl shadow p-4 sm:p-6">
            <h2 class="text-3xl font-bold mb-4">📧 Ping</h2>
            <p class="text-white/90 mb-4 text-sm sm:text-base">
                Reach out for support, feedback, or just to say hi! We aim to respond within 24–48 hours.
            </p>

            {{-- Contact Form --}}
            <form action="{{ route('contact.send') }}" method="POST" class="space-y-4">
                @csrf

                <div>
                    <label class="block mb-1 font-semibold" for="name">Your Name</label>
                    <input id="name" name="name" type="text" required
                           class="w-full p-2 sm:p-3 rounded bg-gray-700 border border-gray-600 text-white sm:text-base"
                           placeholder="Enter your name" value="{{ old('name') }}">
                    @error('name') <p class="text-red-400 text-sm mt-1">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label class="block mb-1 font-semibold" for="email">Your Email</label>
                    <input id="email" name="email" type="email" required
                           class="w-full p-2 sm:p-3 rounded bg-gray-700 border border-gray-600 text-white sm:text-base"
                           placeholder="Enter your email" value="{{ old('email') }}">
                    @error('email') <p class="text-red-400 text-sm mt-1">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label class="block mb-1 font-semibold" for="message">Message</label>
                    <textarea id="message" name="message" rows="4" required
                              class="w-full p-2 sm:p-3 rounded bg-gray-700 border border-gray-600 text-white sm:text-base"
                              placeholder="How can we help you?">{{ old('message') }}</textarea>
                    @error('message') <p class="text-red-400 text-sm mt-1">{{ $message }}</p> @enderror
                </div>

                <button type="submit"
                        class="w-full sm:w-auto px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded font-bold text-white">
                    Send Message
                </button>

                @if(session('success'))
                    <p class="text-green-400 text-sm mt-2">{{ session('success') }}</p>
                @endif
            </form>

            {{-- Support Info --}}
            <div class="mt-6 text-white/80 space-y-2 text-sm sm:text-base">
                <p>Support Email: <a href="mailto:support@pixellumo.com" class="text-pink-400">support@pixellumo.com</a></p>
                <p>Connect on Socials:</p>
                <div class="flex flex-wrap sm:flex-nowrap gap-3">
                    <a href="#" class="hover:text-pink-400">Twitch</a>
                    <a href="#" class="hover:text-pink-400">X/Twitter</a>
                    <a href="#" class="hover:text-pink-400">Instagram</a>
                    <a href="#" class="hover:text-pink-400">YouTube</a>
                    <a href="#" class="hover:text-pink-400">Discord</a>
                </div>
            </div>

            {{-- FAQ --}}
            <div class="mt-6">
                <h3 class="text-xl font-semibold mb-2">FAQ</h3>
                <ul class="list-disc list-inside text-white/80 space-y-1 text-sm sm:text-base">
                    <li><strong>How soon will I get a reply?</strong> Usually within 24–48 hours.</li>
                    <li><strong>Can I request a feature?</strong> Yes! Use the form or email to send ideas.</li>
                    <li><strong>Where can I report bugs?</strong> Use the form or email for bug reports.</li>
                    <li><strong>How do I join the community?</strong> Sign up <a href="{{ route('register') }}" class="text-pink-400">here</a>.</li>
                </ul>
            </div>

        </section>

    </main>
</x-app-layout>
