<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Un usuario solo puede editar su propio perfil, a menos que sea administrador
        return $this->user()->id === $this->route('usuario')->id || $this->user()->rol === 'admin';
    }

    public function rules(): array
    {
        $rules = [
            'nombre' => ['required', 'string', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s()]{8,15}$/'],
        ];

        // Permisos extendidos si el usuario autenticado es administrador
        if ($this->user()->rol === 'admin') {
            $rules['rol'] = ['required', 'in:admin,empleado,cliente'];
            $rules['email'] = ['required', 'email', 'unique:users,email,' . $this->route('usuario')->id];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio.',
            'telefono.regex' => 'El formato del teléfono no es válido.',
            'telefono.max' => 'El teléfono es demasiado largo.',
        ];
    }
}