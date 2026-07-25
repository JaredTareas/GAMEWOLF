<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['titulo', 'slug', 'descripcion', 'plataforma', 'precio', 'stock', 'imagen', 'estado'])]
class Videojuego extends Model
{
    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'stock' => 'integer',
        ];
    }

    public function generos(): BelongsToMany
    {
        return $this->belongsToMany(Genero::class, 'genero_videojuego', 'videojuego_id', 'genero_id')->withTimestamps();
    }

    public function articulosCarrito(): HasMany
    {
        return $this->hasMany(ArticuloCarrito::class, 'videojuego_id');
    }

    public function detallesPedido(): HasMany
    {
        return $this->hasMany(DetallePedido::class, 'videojuego_id');
    }
}
