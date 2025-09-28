<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLoanEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:disbursement,payment'],
            'amount_cents' => ['required', 'integer'], // positive for disbursement, negative for payment
            'effective_at' => ['required', 'date'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}

