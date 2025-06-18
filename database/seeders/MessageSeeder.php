<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users or create some if none exist
        $users = User::all();

        if ($users->isEmpty()) {
            $users = User::factory(3)->create();
        }

        // Create messages with users
        Message::factory(20)
            ->recycle($users)
            ->create();

        // Create some messages without users
        Message::factory(5)
            ->withoutUser()
            ->create();

        // Create some messages without names
        Message::factory(3)
            ->recycle($users)
            ->withoutName()
            ->create();

        // Create some specific test messages
        $testUser = User::where('email', 'plutotom@Live.com')->first();

        if ($testUser) {
            Message::factory()->create([
                'content' => 'This is a test message from Isaiah',
                'name' => 'Isaiah',
                'user_id' => $testUser->id,
            ]);

            Message::factory()->create([
                'content' => 'Another test message for testing purposes',
                'name' => 'Test User',
                'user_id' => $testUser->id,
            ]);
        }
    }
}
