<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SupportController extends Controller
{
    // Show support page
    public function index()
    {
        if (!auth()->check()) {
            return view('guest.support');
        }
        // Add any data queries for logged-in users here if needed
        return view('support.index');
    }
}
