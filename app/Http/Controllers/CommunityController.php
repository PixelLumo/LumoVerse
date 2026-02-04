<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CommunityMember;
use App\Models\User;
use App\Models\Rule;
use App\Services\PointsService; 

class CommunityController extends Controller
{
    public function index(PointsService $pointsService)
    {
        // Guest redirect to guest.community view
        //if (!auth()->check()) {
        //    return view('guest.community');
        //}

        $users = User::select('*')
            ->selectRaw('points as score') 
            ->orderBy('score', 'desc')
            ->limit(10)
            ->get();
        $rules = Rule::all();

        $featuredMembers = CommunityMember::where('is_featured', true)->get();
        $totalMembers = CommunityMember::count();

        if ($user = auth()->user()) {
            // Warning: This gives points on every page refresh! 
            // Better to use ACTION_DAILY_LOGIN here instead of POST_CREATED
            $pointsService = app(PointsService::class);
            $pointsService->grantPoints($user, PointsService::ACTION_DAILY_LOGIN);
        }
        return view('community', compact('featuredMembers', 'totalMembers', 'users', 'rules', 'pointsService'));
    }
}
