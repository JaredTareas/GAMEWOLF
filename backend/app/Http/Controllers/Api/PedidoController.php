<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CrearPedidoRequest;
use App\Http\Requests\ActualizarEstadoPedidoRequest;
use App\Http\Resources\PedidoResource;
use App\Models\Carrito;
use App\Models\RegistroNotificacion;
use App\Models\Pedido;
use App\Models\User;
use App\Models\Videojuego;
use App\Services\WhatsAppService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PedidoController extends Controller
{
    public function index(Request $request)
    {
        $pedidos = Pedido::query()
            ->with(['usuario', 'detalles.videojuego.generos'])
            ->when(! in_array($request->user()->rol, [User::ROL_ADMIN, User::ROL_EMPLEADO], true), function ($query) use ($request) {
                $query->where('usuario_id', $request->user()->id);
            })
            ->when($request->filled('estado'), fn ($query) => $query->where('estado', $request->string('estado')))
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return PedidoResource::collection($pedidos);
    }

    public function store(CrearPedidoRequest $request): JsonResponse
    {
        $user = $request->user();
        $detalles = collect($request->input('detalles', []));

        if ($detalles->isEmpty()) {
            $carrito = Carrito::where('usuario_id', $user->id)
                ->where('estado', 'activo')
                ->with('detalles.videojuego')
                ->first();

            $detalles = $carrito?->detalles->map(fn ($item) => [
                'videojuego_id' => $item->videojuego_id,
                'cantidad' => $item->cantidad,
            ]) ?? collect();
        }

        if ($detalles->isEmpty()) {
            return response()->json(['mensaje' => 'El pedido no tiene articulos.'], 422);
        }

        $pedido = DB::transaction(function () use ($detalles, $user) {
            $pedido = Pedido::create([
                'usuario_id' => $user->id,
                'folio' => 'GW-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
                'estado' => 'pendiente',
                'total' => 0,
                'fecha_pedido' => now(),
            ]);

            $total = 0;

            foreach ($detalles as $item) {
                $videojuego = Videojuego::lockForUpdate()->findOrFail($item['videojuego_id']);
                $cantidad = (int) $item['cantidad'];

                if ($videojuego->stock < $cantidad) {
                    abort(422, "No hay stock suficiente para {$videojuego->titulo}.");
                }

                $subtotal = $videojuego->precio * $cantidad;
                $total += $subtotal;

                $pedido->detalles()->create([
                    'videojuego_id' => $videojuego->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $videojuego->precio,
                    'subtotal' => $subtotal,
                ]);

                $videojuego->decrement('stock', $cantidad);
            }

            $pedido->update(['total' => $total]);
            Carrito::where('usuario_id', $user->id)->where('estado', 'activo')->update(['estado' => 'convertido']);

            foreach (['email', 'sms', 'whatsapp'] as $canal) {
                RegistroNotificacion::create([
                    'usuario_id' => $user->id,
                    'pedido_id' => $pedido->id,
                    'canal' => $canal,
                    'destinatario' => $canal === 'email' ? $user->email : ($user->telefono ?? 'sin telefono'),
                    'asunto' => 'Estado de pedido GameWolf',
                    'mensaje' => "Tu pedido {$pedido->folio} fue registrado.",
                ]);
            }

            return $pedido;
        });

        return response()->json([
            'mensaje' => 'Pedido creado correctamente.',
            'data' => new PedidoResource($pedido->load(['usuario', 'detalles.videojuego.generos'])),
        ], 201);
    }

    public function show(Request $request, Pedido $pedido): PedidoResource
    {
        abort_unless(
            in_array($request->user()->rol, [User::ROL_ADMIN, User::ROL_EMPLEADO], true) || $pedido->usuario_id === $request->user()->id,
            403,
            'No puedes consultar este pedido.'
        );

        return new PedidoResource($pedido->load(['usuario', 'detalles.videojuego.generos']));
    }

    public function actualizarEstado(ActualizarEstadoPedidoRequest $request, Pedido $pedido, WhatsAppService $whatsAppService): JsonResponse
    {
        $pedido->update($request->validated());
        $notificacion = $whatsAppService->enviarEstadoPedido($pedido->fresh(['usuario', 'detalles.videojuego.generos']));

        return response()->json([
            'mensaje' => 'Estado del pedido actualizado.',
            'notificacion_whatsapp' => [
                'estado' => $notificacion->estado,
                'destinatario' => $notificacion->destinatario,
            ],
            'data' => new PedidoResource($pedido->load(['usuario', 'detalles.videojuego.generos'])),
        ]);
    }
}
