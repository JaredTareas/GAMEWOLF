<?php

use App\Http\Controllers\Api\AutenticacionController;
use App\Http\Controllers\Api\CarritoController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\VideojuegoController;
use Illuminate\Support\Facades\Route;

Route::post('/autenticacion/registro', [AutenticacionController::class, 'registrar']);
Route::post('/autenticacion/iniciar-sesion', [AutenticacionController::class, 'iniciarSesion']);

Route::get('/videojuegos', [VideojuegoController::class, 'index']);
Route::get('/videojuegos/{videojuego}', [VideojuegoController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/autenticacion/perfil', [AutenticacionController::class, 'perfil']);
    Route::post('/autenticacion/cerrar-sesion', [AutenticacionController::class, 'cerrarSesion']);

    Route::get('/carrito', [CarritoController::class, 'index'])->middleware('rol:cliente');
    Route::post('/carrito/articulos', [CarritoController::class, 'store'])->middleware('rol:cliente');
    Route::put('/carrito/articulos/{articuloCarrito}', [CarritoController::class, 'update'])->middleware('rol:cliente');
    Route::delete('/carrito/articulos/{articuloCarrito}', [CarritoController::class, 'destroy'])->middleware('rol:cliente');

    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::post('/pedidos', [PedidoController::class, 'store'])->middleware('rol:cliente');
    Route::get('/pedidos/{pedido}', [PedidoController::class, 'show']);
    Route::patch('/pedidos/{pedido}/estado', [PedidoController::class, 'actualizarEstado'])->middleware('rol:admin,empleado');

    Route::middleware('rol:admin,empleado')->group(function () {
        Route::post('/videojuegos', [VideojuegoController::class, 'store']);
        Route::put('/videojuegos/{videojuego}', [VideojuegoController::class, 'update']);
    });

    Route::delete('/videojuegos/{videojuego}', [VideojuegoController::class, 'destroy'])->middleware('rol:admin');

    Route::middleware('rol:admin,empleado')->group(function () {
        Route::get('/usuarios', [UsuarioController::class, 'index']);
        Route::get('/usuarios/{usuario}', [UsuarioController::class, 'show']);
    });
});
