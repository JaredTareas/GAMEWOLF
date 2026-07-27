<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActualizarUsuarioRequest;
use App\Http\Requests\GuardarUsuarioRequest;
use App\Http\Resources\UsuarioResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UsuarioController extends Controller
{
    public function index(Request $request)
    {
        $usuarios = User::query()
            ->when($request->filled('rol'), fn ($query) => $query->where('rol', $request->string('rol')))
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search');
                $query->where(function ($inner) use ($search) {
                    $inner->where('nombre', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return UsuarioResource::collection($usuarios);
    }

    // Crear usuario
    public function store(GuardarUsuarioRequest $request): UsuarioResource
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $usuario = User::create($data);

        return new UsuarioResource($usuario);
    }

    public function show(User $usuario): UsuarioResource
    {
        return new UsuarioResource($usuario);
    }

    public function update(ActualizarUsuarioRequest $request, User $usuario): UsuarioResource
    {
        $data = $request->validated();

        if (array_key_exists('password', $data) && blank($data['password'])) {
            unset($data['password']);
        }

        $usuario->update($data);

        return new UsuarioResource($usuario);
    }

    public function actualizarFotoPerfil(Request $request, User $usuario): UsuarioResource
    {
        if ($request->user()->id !== $usuario->id && $request->user()->rol !== 'admin') {
            abort(403, 'No tienes permiso para actualizar esta foto de perfil.');
        }

        $request->validate([
            'foto_perfil' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ], [
            'foto_perfil.required' => 'Selecciona una foto de perfil.',
            'foto_perfil.image' => 'El archivo debe ser una imagen.',
            'foto_perfil.mimes' => 'La foto debe ser JPG, PNG o WEBP.',
            'foto_perfil.max' => 'La foto no debe pesar mas de 2 MB.',
        ]);

        if ($usuario->imagen_perfil && str_starts_with($usuario->imagen_perfil, '/storage/perfiles/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $usuario->imagen_perfil));
        }

        $path = $request->file('foto_perfil')->store('perfiles', 'public');
        $usuario->update(['imagen_perfil' => "/storage/{$path}"]);

        return new UsuarioResource($usuario);
    }

    //Eliminar usuario
    public function destroy(Request $request, User $usuario)
    {
        if ($request->user()->id === $usuario->id) {
            return response()->json(['mensaje' => 'No puedes eliminar tu propia cuenta.'], 403);
        }
        
        $usuario->delete();
        return response()->json(['mensaje' => 'Usuario eliminado correctamente.']);
    }
}
