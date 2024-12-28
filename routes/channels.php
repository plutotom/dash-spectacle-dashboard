<?php

use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('messages', function ($user) {
    \Log::info('Broadcasting message', [
        'channel' => 'messages',
        'user' => $user
    ]);
    return true; // Or add your authorization logic here
});


Broadcast::channel('orders', function ($user) {
    \Log::info('Broadcasting order', [
        'channel' => 'orders',
        'user' => $user
    ]);
    return true;
});
