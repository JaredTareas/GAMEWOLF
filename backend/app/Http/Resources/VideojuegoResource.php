<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideojuegoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'slug' => $this->slug,
            'descripcion' => $this->descripcion,
            'plataforma' => $this->plataforma,
            'precio' => (float) $this->precio,
            'stock' => $this->stock,
            'imagen' => $this->imagen,
            'estado' => $this->estado,
            'generos' => $this->whenLoaded('generos', fn () => $this->generos->map(fn ($genero) => [
                'id' => $genero->id,
                'nombre' => $genero->nombre,
                'slug' => $genero->slug,
            ])),
        ];
    }
}
