<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\CommunityMemberSeeder;
use Database\Seeders\RuleSeeder;
use Database\Seeders\ChannelSeeder;
use Database\Seeders\MessageSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->count(50)->create();
    
        $this->call([
        CommunityMemberSeeder::class,
        RuleSeeder::class,
        ChannelSeeder::class,
        MessageSeeder::class,
    ]);
    }
}