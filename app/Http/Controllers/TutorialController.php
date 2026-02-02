<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TutorialController extends Controller
{
    public function index()
    {
        if (!auth()->check()) {
            return view('guest.tutorials');
        }
        // Add any data queries for logged-in users here if needed
        return view('tutorials');
    }

    public function create()
    {
        return view('tutorials.create');
    }
}
