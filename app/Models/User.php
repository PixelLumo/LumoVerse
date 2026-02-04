<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_points_at' => 'datetime',
        ];
    }

    public function getRankAttribute(): string
    {
        return match (true) {
            $this->points >= 1000 => 'Grand Architect',
            $this->points >= 500  => 'Master Artisan',
            $this->points >= 100  => 'Creator',
            default               => 'Novice',
        };
    }
}
