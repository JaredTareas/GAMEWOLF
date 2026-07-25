<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['usuario_id', 'folio', 'estado', 'total', 'fecha_pedido'])]
class Pedido extends Model
{
    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'fecha_pedido' => 'datetime',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetallePedido::class, 'pedido_id');
    }

    public function registrosNotificacion(): HasMany
    {
        return $this->hasMany(RegistroNotificacion::class, 'pedido_id');
    }
}
