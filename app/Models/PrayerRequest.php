<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrayerRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'notion_id',
        'name',
        'person',
        'is_answered',
        'answer',
        'prayer_date',
        'answered_at',
    ];

    protected $casts = [
        'is_answered' => 'boolean',
        'prayer_date' => 'date',
        'answered_at' => 'datetime',
    ];
}
