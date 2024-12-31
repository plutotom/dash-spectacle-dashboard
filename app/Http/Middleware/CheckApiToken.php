<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckApiToken
{
    // You could move these to your .env file
    private $validTokens = [
        'levi-rocks-only-sometimes-but-hes-good-at-5-player-solatary',
        'noah-is-kinda-sexy-and-has-a-good-body-and-is-a-good-person-and-is-a-good-friend-but-hes-a-bit-of-a-dumb-dumb',
        'who-is-this?-it-seems-you-got-the-extra-key-for-non-as-importent-ppl',
        'hey-chloe,-your-dope-and-i-love-you',
        'isaiah-test-token',
    ];

    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Authorization');
        // Remove 'Bearer ' if it exists
        $token = str_replace('Bearer ', '', $token);

        // \Log::info('Token: ' . $token . ' - ' . in_array($token, $this->validTokens) . ' - ' . $request->all());
        if (! in_array($token, $this->validTokens)) {
            return response()->json([
                'error' => 'Invalid token',
            ], 401);
        }

        return $next($request);
    }
}
