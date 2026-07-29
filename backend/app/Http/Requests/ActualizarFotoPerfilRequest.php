<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarFotoPerfilRequest extends FormRequest
{
    public function authorize(): bool
    {
        $usuarioObjetivo = $this->route('usuario');

        return $this->user()->id === $usuarioObjetivo->id || $this->user()->rol === 'admin';
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'foto_perfil' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'foto_perfil.required' => 'Selecciona una foto de perfil.',
            'foto_perfil.image' => 'El archivo debe ser una imagen.',
            'foto_perfil.mimes' => 'La foto debe ser JPG, PNG o WEBP.',
            'foto_perfil.max' => 'La foto no debe pesar mas de 2 MB.',
        ];
    }
}
