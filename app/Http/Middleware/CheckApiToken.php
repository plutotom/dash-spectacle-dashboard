<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Closure;
use Illuminate\Http\Request;

class CheckApiToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Authorization');
        // Remove 'Bearer ' if it exists
        $token = str_replace('Bearer ', '', $token);

        // Check if token exists in database
        if (! ApiToken::where('token', $token)->exists()) {
            return response()->json([
                'error' => $token.': Is not a valid token',
            ], 401);
        }

        return $next($request);
    }
}
