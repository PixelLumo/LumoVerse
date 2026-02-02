<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppLayoutController extends Controller
{
    /**
     * Show a page using the app layout.
     *
     * @return \Illuminate\View\View
     */
    public function show()
    {
        // Example: return a view using the layouts.app blade
        return view('layouts.app');
    }
}
