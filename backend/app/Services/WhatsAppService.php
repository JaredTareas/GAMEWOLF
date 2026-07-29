<?php

namespace App\Services;

use App\Models\Pedido;
use App\Models\RegistroNotificacion;
class WhatsAppService
{
    public function __construct(private TwilioNotificationService $twilioNotificationService)
    {
    }

    public function enviarEstadoPedido(Pedido $pedido): RegistroNotificacion
    {
        return $this->twilioNotificationService->enviarWhatsAppEstadoPedido($pedido);
    }
}
