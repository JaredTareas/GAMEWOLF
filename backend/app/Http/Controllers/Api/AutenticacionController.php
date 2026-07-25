<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\IniciarSesionRequest;
use App\Http\Requests\Auth\RegistrarUsuarioRequest;
use App\Http\Resources\UsuarioResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AutenticacionController extends Controller
{
    public function registrar(RegistrarUsuarioRequest $request): JsonResponse
    {
        $user = User::create([
            ...$request->safe()->except('password'),
            'rol' => User::ROL_CLIENTE,
            'password' => Hash::make($request->validated('password')),
        ]);

        return response()->json([
            'mensaje' => 'Cuenta registrada correctamente.',
            'usuario' => new UsuarioResource($user),
            'token' => $user->createToken('gamewolf-api')->plainTextToken,
        ], 201);
    }

    public function iniciarSesion(IniciarSesionRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            return response()->json(['mensaje' => 'Credenciales incorrectas.'], 401);
        }

        return response()->json([
            'mensaje' => 'Sesion iniciada correctamente.',
            'usuario' => new UsuarioResource($user),
            'token' => $user->createToken('gamewolf-api')->plainTextToken,
        ]);
    }

    public function perfil(Request $request): UsuarioResource
    {
        return new UsuarioResource($request->user());
    }

    public function cerrarSesion(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['mensaje' => 'Sesion cerrada correctamente.']);
    }
}
