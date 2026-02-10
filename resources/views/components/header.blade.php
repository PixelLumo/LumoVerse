<header>
    <!-- Right-aligned standout header -->
    <div class="hero-header">
        <h1 class="glow-primary">Level Up Your Pixels</h1>

        @auth
            <a href="{{ route('logout') }}"
            onclick="event.preventDefault(); document.getElementById('logout-form').submit();"
            class="menu-link logout-link">
                Logout
            </a>

            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="hidden">
                @csrf
            </form>
        @endauth

        @guest
            <a href="{{ route('login') }}" class="menu-link login-link">
                Log In/Sign Up
            </a>
        @endguest

    </div>
</header>
