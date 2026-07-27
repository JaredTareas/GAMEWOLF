<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RestablecerContrasenaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'exists:users,email'],
            'token' => ['required', 'string'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols(),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'El correo electronico es obligatorio.',
            'email.email' => 'Ingresa un correo electronico valido.',
            'email.exists' => 'No existe una cuenta registrada con ese correo.',
            'token.required' => 'El token de recuperacion es obligatorio.',
            'password.required' => 'La nueva contrasena es obligatoria.',
            'password.confirmed' => 'La confirmacion de contrasena no coincide.',
        ];
    }
}
