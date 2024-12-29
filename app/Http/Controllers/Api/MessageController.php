<?php

namespace App\Http\Controllers\Api;

use App\Events\orderCreated;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Http\Resources\MessageResource;
use Illuminate\Http\Request;
use App\Events\MessageCreated;
use Illuminate\Support\Facades\Broadcast;
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

        broadcast(new MessageCreated($message))->via('messages');

        
        Log::info('Broadcasting message', [
            'channel' => 'messages',
            'event' => 'MessageCreated',
            'message' => $message
        ]);
        

        return new MessageResource($message);
    }

    public function testBroadcast()
    {
        $message = Message::create([
            'content' => 'Test Message from Broadcast' . rand(1000,9999)
        ]);
        
        // Log::debug('About to broadcast message', ['message' => $message->toArray()]);
        
        // log out the details of laravels brodcast status and connection 
        // Log::debug('Laravel Broadcast Status', ['status' => config('broadcasting.default')]);
        // Log::debug('Laravel Broadcast Connection', ['connection' => config('broadcasting.connections.reverb')]);
        // Log::debug('Laravel Broadcast Connection v2', ['connection' => Broadcast::connection()]);
        // Log::debug('Laravel Broadcast Connection v3', ['connection' => Broadcast::connection('reverb')]);
        try {
            broadcast(new MessageCreated($message))->toOthers();
            broadcast(new orderCreated())->toOthers();

            Log::debug('Message broadcast attempted');
        } catch (\Exception $e) {
            Log::error('Broadcasting failed', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => 'Broadcasting failed: ' . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Event broadcasted with message: ' . $message->content
        ]);
    }
} 