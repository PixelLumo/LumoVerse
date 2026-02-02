<x-app-layout>
    <div class="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div class="w-full max-w-md bg-[rgba(15,15,23,0.85)] backdrop-blur-md rounded-xl shadow-lg p-8 z-10 relative">
            <h1 class="text-3xl font-bold text-center mb-6 text-pink-400">Login to PixelLumo</h1>

            <form method="POST" action="{{ route('login') }}">
                @csrf

                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium mb-1">Email Address</label>
                        <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus
                            class="w-full rounded-lg px-4 py-2 bg-[rgba(20,12,36,0.8)] text-white border {{ $errors->has('email') ? 'border-red-500' : 'border-gray-600' }} focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-30">
                    @error('email')
                        <p class="text-red-400 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4 relative">
                    <label for="password" class="block text-sm font-medium mb-1">Password</label>
                        <input id="password" type="password" name="password" required
                            class="w-full rounded-lg px-4 py-2 bg-[rgba(20,12,36,0.8)] text-white border {{ $errors->has('password') ? 'border-red-500' : 'border-gray-600' }} focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-30 pr-14">

                    <button type="button" onclick="togglePassword('password')"
                        class="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-2xl text-gray-400 hover:text-pink-400 focus:outline-none">
                        👁
                    </button>

                    @error('password')
                        <p class="text-red-400 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4 flex items-center">
                    <input id="remember" type="checkbox" name="remember"
                        class="h-4 w-4 text-pink-500 focus:ring-pink-400 border-gray-600 rounded" {{ old('remember') ? 'checked' : '' }}>
                    <label for="remember" class="ml-2 text-sm">Remember Me</label>
                </div>

                <button type="submit"
                    class="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition">
                    Login
                </button>

                @if (Route::has('password.request'))
                <p class="mt-4 text-center text-sm opacity-70">
                    <a href="{{ route('password.request') }}" class="text-pink-400 hover:underline">
                        Forgot Your Password?
                    </a>
                </p>
                @endif

                <p class="mt-6 text-center text-sm opacity-80">
                    Don’t have an account?
                    <a href="{{ route('register') }}" class="text-pink-400 hover:underline">Sign Up Free</a>
                </p>
            </form>
        </div>
    </div>

    @push('scripts')
    <script>
        function togglePassword(id) {
            const input = document.getElementById(id);
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    </script>
    @endpush
</x-app-layout>
