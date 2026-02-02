<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    // Dashboard/Home for authenticated users
    public function index()
    {
        // Future: load user-specific data
        return view('home');
    }

    public function posts()
    {
        // Future: fetch posts for authenticated user
        return view('posts');
    }

    public function tutorials()
    {
        // Future: fetch tutorials for authenticated user
        return view('tutorials');
    }

    public function settings()
    {
        // Future: load user settings
        return view('settings');
    }

    public function artz()
    {
        return view('artz');
    }

    public function squad()
    {
        return view('squad');
    }

    public function community()
    {
        return view('community');
    }

    public function roadmap()
    {
        return view('roadmap');
    }

    public function about()
    {
        return view('about');
    }

    public function rules()
    {
        return view('rules');
    }

    public function terms()
    {
        return view('terms');
    }

    public function privacy()
    {
        return view('privacy');
    }

    public function chat()
    {
        return view('chat');
    }
}
