<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nombre', 'slug'])]
class Genero extends Model
{
    public function videojuegos(): BelongsToMany
    {
        return $this->belongsToMany(Videojuego::class, 'genero_videojuego', 'genero_id', 'videojuego_id')->withTimestamps();
    }
}
