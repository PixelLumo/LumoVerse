<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        if (!auth()->check()) {
            return view('guest.posts');
        }
        // Add any data queries for logged-in users here if needed
        return view('posts');
    }
}
