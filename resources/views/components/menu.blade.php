<div class="custom-menu-wrapper">
    <button id="menu-toggle" class="custom-menu-btn">
        MENU
    </button>

    <aside id="sidebar" class="custom-sidebar">
        <nav class="custom-menu-list">

            <!-- Theme Switcher -->
            <div class="theme-switcher">
                <button class="theme-btn" data-theme="cyber">Cyber</button>
                <button class="theme-btn" data-theme="synthwave">Synthwave</button>
                <button class="theme-btn" data-theme="noir">Noir</button>
                <button class="theme-btn" data-theme="vapor">Vapor</button>
            </div>

            <a href="{{ route('home') }}" class="menu-link">Home</a>
            <a href="{{ route('community') }}" class="menu-link">Community</a>
            <a href="{{ route('chat') }}" class="menu-link">Chats</a>
            <a href="{{ route('artz') }}" class="menu-link">Artz</a>
            <a href="{{ route('posts') }}" class="menu-link">Posts</a>
            <a href="{{ route('squad') }}" class="menu-link">Squad</a>
            <a href="{{ route('tutorials') }}" class="menu-link">Tutorials</a>
            <a href="{{ route('roadmap') }}" class="menu-link">Roadmap</a>
            <a href="{{ route('about') }}" class="menu-link">About</a>
            <a href="{{ route('rules') }}" class="menu-link">Rules</a>
            <a href="{{ route('profile') }}" class="menu-link">Profile</a>
            <a href="{{ route('settings') }}" class="menu-link">Settings</a>
            <a href="{{ route('suggestions') }}" class="menu-link">Suggestions</a>
            <a href="{{ route('support') }}" class="menu-link">Support</a>

            @auth
                <a href="{{ route('logout') }}"
                   onclick="event.preventDefault(); document.getElementById('logout-form').submit();"
                   class="menu-link">Logout</a>

                <form id="logout-form" action="{{ route('logout') }}" method="POST" class="hidden">
                    @csrf
                </form>
            @endauth

            @guest
                <a href="{{ route('login') }}" class="menu-link">Log In / Sign Up</a>
            @endguest
        </nav>
    </aside>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;

    if (!btn || !sidebar) return;

    // MENU TOGGLE
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        body.classList.toggle('menu-open');
    });

    document.addEventListener('click', function (e) {
        if (!sidebar.contains(e.target) && e.target !== btn) {
            body.classList.remove('menu-open');
        }
    });

    // THEME SWITCHER
    const themeButtons = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        body.classList.add(`theme-${savedTheme}`);
    } else {
        body.classList.add('theme-cyber');
    }

    themeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const theme = this.dataset.theme;

            body.classList.remove('theme-cyber', 'theme-synthwave', 'theme-noir', 'theme-vapor');
            body.classList.add(`theme-${theme}`);

            localStorage.setItem('theme', theme);
        });
    });
});
</script>
