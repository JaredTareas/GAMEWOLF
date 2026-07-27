<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActualizarUsuarioRequest;
use App\Http\Requests\GuardarUsuarioRequest;
use App\Http\Resources\UsuarioResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
        $usuario->update($request->validated());
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