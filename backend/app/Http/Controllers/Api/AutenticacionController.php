<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\IniciarSesionRequest;
use App\Http\Requests\Auth\RegistrarUsuarioRequest;
use App\Http\Requests\Auth\RestablecerContrasenaRequest;
use App\Http\Requests\Auth\SolicitarRecuperacionRequest;
use App\Http\Resources\UsuarioResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

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

    public function solicitarRecuperacion(SolicitarRecuperacionRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->firstOrFail();
        $token = Password::broker()->createToken($user);

        Mail::raw(
            "Hola {$user->nombre}.\n\n".
            "Usa este token para restablecer tu contrasena en GameWolf:\n\n".
            "{$token}\n\n".
            "El token vence en 60 minutos. Si no solicitaste este cambio, ignora este mensaje.",
            function ($message) use ($user) {
                $message
                    ->to($user->email)
                    ->subject('Recuperacion de contrasena - GameWolf');
            }
        );

        return response()->json([
            'mensaje' => 'Se envio un token de recuperacion al correo indicado.',
        ]);
    }

    public function restablecerContrasena(RestablecerContrasenaRequest $request): JsonResponse
    {
        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'mensaje' => 'El token es invalido o ya expiro.',
            ], 422);
        }

        return response()->json([
            'mensaje' => 'Contrasena restablecida correctamente. Ya puedes iniciar sesion.',
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
