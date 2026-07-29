<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\IniciarSesionRequest;
use App\Http\Requests\Auth\RegistrarUsuarioRequest;
use App\Http\Requests\Auth\RestablecerContrasenaRequest;
use App\Http\Requests\Auth\SolicitarRecuperacionRequest;
use App\Mail\RestablecerContrasena;
use App\Http\Resources\UsuarioResource;
use App\Models\User;
use App\Services\CorreoBienvenidaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AutenticacionController extends Controller
{
    public function registrar(
        RegistrarUsuarioRequest $request,
        CorreoBienvenidaService $correoBienvenidaService,
    ): JsonResponse
    {
        $user = User::create([
            ...$request->safe()->except('password'),
            'rol' => User::ROL_CLIENTE,
            'password' => Hash::make($request->validated('password')),
        ]);
        $correoBienvenida = $correoBienvenidaService->enviar($user);
        $correoEnviado = $correoBienvenida->estado === 'enviado';

        return response()->json([
            'mensaje' => $correoEnviado
                ? 'Cuenta registrada correctamente. Te enviamos un correo de bienvenida.'
                : 'Cuenta registrada correctamente, pero no se pudo enviar el correo de bienvenida. Intenta iniciar sesión y contacta al administrador si el problema continúa.',
            'usuario' => new UsuarioResource($user),
            'token' => $user->createToken('gamewolf-api')->plainTextToken,
            'correo_bienvenida' => [
                'estado' => $correoBienvenida->estado,
            ],
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
        $user = User::where('email', $request->validated('email'))->first();

        if ($user) {
            $token = Password::broker()->createToken($user);
            $frontendUrl = rtrim((string) config('app.frontend_url'), '/');
            $urlRestablecimiento = $frontendUrl.'/?'.http_build_query([
                'mode' => 'reset',
                'email' => $user->email,
                'token' => $token,
            ]);

            Mail::to($user->email, $user->nombre)
                ->send(new RestablecerContrasena($user, $urlRestablecimiento));
        }

        return response()->json([
            'mensaje' => 'Si el correo esta registrado, recibiras un enlace para restablecer tu contrasena.',
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
