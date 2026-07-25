<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CrearPedidoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'detalles' => ['nullable', 'array'],
            'detalles.*.videojuego_id' => ['required_with:detalles', 'integer', 'exists:videojuegos,id'],
            'detalles.*.cantidad' => ['required_with:detalles', 'integer', 'min:1'],
        ];
    }
}
