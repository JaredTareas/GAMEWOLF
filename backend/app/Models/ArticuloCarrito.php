<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['carrito_id', 'videojuego_id', 'cantidad', 'precio_unitario', 'subtotal'])]
class ArticuloCarrito extends Model
{
    protected $table = 'articulos_carrito';

    protected function casts(): array
    {
        return [
            'cantidad' => 'integer',
            'precio_unitario' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function carrito(): BelongsTo
    {
        return $this->belongsTo(Carrito::class, 'carrito_id');
    }

    public function videojuego(): BelongsTo
    {
        return $this->belongsTo(Videojuego::class);
    }
}
