<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
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
            'content' => $this->faker->paragraph(),
            'name' => $this->faker->optional()->name(),
            'user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the message has no user.
     */
    public function withoutUser(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
        ]);
    }

    /**
     * Indicate that the message has no name.
     */
    public function withoutName(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => null,
        ]);
    }
}
