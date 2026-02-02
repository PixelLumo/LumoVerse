<x-app-layout title="Settings | PixelLumo">

    <div class="hero-box p-12 text-center">
        <h1 class="glow pink-text text-5xl md:text-6xl font-bold">Settings</h1>
        <p class="mt-4 text-lg md:text-xl opacity-80">Manage your account and preferences.</p>
    </div>

    <main class="max-w-4xl mx-auto my-8 px-4 sm:px-0 space-y-8">
        <section class="bg-gray-800 rounded-xl shadow p-6 space-y-4">
            <h2 class="text-2xl font-bold text-white mb-4">Profile Settings</h2>
            <form class="space-y-4">
                <div>
                    <label class="block mb-1 font-semibold text-white" for="display_name">Display Name</label>
                    <input id="display_name" type="text" class="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="Enter display name">
                </div>
                <div>
                    <label class="block mb-1 font-semibold text-white" for="email">Email</label>
                    <input id="email" type="email" class="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="Enter email">
                </div>
                <div>
                    <label class="block mb-1 font-semibold text-white" for="avatar">Avatar URL</label>
                    <input id="avatar" type="text" class="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white" placeholder="Enter avatar URL">
                </div>
                <div>
                    <label class="block mb-1 font-semibold text-white" for="bio">Bio</label>
                    <textarea id="bio" class="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white" rows="3" placeholder="Write a short bio"></textarea>
                </div>

                <div class="space-y-2">
                    <h3 class="font-semibold text-white">Privacy Controls</h3>
                    <label class="flex items-center gap-2">
                        <input type="checkbox" class="rounded" checked>
                        <span class="text-white">Profile Visibility: Public</span>
                    </label>
                </div>

                <div class="space-y-2">
                    <h3 class="font-semibold text-white">Notifications</h3>
                    <label class="flex items-center gap-2">
                        <input type="checkbox" class="rounded" checked>
                        <span class="text-white">App Notifications: All</span>
                    </label>
                    <label class="flex items-center gap-2">
                        <input type="checkbox" class="rounded">
                        <span class="text-white">Email me updates</span>
                    </label>
                    <label class="flex items-center gap-2">
                        <input type="checkbox" class="rounded">
                        <span class="text-white">Direct message alerts</span>
                    </label>
                </div>

                <div class="space-y-2">
                    <h3 class="font-semibold text-white">Theme</h3>
                    <select class="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white">
                        <option value="auto">Auto</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>

                <button type="submit" class="px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded font-bold text-white mt-4">Save Changes</button>
            </form>
        </section>

        <section class="bg-gray-800 rounded-xl shadow p-6 space-y-4">
            <h2 class="text-2xl font-bold text-white mb-4">Security</h2>
            <form class="space-y-4">
                <div>
                    <label class="block mb-1 font-semibold text-white" for="new_password">New Password</label>
                    <input id="new_password" type="password" class="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white">
                </div>
                <div>
                    <label class="block mb-1 font-semibold text-white" for="confirm_password">Confirm Password</label>
                    <input id="confirm_password" type="password" class="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white">
                </div>
                <div class="text-white/80">
                    <p>Enable 2FA (coming soon)</p>
                </div>
                <button type="submit" class="px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded font-bold text-white mt-2">Update Password</button>
            </form>
        </section>

        <section class="bg-gray-800 rounded-xl shadow p-6 space-y-4">
            <h2 class="text-2xl font-bold text-white mb-4">Delete Account</h2>
            <p class="text-white/80">Permanently remove your account and all data. This action cannot be undone.</p>
            <form>
                <button type="submit" class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-bold text-white">Delete My Account</button>
            </form>
        </section>

    </main>

</x-app-layout>
