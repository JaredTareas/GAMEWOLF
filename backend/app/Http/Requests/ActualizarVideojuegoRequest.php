<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ActualizarVideojuegoRequest extends FormRequest
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
            'titulo' => ['sometimes', 'required', 'string', 'max:150'],
            'descripcion' => ['sometimes', 'required', 'string', 'max:2000'],
            'plataforma' => ['sometimes', 'required', 'string', 'max:80'],
            'precio' => ['sometimes', 'required', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'imagen' => ['nullable', 'string', 'max:255'],
            'estado' => ['sometimes', 'required', 'in:activo,inactivo'],
            'genero_ids' => ['nullable', 'array'],
            'genero_ids.*' => ['integer', 'exists:generos,id'],
        ];
    }
}
