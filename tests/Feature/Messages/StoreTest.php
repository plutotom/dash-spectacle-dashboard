<?php

namespace Tests\Feature\Messages;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_post_message(): void
    {
        $response = $this->postJson('/messages', ['content' => 'Hello']);
        $response->assertStatus(302);
    }

    public function test_authenticated_user_can_post_message(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/messages', ['content' => 'Hello world']);
        $response->assertCreated();
        $this->assertDatabaseHas('messages', [
            'user_id' => $user->id,
            'content' => 'Hello world',
        ]);
    }

    public function test_name_field_is_ignored(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/messages', ['content' => 'Hello', 'name' => 'Hacker']);
        $response->assertCreated();
        $this->assertDatabaseHas('messages', [
            'user_id' => $user->id,
            'content' => 'Hello',
        ]);
    }
}
