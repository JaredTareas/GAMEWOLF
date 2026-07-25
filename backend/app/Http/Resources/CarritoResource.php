<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarritoResource extends JsonResource
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
            'estado' => $this->estado,
            'total' => (float) $this->detalles->sum('subtotal'),
            'detalles' => $this->whenLoaded('detalles', fn () => $this->detalles->map(fn ($item) => [
                'id' => $item->id,
                'cantidad' => $item->cantidad,
                'precio_unitario' => (float) $item->precio_unitario,
                'subtotal' => (float) $item->subtotal,
                'videojuego' => new VideojuegoResource($item->videojuego),
            ])),
        ];
    }
}
