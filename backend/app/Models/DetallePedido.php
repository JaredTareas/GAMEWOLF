<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['pedido_id', 'videojuego_id', 'cantidad', 'precio_unitario', 'subtotal'])]
class DetallePedido extends Model
{
    protected $table = 'detalles_pedido';

    protected function casts(): array
    {
        return [
            'cantidad' => 'integer',
            'precio_unitario' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }

    public function videojuego(): BelongsTo
    {
        return $this->belongsTo(Videojuego::class);
    }
}
