<?php

namespace App\Http\Controllers;

use Google_Client;
use Illuminate\Http\Request;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        $client = new Google_Client;
        $client->setClientId(config('google.client_id'));
        $client->setClientSecret(config('google.client_secret'));
        $client->setRedirectUri(route('google.callback'));
        $client->setScopes(['https://www.googleapis.com/auth/photoslibrary.readonly']);
        $client->setAccessType('offline');
        $client->setPrompt('consent');

        return redirect($client->createAuthUrl());
    }

    public function handleGoogleCallback(Request $request)
    {
        if ($request->has('error')) {
            return redirect()->route('google.setup')
                ->with('error', 'Google authentication failed');
        }

        $client = new Google_Client;
        $client->setClientId(config('google.client_id'));
        $client->setClientSecret(config('google.client_secret'));
        $client->setRedirectUri(route('google.callback'));

        $token = $client->fetchAccessTokenWithAuthCode($request->get('code'));

        if (isset($token['refresh_token'])) {
            auth()->user()->update([
                'google_refresh_token' => $token['refresh_token'],
            ]);

            return redirect()->route('google.setup')
                ->with('success', 'Google Photos connected successfully!');
        }

        return redirect()->route('google.setup')
            ->with('error', 'Failed to get refresh token');
    }

    public function setup()
    {
        $isConnected = ! empty(auth()->user()->google_refresh_token);

        return inertia('GooglePhotos/Setup', [
            'isConnected' => $isConnected,
        ]);
    }
}
