<x-app-layout>
    <div class="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div class="w-full max-w-md bg-[rgba(15,15,23,0.85)] backdrop-blur-md rounded-xl shadow-lg p-8 z-10 relative">
            <h1 class="text-3xl font-bold text-center mb-6 text-pink-400">Create Your PixelLumo Account</h1>

            <form method="POST" action="{{ route('register') }}">
                @csrf

                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium mb-1">Name</label>
                        <input id="name" type="text" name="name" value="{{ old('name') }}" required autofocus
                            class="w-full rounded-lg px-4 py-2 bg-[rgba(20,12,36,0.8)] text-white border {{ $errors->has('name') ? 'border-red-500' : 'border-gray-600' }} focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-30">
                    @error('name')
                        <p class="text-red-400 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium mb-1">Email Address</label>
                        <input id="email" type="email" name="email" value="{{ old('email') }}" required
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

                <div class="mb-4 relative">
                    <label for="password_confirmation" class="block text-sm font-medium mb-1">Confirm Password</label>
                    <input id="password_confirmation" type="password" name="password_confirmation" required
                        class="w-full rounded-lg px-4 py-2 bg-[rgba(20,12,36,0.8)] text-white border border-gray-600 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-30 pr-14">

                    <button type="button" onclick="togglePassword('password_confirmation')"
                        class="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-2xl text-gray-400 hover:text-pink-400 focus:outline-none">
                        👁
                    </button>
                </div>

                <button type="submit"
                    class="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition">
                    Register
                </button>

                <p class="mt-6 text-center text-sm opacity-80">
                    Already have an account?
                    <a href="{{ route('login') }}" class="text-pink-400 hover:underline">Login Here</a>
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
