<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationStoresNamesTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_stores_first_and_last_name(): void
    {
        $response = $this->post(route('register'), [
            'first_name' => 'Grace',
            'last_name' => 'Hopper',
            'email' => 'grace@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertDatabaseHas('users', [
            'email' => 'grace@example.com',
            'first_name' => 'Grace',
            'last_name' => 'Hopper',
        ]);
    }
}
