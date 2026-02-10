<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Message;
use App\Models\User;
use App\Models\Channel;
use Illuminate\Support\Str;

class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'body' => $this->faker->realText(50),
            'user_id' => User::first()->id ?? User::factory(),
            'channel_id' => Channel::first()->id ?? Channel::factory(),
        ];
    }
}
