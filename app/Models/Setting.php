<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    /**
     * Get a setting value by key.
     */
    public static function get(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();

        if (! $setting) {
            return $default;
        }

        return $setting->value;
    }

    /**
     * Set a setting value by key.
     */
    public static function set(string $key, $value): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );

        // Clear the public settings cache when any setting is updated
        Cache::forget('settings_public');
    }

    /**
     * Get all public settings (cached).
     */
    public static function getPublic(): array
    {
        return Cache::remember('settings_public', 30, function () {
            return static::whereIn('key', [
                'show_prayer_requests',
                // Add more public settings here as needed
            ])->pluck('value', 'key')->toArray();
        });
    }
}
