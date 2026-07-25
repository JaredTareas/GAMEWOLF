<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['usuario_id', 'pedido_id', 'canal', 'destinatario', 'asunto', 'mensaje', 'estado', 'respuesta_proveedor', 'enviado_at'])]
class RegistroNotificacion extends Model
{
    protected $table = 'registros_notificacion';

    protected function casts(): array
    {
        return [
            'enviado_at' => 'datetime',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }
}
