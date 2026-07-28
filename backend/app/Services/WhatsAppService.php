<?php

namespace App\Services;

use App\Models\Pedido;
use App\Models\RegistroNotificacion;
use Illuminate\Support\Facades\Http;
use Throwable;

class WhatsAppService
{
    public function enviarEstadoPedido(Pedido $pedido): RegistroNotificacion
    {
        $pedido->loadMissing('usuario');

        $usuario = $pedido->usuario;
        $telefono = $usuario?->telefono;
        $mensaje = "Hola {$usuario->nombre}, tu pedido {$pedido->folio} en GameWolf cambio a estado: {$pedido->estado}. Total: \${$pedido->total}.";

        $registro = RegistroNotificacion::create([
            'usuario_id' => $usuario?->id,
            'pedido_id' => $pedido->id,
            'canal' => 'whatsapp',
            'destinatario' => $telefono ?: 'sin telefono',
            'asunto' => 'Actualizacion de pedido GameWolf',
            'mensaje' => $mensaje,
            'estado' => 'pendiente',
        ]);

        if (! $telefono) {
            $registro->update([
                'estado' => 'fallido',
                'respuesta_proveedor' => 'El cliente no tiene telefono registrado.',
            ]);

            return $registro;
        }

        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $from = config('services.twilio.whatsapp_from');

        if (! $sid || ! $token || ! $from) {
            $registro->update([
                'estado' => 'pendiente_configuracion',
                'respuesta_proveedor' => 'Faltan credenciales TWILIO_SID, TWILIO_TOKEN o TWILIO_WHATSAPP_FROM.',
            ]);

            return $registro;
        }

        try {
            $response = Http::asForm()
                ->withBasicAuth($sid, $token)
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                    'From' => $this->formatearWhatsApp($from),
                    'To' => $this->formatearWhatsApp($telefono),
                    'Body' => $mensaje,
                ]);

            $registro->update([
                'estado' => $response->successful() ? 'enviado' : 'fallido',
                'respuesta_proveedor' => $response->body(),
                'enviado_at' => $response->successful() ? now() : null,
            ]);
        } catch (Throwable $exception) {
            $registro->update([
                'estado' => 'fallido',
                'respuesta_proveedor' => $exception->getMessage(),
            ]);
        }

        return $registro;
    }

    private function formatearWhatsApp(string $telefono): string
    {
        return str_starts_with($telefono, 'whatsapp:')
            ? $telefono
            : "whatsapp:{$telefono}";
    }
}
