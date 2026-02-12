@php
    $quickCards = [
        ['title'=>'Tutorials', 'textColor'=>'text-pink-400', 'desc'=>'Explore guides and tips to improve your skills.', 'route'=>'tutorials', 'btn'=>'View Tutorials'],
        ['title'=>'Suggestions', 'textColor'=>'text-yellow-400', 'desc'=>'Share your ideas to help improve PixelLumo.', 'route'=>'suggestions', 'btn'=>'Submit Suggestions'],
        ['title'=>'Chat', 'textColor'=>'text-blue-400', 'desc'=>'Interact with the AI assistant to get answers.', 'route'=>'chat', 'btn'=>'Open Chat'],
        ['title'=>'Roadmap', 'textColor'=>'text-emerald-400', 'desc'=>'Track upcoming features and project progress.', 'route'=>'roadmap', 'btn'=>'View Roadmap'],
    ];
@endphp

<div class="grid md:grid-cols-3 gap-8">
    @foreach($quickCards as $card)
        @php
            $glowColor = str_contains($card['textColor'], 'purple') ? 'shadow-purple-500/20 border-purple-500/40' : 
                        (str_contains($card['textColor'], 'pink') ? 'shadow-pink-500/20 border-pink-500/40' : 
                        'shadow-yellow-500/20 border-yellow-500/40');
        @endphp
        
        <div class="content-card flex flex-col h-full border-2 {{ $glowColor }} shadow-lg">
            <h2 class="font-bold text-2xl mb-4 {{ $card['textColor'] }}">{{ $card['title'] }}</h2>
            <p class="text-white flex-grow leading-relaxed" style="padding-bottom: 10px;">{{ $card['desc'] }}</p>
            
            @if(Route::has($card['route']))
                <a href="{{ route($card['route']) }}" class="btn w-full block text-center py-3">
                    {{ $card['btn'] }}
                </a>
            @else
                <button class="btn opacity-50 cursor-not-allowed w-full py-3">Coming Soon</button>
            @endif
        </div>
    @endforeach
</div>