<?php

namespace App\Http\Controllers;

use Illuminate\View\View;
use App\Models\Channel;


class ChatController extends Controller
{
    public function index(): View
    {
        $channels = Channel::all();

        return view('chat', compact('channels'));
    }

    public function show(Channel $channel)
    {
        $messages = $channel->messages()->with('user')->latest()->take(50)->get()->reverse();

        return view('channels.show', compact('channel', 'messages'));
    }
}