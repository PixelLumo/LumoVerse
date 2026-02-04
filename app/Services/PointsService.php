<?php

namespace App\Services;

use App\Models\User;

class PointsService
{
    /**
     * Point constants for easy maintenance
     */
    const ACTION_POST_CREATED = 20;
    const ACTION_COMMENT_ADDED = 5;
    const ACTION_DAILY_LOGIN = 10;

    /**
     * Add points to a user for a specific action.
     */
    public function grantPoints(User $user, int $amount): void
    {
        $user->increment('points', $amount);
        
        // Optional: Trigger an event for a "Level Up" notification
        // if ($this->checkIfUserLeveledUp($user)) { ... }
    }

    public function grantDailyPoints(User $user): void
    {
        // If they already got points today, stop here
        if ($user->last_points_at && $user->last_points_at->isToday()) {
            return;
        }

        // Otherwise, give points and update the timestamp
        $user->update([
            'points' => $user->points + self::ACTION_DAILY_LOGIN,
            'last_points_at' => now(),
        ]);
    }
}