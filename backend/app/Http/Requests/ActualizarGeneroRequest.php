<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActualizarGeneroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => [
                'required',
                'string',
                'max:80',
                Rule::unique('generos', 'nombre')->ignore($this->route('genero')?->id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del genero es obligatorio.',
            'nombre.max' => 'El nombre del genero no debe superar 80 caracteres.',
            'nombre.unique' => 'Ya existe un genero con ese nombre.',
        ];
    }
}
