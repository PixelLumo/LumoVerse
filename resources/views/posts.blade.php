<x-app-layout title="Posts | PixelLumo">
    <div class="hero-box p-12 text-center">
        <h1 class="glow pink-text text-5xl md:text-6xl font-bold">Posts</h1>
        <p class="mt-4 text-lg md:text-xl opacity-80">Browse and interact with community posts.</p>
    </div>

    <main class="max-w-6xl mx-auto my-12 px-4 space-y-12">

        {{-- Featured Posts --}}
        <section>
            <h2 class="text-2xl font-bold mb-6 text-pink-400">🌟 Featured</h2>
            <div class="space-y-6">
                @foreach($featuredPosts as $post)
                    <div class="bg-purple-mystery-fade rounded-xl shadow p-6">
                        <h3 class="font-bold text-xl mb-2">{{ $post->title }}</h3>
                        <p class="opacity-90 mb-4">{{ Str::limit($post->body, 150) }}</p>
                        <p class="opacity-70 text-sm mb-4">By {{ $post->author->name }} • {{ $post->created_at->format('M Y') }}</p>
                        <a href="{{ route('posts.show', $post) }}" class="btn-secondary px-4 py-2">Read More</a>
                    </div>
                @endforeach
            </div>
        </section>

        {{-- Recent Posts --}}
        <section>
            <h2 class="text-2xl font-bold mb-6 text-pink-400">📝 Recent Posts</h2>
            <div class="space-y-6">
                @foreach($recentPosts as $post)
                    <div class="bg-gray-800 rounded-xl shadow p-6">
                        <h3 class="font-bold text-lg mb-1">{{ $post->title }}</h3>
                        <p class="opacity-80 mb-2">{{ Str::limit($post->body, 120) }}</p>
                        <p class="opacity-60 text-sm mb-2">By {{ $post->author->name }} • {{ $post->created_at->format('M Y') }}</p>

                        {{-- Post Actions --}}
                        <div class="flex gap-4 items-center text-sm">
                            <form action="{{ route('posts.like', $post) }}" method="POST">
                                @csrf
                                <button class="flex items-center gap-1 hover:text-pink-400">👍 Like</button>
                            </form>
                            <form action="{{ route('posts.save', $post) }}" method="POST">
                                @csrf
                                <button class="flex items-center gap-1 hover:text-pink-400">💾 Save</button>
                            </form>
                            <span class="flex items-center gap-1">💬 {{ $post->comments_count }} Comments</span>
                        </div>
                    </div>
                @endforeach
            </div>
            {{ $recentPosts->links() }}
        </section>

        {{-- Comments Section --}}
        <section>
            <h2 class="text-2xl font-bold mb-4 text-pink-400">💬 Latest Comments</h2>
            <div class="space-y-4">
                @foreach($latestComments as $comment)
                    <div class="bg-gray-800 p-4 rounded-xl shadow">
                        <p class="text-sm opacity-90">
                            <strong>{{ $comment->author->name }}:</strong> {{ $comment->body }}
                        </p>
                    </div>
                @endforeach
            </div>

            {{-- Add Comment Form --}}
            <form action="{{ route('comments.store') }}" method="POST" class="mt-4 space-y-2">
                @csrf
                <textarea name="body" class="w-full bg-gray-700 rounded-xl p-3 text-white border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-30" rows="3" placeholder="Add a comment..."></textarea>
                <button type="submit" class="btn-primary px-6 py-2">Post Comment</button>
            </form>
        </section>
    </main>
</x-app-layout>
