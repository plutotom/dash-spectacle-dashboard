<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('Messages/Index', [
            'messages' => Message::latest()->paginate(25),
        ]);
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return redirect()->back()->with('success', 'Message deleted successfully');
    }

    public function update(Request $request, Message $message)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string|max:10000',
        ]);

        $message->update($validated);

        return redirect()->back()->with('success', 'Message updated successfully');
    }
}
