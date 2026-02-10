@php
    $tips = [
        "Interact with others in posts and comments to stay active.",
        "Check Tutorials to improve your gameplay.",
        "Submit suggestions to help make PixelLumo even better.",
        "Customize your profile to showcase your style.",
    ];
    $tipOfTheDay = $tips[array_rand($tips)];
@endphp

<div class="card p-10 rounded-3xl border-4 border-double border-yellow-400 bg-gray-950 shadow-[0_0_30px_rgba(250,204,21,0.2)] max-w-4xl mx-auto">
    <h2 class="pixel-text text-yellow-400 text-xl mb-8 flex items-center justify-center gap-4">
        <span>💡</span> TIP OF THE DAY
    </h2>
    <div class="bg-black/40 p-6 rounded-lg border border-yellow-400/20">
        <p class="pixel-text text-white text-[10px] sm:text-xs leading-[2] text-center">
            "{{ $tipOfTheDay }}"
        </p>
    </div>
</div>