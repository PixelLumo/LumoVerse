<x-app-layout>
    <div class="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div class="w-full max-w-md bg-[#0f0f17]/90 backdrop-blur-md rounded-xl shadow-lg p-8 relative">
            <h1 class="text-2xl md:text-3xl font-bold text-center mb-6 text-pink-400">
                Verify Your Email Address
            </h1>

            <div class="space-y-4 text-center text-white/90 text-sm md:text-base">
                @if (session('resent'))
                    <div class="bg-green-600/20 text-green-400 p-3 rounded-lg shadow-inner">
                        A fresh verification link has been sent to your email address.
                    </div>
                @endif

                <p>Before proceeding, please check your email for a verification link.</p>
                <p>If you did not receive the email,</p>

                <form method="POST" action="{{ route('verification.resend') }}" class="inline">
                    @csrf
                    <button type="submit" class="text-pink-400 hover:text-pink-500 underline font-semibold">
                        click here to request another
                    </button>.
                </form>
            </div>
        </div>
    </div>
</x-app-layout>
