<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index()
    {
        $this->authorizeAdmin();

        return Inertia::render('Users/Manage', [
            'users' => User::orderByDesc('id')->paginate(25),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'role' => ['required', 'string', 'in:admin,user'],
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated');
    }

    public function destroy(User $user)
    {
        $this->authorizeAdmin();
        $user->delete();

        return redirect()->back()->with('success', 'User deleted');
    }

    private function authorizeAdmin(): void
    {
        $user = request()->user();
        abort_unless($user && ($user->role === 'admin'), 403);
    }
}
