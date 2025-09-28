<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'apr_bps' => ['required', 'integer', 'min:0', 'max:5000'],
            'day_count_basis' => ['required', 'in:actual_365'],
            'started_at' => ['required', 'date'],
        ];
    }
}



