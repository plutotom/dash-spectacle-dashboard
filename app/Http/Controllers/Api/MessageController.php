<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Models\ApiToken;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::latest()->take(8)->get();

        return MessageResource::collection($messages);
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
