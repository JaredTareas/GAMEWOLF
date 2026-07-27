<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GuardarUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Solo el administrador puede crear usuarios
        return $this->user()->rol === 'admin';
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            // Regla estricta de rúbrica: 8 caracteres, mayúscula, número, especial
            'password' => ['required', 'string', 'min:8', 'regex:/[A-Z]/', 'regex:/[0-9]/', 'regex:/[!@#$%^&*(),.?":{}|<>]/'],
            'rol' => ['required', 'in:admin,empleado,cliente'],
            'telefono' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s()]{8,15}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'password.regex' => 'La contraseña debe incluir al menos una mayúscula, un número y un carácter especial.',
        ];
    }
}