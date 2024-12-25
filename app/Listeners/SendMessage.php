<?php

namespace App\Listeners;

use App\Events\MessageCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendMessage
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MessageCreated $event): void
    {
        \Log::info('New message created and broadcasted', [
            'message_id' => $event->message->id,
            'content' => $event->message->content,
            'created_at' => $event->message->created_at,
            'channel' => 'messages' // This is the channel name from MessageCreated event
        ]);
    }
}
