<?php

namespace App\Http\Controllers;

use App\Models\ApiToken;
use Illuminate\Http\Request;

class ApiTokenController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'token' => ['required', 'string', 'unique:api_tokens,token'],
        ]);

        $token = $request->user()->apiTokens()->create($validated);

        // return response()->json($token);
        return redirect()->route('profile.edit');
    }

    public function update(Request $request, ApiToken $token)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'token' => ['required', 'string', 'unique:api_tokens,token,'.$token->id],
        ]);

        $token->update($validated);

        // return response()->json($token);
        return redirect()->route('profile.edit');
    }

    public function destroy(ApiToken $token)
    {
        $token->delete();

        // return response()->json(['message' => 'Token deleted']);
        return redirect()->route('profile.edit');
    }
}
