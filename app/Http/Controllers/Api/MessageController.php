<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Http\Resources\MessageResource;
use Illuminate\Http\Request;
use App\Events\MessageCreated;
use Log;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::latest()->take(3)->get();
        return MessageResource::collection($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $message = Message::create([
            'content' => $request->content,
        ]);



        broadcast(new MessageCreated($message))->toOthers();
        Log::info('Message created', [
            'id' => $message->id,
            'content' => $message->content,
            'created_at' => $message->created_at,
        ]);
        return new MessageResource($message);
    }
} 