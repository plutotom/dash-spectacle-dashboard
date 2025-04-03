<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Models\ApiToken;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // Route::get('/messages/{count?}', [MessageController::class, 'index']);
    public function index($count = 5)
    {
        try {
            // Validate count parameter
            if ($count > 100) {
                return response()->json([
                    'error' => 'Maximum count limit is 100',
                ], 400);
            }

            $messages = Message::latest()
                ->take(max(1, min(100, $count)))
                ->get();

            return MessageResource::collection($messages);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch messages: '.$e->getMessage());

            return response()->json([
                'error' => 'Failed to fetch messages',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'content' => 'required|string|max:10000',
            ]);

            $token = $request->header('Authorization');
            // Remove 'Bearer ' if it exists
            $token = str_replace('Bearer ', '', $token);
            $apiToken = ApiToken::where('token', $token)->first();

            $message = Message::create([
                'name' => $apiToken->name,
                'content' => $request->content,
            ]);

            return response()->json(new MessageResource($message), 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create message: '.$e->getMessage(),
            ], 500);
        }
    }
}
