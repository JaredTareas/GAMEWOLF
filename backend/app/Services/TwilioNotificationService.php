<?php

namespace App\Services;

use App\Models\Pedido;
use App\Models\RegistroNotificacion;
use Illuminate\Support\Str;
use Throwable;
use Twilio\Rest\Client;

class TwilioNotificationService
{
    public function enviarWhatsAppEstadoPedido(Pedido $pedido): RegistroNotificacion
    {
        $pedido->loadMissing('usuario');

        $usuario = $pedido->usuario;
        $telefonoOriginal = $usuario?->telefono;
        $telefono = $this->normalizarTelefono($telefonoOriginal);
        $destinatario = $telefono
            ? $this->formatearDestinatario($telefono)
            : ($telefonoOriginal ?: 'sin telefono');

        $registro = RegistroNotificacion::create([
            'usuario_id' => $usuario?->id,
            'pedido_id' => $pedido->id,
            'canal' => 'whatsapp',
            'destinatario' => $destinatario,
            'asunto' => 'Actualizacion de pedido GameWolf',
            'mensaje' => $this->mensajeEstadoPedido($pedido),
            'estado' => 'pendiente',
        ]);

        if (! $telefono) {
            $registro->update([
                'estado' => 'fallido',
                'respuesta_proveedor' => 'El cliente no tiene un telefono valido en formato E.164.',
            ]);

            return $registro;
        }

        $configuracion = $this->configuracion();

        if ($configuracion['faltantes'] !== []) {
            $registro->update([
                'estado' => 'pendiente_configuracion',
                'respuesta_proveedor' => 'Faltan variables de Twilio: '.implode(', ', $configuracion['faltantes']).'.',
            ]);

            return $registro;
        }

        try {
            $cliente = new Client($configuracion['sid'], $configuracion['auth_token']);
            $mensaje = $cliente->messages->create(
                $this->formatearDestinatario($telefono),
                [
                    'from' => $this->formatearRemitente($configuracion['from']),
                    'body' => $registro->mensaje,
                ],
            );

            $estadoProveedor = Str::lower((string) ($mensaje->status ?? 'queued'));
            $fueAceptado = ! in_array($estadoProveedor, ['failed', 'undelivered'], true);

            $registro->update([
                'estado' => $fueAceptado ? 'enviado' : 'fallido',
                'respuesta_proveedor' => json_encode([
                    'sid' => $mensaje->sid,
                    'estado_proveedor' => $mensaje->status,
                    'error_code' => $mensaje->errorCode,
                    'error_message' => $mensaje->errorMessage,
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                'enviado_at' => $fueAceptado ? now() : null,
            ]);
        } catch (Throwable $exception) {
            $registro->update([
                'estado' => 'fallido',
                'respuesta_proveedor' => $exception->getMessage(),
            ]);
        }

        return $registro->fresh();
    }

    /**
     * @return array{sid: ?string, auth_token: ?string, from: ?string, faltantes: array<int, string>}
     */
    private function configuracion(): array
    {
        $sid = config('services.twilio.sid');
        $authToken = config('services.twilio.auth_token');
        $from = config('services.twilio.whatsapp_from');
        $variables = [
            'TWILIO_SID' => $sid,
            'TWILIO_AUTH_TOKEN' => $authToken,
            'TWILIO_WHATSAPP_FROM' => $from,
        ];

        return [
            'sid' => $sid,
            'auth_token' => $authToken,
            'from' => $from,
            'faltantes' => array_keys(array_filter($variables, fn ($valor) => blank($valor))),
        ];
    }

    private function mensajeEstadoPedido(Pedido $pedido): string
    {
        $nombre = $pedido->usuario?->nombre ?: 'cliente';
        $total = number_format((float) $pedido->total, 2, '.', ',');

        return "Hola {$nombre}, tu pedido {$pedido->folio} en GameWolf cambio a estado: {$pedido->estado}. Total: \${$total}.";
    }

    private function normalizarTelefono(?string $telefono): ?string
    {
        if (blank($telefono)) {
            return null;
        }

        $telefono = preg_replace('/^whatsapp:/i', '', trim($telefono));
        $telefono = preg_replace('/[\s\-()]/', '', $telefono);

        return preg_match('/^\+[1-9]\d{7,14}$/', $telefono) ? $telefono : null;
    }

    private function formatearDestinatario(string $telefono): string
    {
        return "whatsapp:{$telefono}";
    }

    private function formatearRemitente(string $remitente): string
    {
        $remitente = trim($remitente);

        return str_starts_with($remitente, 'whatsapp:')
            ? $remitente
            : "whatsapp:{$remitente}";
    }
}
