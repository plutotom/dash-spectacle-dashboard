<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessagesController extends Controller
{
    public function index()
    {
        $this->authorizeAdmin();

        return Inertia::render('Messages/Manage', [
            'messages' => Message::with('user')->latest()->paginate(25),
        ]);
    }

    public function feed(Request $request)
    {
        $messages = Message::with('user')
            ->latest()
            ->take(100)
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'content' => $m->content,
                'created_at' => $m->created_at,
                'name' => $m->user?->full_name ?? 'Unknown',
            ]);

        return response()->json(['data' => $messages]);
    }

    public function store(Request $request)
    {
        abort_unless($request->user() !== null, 403);
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:10000'],
        ]);

        $message = Message::create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        return response()->json([
            'data' => [
                'id' => $message->id,
                'content' => $message->content,
                'created_at' => $message->created_at,
            ],
        ], 201);
    }

    public function update(Request $request, Message $message)
    {
        $this->authorizeAdmin();
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:10000'],
        ]);
        $message->update($validated);

        return redirect()->back()->with('success', 'Message updated');
    }

    public function destroy(Message $message)
    {
        $this->authorizeAdmin();
        $message->delete();

        return redirect()->back()->with('success', 'Message deleted');
    }

    private function authorizeAdmin(): void
    {
        $user = request()->user();
        abort_unless($user && ($user->role === 'admin'), 403);
    }
}
