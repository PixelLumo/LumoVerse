<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Channel;

class ChannelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Channel::factory()
            ->count(3)
            ->sequence(
                ['name' => 'General', 'slug' => 'general'],
                ['name' => 'Programming', 'slug' => 'programming'],
                ['name' => 'Off-Topic', 'slug' => 'off-topic'],
            )
            ->create();
    }
}
