<?php

return [
    'client_id' => env('GOOGLE_PHOTOS_CLIENT_ID', ''),
    'client_secret' => env('GOOGLE_PHOTOS_CLIENT_SECRET', ''),
    'redirect_uri' => env('GOOGLE_PHOTOS_REDIRECT_URI', ''),
    'scopes' => [
        'https://www.googleapis.com/auth/photoslibrary.appendonly',
        'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata',
        'https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata',
        'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',
    ],
    'access_type' => 'offline',
    'approval_prompt' => 'force',
    'prompt' => 'consent', //"none", "consent", "select_account" default:none
];
