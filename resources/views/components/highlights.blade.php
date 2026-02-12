@php
    $highlights = [
        ['icon'=>'💬', 'title'=>'Chats', 'desc'=>'Talk strategies or hang out.',
            'top' => '0%', 'left' => '5%', 'color' => '#a855f7' // Purple
            ],
        ['icon'=>'📚', 'title'=>'Tutorials', 'desc'=>'Guides to level up.',
            'top' => '10%', 'left' => '60%', 'color' => '#ec4899' // Pink
            ],
        ['icon'=>'📝', 'title'=>'Suggestions', 'desc'=>'Submit your ideas.',
            'top' => '30%', 'left' => '25%', 'color' => '#38bdf8' // Sky Blue
            ],
        ['icon'=>'👤', 'title'=>'Profile', 'desc'=>'Update your info.',
            'top' => '60%', 'left' => '10%', 'color' => '#facc15' // Yellow
            ],
        ['icon'=>'🎨', 'title'=>'Artz', 'desc'=>'Showcase creativity.',
            'top' => '55%', 'left' => '55%', 'color' => '#4ade80' // Green
            ],
    ];
@endphp
<script src="https://cdn.tailwindcss.com"></script>
<div class="highlights-canvas">
    @foreach($highlights as $item)
        <div class="highlight-card-wrapper" 
             style="top: {{ $item['top'] }}; left: {{ $item['left'] }};">
            
            <div class="highlight-card" style="border-color: {{ $item['color'] }}; box-shadow: 0 0 15px {{ $item['color'] }}44;">
                
                {{-- Icon on the Left --}}
                <div class="highlight-icon">
                    {{ $item['icon'] }}
                </div>

                {{-- Text Content on the Right --}}
                <div class="highlight-text">
                    <h3 class="pixel-text" style="color: {{ $item['color'] }}; font-size: 14px; margin-bottom: 4px;">
                        {{ $item['title'] }}
                    </h3>
                    <p>{{ $item['desc'] }}</p>
                </div>

            </div>
        </div>
    @endforeach
</div>

<style>
    /* 1. The Area where cards float */
    .highlights-canvas {
        position: relative;
        width: 100%;
        min-height: 700px; /* Adjust this if you want a taller/shorter area */
        margin-top: 50px;
        text-align: left; /* Forces cards to stop centering */
    }

    /* 2. The Wrapper that handles the Absolute position */
    .highlight-card-wrapper {
        position: absolute;
        width: 320px;
        transition: transform 0.3s ease;
        z-index: 10;
    }

    .highlight-card-wrapper:hover {
        transform: translateY(-5px) scale(1.05);
        z-index: 50;
    }

    /* 3. The Card itself (Borders and Layout) */
    .highlight-card {
        display: flex;
        flex-direction: row; /* Icon left, Text right */
        align-items: center;
        gap: 15px;
        padding: 20px;
        background: #0f0a1a; /* Solid dark background */
        border: 3px solid;   /* Thick border */
        border-radius: 12px;
    }

    .highlight-icon {
        font-size: 40px;
        flex-shrink: 0;
    }

    .highlight-text p {
        color: rgba(255, 255, 255, 0.8);
        font-size: 12px;
        line-height: 1.4;
        margin: 0;
        text-align: left;
    }

    /* Mobile: Stop floating and just stack them */
    @media (max-width: 768px) {
        .highlights-canvas {
            display: flex;
            flex-direction: column;
            gap: 20px;
            min-height: auto;
        }
        .highlight-card-wrapper {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            width: 100%;
        }
    }
</style>