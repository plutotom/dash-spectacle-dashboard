<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrayerRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'notion_id',
        'prayer_request_from',
        'prayer_for',
        'is_answered',
        'prayer_request',
        'answered_at',
    ];

    protected $casts = [
        'is_answered' => 'boolean',
        'answered_at' => 'datetime',
    ];
}
