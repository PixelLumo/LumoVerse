@php
    // Simple logic to pick a color based on the name string
    function getNameColor($name) {
        $hash = md5($name);
        // We use HSL because we can keep Saturation and Lightness constant 
        // This ensures the colors are always readable on dark backgrounds
        $hue = hexdec(substr($hash, 0, 6)) % 360; 
        return "hsl({$hue}, 70%, 70%)"; 
    }
@endphp
<x-app-layout>
    <script src="https://cdn.tailwindcss.com"></script>
    
    <div class="h-screen flex flex-col bg-gray-950">
        
        <div id="chat-window" class="flex-grow overflow-y-auto p-6 space-y-4 flex flex-col">
            @foreach($messages as $message)
                <div class="flex flex-col">
                    <div class="flex items-baseline space-x-2">
                        <span class="text-sm font-bold" style="color: {{ getNameColor($message->user->name) }}">
                            {{ $message->user->name }}
                        </span>
                        <span class="text-[10px] text-gray-500">{{ $message->created_at->format('H:i') }}</span>
                    </div>
                    <div class="bg-gray-900 text-gray-300 py-1 rounded-md max-w-3xl">
                        {{ $message->body }}
                    </div>
                </div>
            @endforeach
        </div>

        <div class="p-4 bg-gray-900 border-t border-gray-800">
            <form id="chat-form" class="flex gap-4 items-center max-w-7xl mx-auto">
                @csrf
                <input 
                    type="text" 
                    id="message-input"
                    name="body"
                    placeholder="Message #{{ $channel->name }}" 
                    class="flex-grow bg-gray-800 text-white rounded-lg border-none focus:ring-2 focus:ring-indigo-500 py-3 px-4"
                    autocomplete="off"
                >
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold transition">
                    Send
                </button>
            </form>
        </div>
    </div>

    <script>
        const chatWindow = document.getElementById('chat-window');
        const chatForm = document.getElementById('chat-form');
        const messageInput = document.getElementById('message-input');

        // 1. Scroll to bottom on load
        chatWindow.scrollTop = chatWindow.scrollHeight;

        // 2. Handle Submission
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (messageInput.value.trim() === '') return;

            // Here you would typically use fetch() or Axios to send to your Laravel controller
            console.log("Sending message:", messageInput.value);

            // Placeholder for the "Instant" feel (Optimistic UI)
            // In a real app, you'd wait for the server or use Echo/Pusher
            
            messageInput.value = ''; // Clear input
        });
    </script>
</x-app-layout>