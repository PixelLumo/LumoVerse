<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CommunityController extends Controller
{
    public function index()
    {
        // Guest redirect to guest.community view
        if (!auth()->check()) {
            return view('guest.community');
        }

        $featuredMembers = \App\Models\User::where('is_featured', true)->get();
        $totalMembers = \App\Models\User::count();

        return view('community', compact('featuredMembers', 'totalMembers'));
    }
}
