@php
    $features = [
        ['label' => 'Artz', 'color' => 'text-yellow', 'desc' => 'Discover and post artworks in the Artz section.'],
        ['label' => 'Posts', 'color' => 'text-rose', 'desc' => 'Share your thoughts and stories in Posts.'],
        ['label' => 'Community', 'color' => 'text-emerald', 'desc' => 'Connect with other gamers in the Community area.'],
        ['label' => 'Squad', 'color' => 'text-sky', 'desc' => 'Join or create teams in Squad for fun challenges.'],
        ['label' => 'Tutorials', 'color' => 'text-fuchsia', 'desc' => 'Check out Tutorials if you want tips or guides.'],
    ];
@endphp

<ul class="list-clean space-y-4">
    @foreach($features as $feature)
        <li class="text-lg text-white">
            <span class="font-bold {{ $feature['color'] }} underline underline-offset-4 decoration-2">
                {{ $feature['label'] }}
            </span>:
            {{ $feature['desc'] }}
        </li>
    @endforeach
</ul>