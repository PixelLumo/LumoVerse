<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GuestOnly
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $redirectTo
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $redirectTo = '/home')
    {
        if (Auth::check()) {
            // User is logged in, redirect them
            return redirect($redirectTo);
        }

        // User is a guest, allow request
        return $next($request);
    }
}
