<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Models\User;
use App\Models\Videojuego;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    public function resumen(): JsonResponse
    {
        $hoy = now()->toDateString();
        $estadosConIngreso = ['pagado', 'enviado', 'entregado'];

        $pedidosPorEstado = Pedido::query()
            ->select('estado', DB::raw('COUNT(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        return response()->json([
            'data' => [
                'ingresos_totales' => (float) Pedido::whereIn('estado', $estadosConIngreso)->sum('total'),
                'ingresos_hoy' => (float) Pedido::whereIn('estado', $estadosConIngreso)->whereDate('fecha_pedido', $hoy)->sum('total'),
                'pedidos_totales' => Pedido::count(),
                'pedidos_hoy' => Pedido::whereDate('fecha_pedido', $hoy)->count(),
                'usuarios_totales' => User::count(),
                'stock_bajo' => Videojuego::where('stock', '<=', 5)->count(),
                'pedidos_por_estado' => $pedidosPorEstado,
            ],
        ]);
    }
}
