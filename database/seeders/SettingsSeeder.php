<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('settings')->insert([
            'key' => 'show_prayer_requests',
            'value' => json_encode(true),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
