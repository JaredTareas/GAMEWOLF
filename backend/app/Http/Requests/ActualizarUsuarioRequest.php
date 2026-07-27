<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->id === $this->route('usuario')->id || $this->user()->rol === 'admin';
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = [
            'nombre' => ['required', 'string', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s()]{8,15}$/'],
        ];

        if ($this->user()->rol === 'admin') {
            $rules['rol'] = ['required', 'in:admin,empleado,cliente'];
            $rules['email'] = ['required', 'email', 'unique:users,email,' . $this->route('usuario')->id];
            $rules['password'] = [
                'sometimes',
                'nullable',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[!@#$%^&*(),.?":{}|<>]/',
            ];
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio.',
            'telefono.regex' => 'El formato del telefono no es valido.',
            'telefono.max' => 'El telefono es demasiado largo.',
            'password.min' => 'La contrasena debe tener al menos 8 caracteres.',
            'password.regex' => 'La contrasena debe incluir al menos una mayuscula, un numero y un caracter especial.',
        ];
    }
}
