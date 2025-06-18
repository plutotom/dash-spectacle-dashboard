<?php

namespace Database\Seeders;

use App\Models\User;
use Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => Hash::make('test-user-password'),
            ],
            [
                'name' => 'Isaiah',
                'email' => 'plutotom@Live.com',
                'password' => Hash::make('isaiah-test-token'),
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        $user = User::where('email', 'plutotom@Live.com')->first();
        if (! $user->apiTokens()->where('token', 'noah-is-kinda-sexy-and-has-a-good-body-and-is-a-good-person-and-is-a-good-friend-but-he-better-stay-alive-longer-then-he-plans-of-his-like-27-years-so-he-better-be-a-good-boy')->exists()) {
            $user->apiTokens()->create([
                'name' => 'Noah',
                'token' => 'noah-is-kinda-sexy-and-has-a-good-body-and-is-a-good-person-and-is-a-good-friend-but-he-better-stay-alive-longer-then-he-plans-of-his-like-27-years-so-he-better-be-a-good-boy',
            ]);
        }

        $user->apiTokens()->create([
            'name' => 'Chloe',
            'token' => 'chloe-is-sexy-and-i-love you very much!',
        ]);

        $user->apiTokens()->create([
            'name' => 'Isaiah',
            'token' => 'isaiah-test-token',
        ]);

        // $user->apiTokens()->create([
        //     'name' => 'Levi',
        //     'token' => 'levi-rocks-only-sometimes-but-hes-good-at-5-player-solatary',
        // ]);

        // $user->apiTokens()->create([
        //     'name' => 'Michael',
        //     'token' => 'Michael-is-gay-but-thats-ok',
        // ]);

        // $user->apiTokens()->create([
        //     'name' => 'Linden',
        //     'token' => 'London or linden what meat did you eat last',
        // ]);

        // $user->apiTokens()->create([
        //     'name' => 'Mis. A',
        //     'token' => 'The father in law……..',
        // ]);

        // $user->apiTokens()->create([
        //     'name' => 'Maddie',
        //     'token' => 'The pro pdf reader',
        // ]);

        // $user->apiTokens()->create([
        //     'name' => 'Mother mother',
        //     'token' => 'Sharpie or shary or sheriey who knows',
        // ]);

        // Call the MessageSeeder
        // $this->call([
        //     MessageSeeder::class,
        // ]);
    }
}
