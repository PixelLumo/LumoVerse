<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('home');
    }

    return view('index');
})->name('index');

//Route::middleware('auth')->group(function () {
    Route::get('/home', fn () => view('home'))->name('home');
    Route::get('/community', fn () => view('community'))->name('community');
    Route::get('/chat', fn () => view('chat'))->name('chat');
    Route::get('/posts', fn () => view('posts'))->name('posts');
    Route::get('/artz', fn () => view('artz'))->name('artz');
    Route::get('/squad', fn () => view('squad'))->name('squad');
    Route::get('/tutorials', fn () => view('tutorials'))->name('tutorials');
    Route::get('/roadmap', fn () => view('roadmap'))->name('roadmap');
    Route::get('/profile', fn () => view('profile'))->name('profile');
    Route::get('/settings', fn () => view('settings'))->name('settings');
    Route::get('/support', fn () => view('support'))->name('support');
    Route::get('/suggestions', fn () => view('suggestions'))->name('suggestions');

    Route::post('/logout', function () {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return redirect()->route('index');
    })->name('logout');
//});

Route::middleware('guest')->group(function () {
    Route::get('/login', fn () => view('auth.login'))->name('login');
    Route::get('/register', fn () => view('auth.register'))->name('register');
});

Route::get('/about', fn () => view('about'))->name('about');
Route::get('/rules', fn () => view('rules'))->name('rules');
Route::get('/terms', fn () => view('terms'))->name('terms');
Route::get('/privacy', fn () => view('privacy'))->name('privacy');

Route::get('/guest-home', fn () => view('guest-home'))->name('guest-home');
