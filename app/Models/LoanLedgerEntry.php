<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanLedgerEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'loan_id',
        'type',
        'amount_cents',
        'effective_at',
        'note',
    ];

    protected $casts = [
        'effective_at' => 'datetime',
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }
}

