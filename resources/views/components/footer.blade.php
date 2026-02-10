<footer class="app-footer">
    <div class="max-w-4xl mx-auto">
        <p class="font-friendly text-[12px] text-text-muted mb-2 italic">
            &copy; {{ date('Y') }} <span class="text-neon-primary">PixelLumo</span>. All rights reserved.
        </p>
            <nav class="flex flex-wrap justify-center gap-x-4 gap-y-2 font-friendly text-[13px]">
                <a href="{{ route('privacy') }}" class="text-neon-primary hover:text-neon-accent drop-shadow-[0_0_5px_var(--neon-primary)] transition-all">Privacy Policy</a>
                <span class="text-slate-700 select-none">|</span>
                <a href="{{ route('terms') }}" class="text-neon-primary hover:text-neon-accent drop-shadow-[0_0_5px_var(--neon-primary)] transition-all">Terms of Service</a>
                <span class="text-slate-700 select-none">|</span>
                <a href="{{ route('rules') }}" class="text-neon-primary hover:text-neon-accent drop-shadow-[0_0_5px_var(--neon-primary)] transition-all">Rules</a>
                <span class="text-slate-700 select-none">|</span>
                <a href="{{ route('about') }}" class="text-neon-primary hover:text-neon-accent drop-shadow-[0_0_5px_var(--neon-primary)] transition-all">About</a>
                <span class="text-slate-700 select-none">|</span>
                <a href="{{ route('support') }}" class="text-neon-primary hover:text-neon-accent drop-shadow-[0_0_5px_var(--neon-primary)] transition-all">Support</a>
            </nav>
    </div>
</footer>
