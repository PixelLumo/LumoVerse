<header>
    <!-- Right-aligned standout header -->
    <div class="hero-box relative"> 
        <div class="hero-header"> 
            <h1 class="text-sm md:text-xl text-neon-accent uppercase tracking-[2px] hover:scale-105 transition-transform duration-200">
            Level Up Your Pixels
            </h1>
            </div>

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
