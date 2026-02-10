<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    public function submit(Request $request)
    {
        // Handle form submission
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        // Save suggestion, send email, etc.
        // Example:
        // Suggestion::create($data);

        return redirect()->back()->with('success', 'Suggestion submitted!');
    }
}
