<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuardarArticuloCarritoRequest;
use App\Http\Resources\CarritoResource;
use App\Models\Carrito;
use App\Models\ArticuloCarrito;
use App\Models\Videojuego;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CarritoController extends Controller
{
    public function index(Request $request): CarritoResource
    {
        $carrito = $this->carritoActivo($request);

        return new CarritoResource($carrito->load('detalles.videojuego.generos'));
    }

    public function store(GuardarArticuloCarritoRequest $request): JsonResponse
    {
        $carrito = $this->carritoActivo($request);
        $videojuego = Videojuego::findOrFail($request->validated('videojuego_id'));
        $cantidad = $request->integer('cantidad');

        $articuloExistente = $carrito->detalles()->where('videojuego_id', $videojuego->id)->first();
        $cantidadTotal = ($articuloExistente?->cantidad ?? 0) + $cantidad;

        if ($videojuego->stock < $cantidadTotal) {
            return response()->json(['mensaje' => 'No hay stock suficiente para este videojuego.'], 422);
        }

        $articulo = $articuloExistente ?? $carrito->detalles()->make(['videojuego_id' => $videojuego->id]);
        $articulo->fill([
            'cantidad' => $cantidadTotal,
            'precio_unitario' => $videojuego->precio,
            'subtotal' => $videojuego->precio * $cantidadTotal,
        ]);
        $articulo->save();

        return response()->json([
            'mensaje' => 'Carrito actualizado correctamente.',
            'data' => new CarritoResource($carrito->load('detalles.videojuego.generos')),
        ], $articulo->wasRecentlyCreated ? 201 : 200);
    }

    public function update(GuardarArticuloCarritoRequest $request, ArticuloCarrito $articuloCarrito): JsonResponse
    {
        $this->authorizeArticuloCarrito($request, $articuloCarrito);
        $videojuego = Videojuego::findOrFail($request->validated('videojuego_id'));
        $cantidad = $request->integer('cantidad');

        if ($videojuego->stock < $cantidad) {
            return response()->json(['mensaje' => 'No hay stock suficiente para este videojuego.'], 422);
        }

        $articuloCarrito->update([
            'videojuego_id' => $videojuego->id,
            'cantidad' => $cantidad,
            'precio_unitario' => $videojuego->precio,
            'subtotal' => $videojuego->precio * $cantidad,
        ]);

        return response()->json([
            'mensaje' => 'Articulo actualizado correctamente.',
            'data' => new CarritoResource($articuloCarrito->carrito->load('detalles.videojuego.generos')),
        ]);
    }

    public function destroy(Request $request, ArticuloCarrito $articuloCarrito): JsonResponse
    {
        $this->authorizeArticuloCarrito($request, $articuloCarrito);
        $carrito = $articuloCarrito->carrito;
        $articuloCarrito->delete();

        return response()->json([
            'mensaje' => 'Articulo eliminado del carrito.',
            'data' => new CarritoResource($carrito->load('detalles.videojuego.generos')),
        ]);
    }

    private function carritoActivo(Request $request): Carrito
    {
        return Carrito::firstOrCreate([
            'usuario_id' => $request->user()->id,
            'estado' => 'activo',
        ]);
    }

    private function authorizeArticuloCarrito(Request $request, ArticuloCarrito $articuloCarrito): void
    {
        abort_unless($articuloCarrito->carrito->usuario_id === $request->user()->id, 403, 'No puedes modificar este carrito.');
    }
}
