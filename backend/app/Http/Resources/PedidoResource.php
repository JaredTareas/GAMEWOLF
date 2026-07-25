<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidoResource extends JsonResource
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
            'folio' => $this->folio,
            'estado' => $this->estado,
            'total' => (float) $this->total,
            'fecha_pedido' => $this->fecha_pedido,
            'cliente' => new UsuarioResource($this->whenLoaded('usuario')),
            'detalles' => DetallePedidoResource::collection($this->whenLoaded('detalles')),
        ];
    }
}
