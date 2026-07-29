<?php

namespace App\Services;

use App\Mail\BienvenidaUsuario;
use App\Models\RegistroNotificacion;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Throwable;

class CorreoBienvenidaService
{
    public function enviar(User $usuario): RegistroNotificacion
    {
        $registro = RegistroNotificacion::create([
            'usuario_id' => $usuario->id,
            'canal' => 'email',
            'destinatario' => $usuario->email,
            'asunto' => BienvenidaUsuario::ASUNTO,
            'mensaje' => "Correo de bienvenida enviado a {$usuario->nombre}.",
            'estado' => 'pendiente',
        ]);

        try {
            Mail::to($usuario->email, $usuario->nombre)
                ->send(new BienvenidaUsuario($usuario));

            $registro->update([
                'estado' => 'enviado',
                'respuesta_proveedor' => 'Correo aceptado por el servidor SMTP.',
                'enviado_at' => now(),
            ]);
        } catch (Throwable $exception) {
            report($exception);

            $registro->update([
                'estado' => 'fallido',
                'respuesta_proveedor' => 'No se pudo enviar el correo. Consulta el registro del servidor para conocer el detalle.',
            ]);
        }

        return $registro->fresh();
    }
}
