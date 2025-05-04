<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'photos' => [
            'album_id' => env('GOOGLE_PHOTOS_ALBUM_ID'),
        ],

        'photo_picker' => [
            'client_id' => env('GOOGLE_PHOTOS_CLIENT_ID'),
            'client_secret' => env('GOOGLE_PHOTOS_CLIENT_SECRET'),
            'redirect_uri' => env('GOOGLE_PHOTOS_REDIRECT_URI'),
        ],

        'project_id' => env('GOOGLE_PROJECT_ID'),
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect_uri' => env('GOOGLE_REDIRECT_URI'),

        'calendars' => [
            'primary' => env('GOOGLE_CALENDAR_ID', 'primary'),
            'work' => env('GOOGLE_WORK_CALENDAR_ID'),
            'personal' => env('GOOGLE_PERSONAL_CALENDAR_ID'),
        ],
    ],

    'homeassistant' => [
        'url' => env('HOMEASSISTANT_URL'),
        'token' => env('HOMEASSISTANT_TOKEN'),
        'local_temperature_entity_id' => env('HOMEASSISTANT_LOCAL_TEMPERATURE_ENTITY_ID'),
    ],

    'weather' => [
        'api_key' => env('WEATHER_API_KEY', '64a59248de284a5a9c9183623242412'),
    ],

];
