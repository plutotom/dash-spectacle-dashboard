<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HabitifyHabit extends Model
{
    protected $fillable = [
        'habitify_id',
        'name',
        'is_archived',
        'start_date',
        'time_of_day',
        'goal',
        'goal_history_items',
        'log_method',
        'recurrence',
        'remind',
        'area',
        'created_date',
        'priority',
    ];

    protected $casts = [
        'is_archived' => 'boolean',
        'start_date' => 'datetime',
        'time_of_day' => 'array',
        'goal' => 'array',
        'goal_history_items' => 'array',
        'remind' => 'array',
        'area' => 'array',
        'created_date' => 'datetime',
        'priority' => 'float',
    ];
}
