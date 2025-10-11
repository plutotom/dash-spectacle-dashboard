<?php

namespace Tests\Feature\Messages;

use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_access_public_feed(): void
    {
        $response = $this->getJson('/messages/feed');
        $response->assertOk();
    }

    public function test_authenticated_user_can_view_feed_with_full_names(): void
    {
        $userA = User::factory()->create(['first_name' => 'Ada', 'last_name' => 'Lovelace']);
        $userB = User::factory()->create(['first_name' => 'Alan', 'last_name' => 'Turing']);
        Message::factory()->for($userA)->create(['content' => 'Hello from Ada']);
        Message::factory()->for($userB)->create(['content' => 'Hello from Alan']);

        $viewer = User::factory()->create();
        $this->actingAs($viewer);

        $response = $this->getJson('/messages/feed');
        $response->assertOk();
        $response->assertJsonStructure(['data' => [['id', 'content', 'created_at', 'name']]]);
        $names = collect($response->json('data'))->pluck('name');
        $this->assertTrue($names->contains('Ada Lovelace'));
        $this->assertTrue($names->contains('Alan Turing'));
    }
}
