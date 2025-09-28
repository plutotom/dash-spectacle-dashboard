<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'apr_bps',
        'day_count_basis',
        'started_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
    ];

    public function entries(): HasMany
    {
        return $this->hasMany(LoanLedgerEntry::class);
    }
}

