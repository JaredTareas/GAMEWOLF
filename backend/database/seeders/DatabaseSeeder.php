<?php

namespace Database\Seeders;

use App\Models\Carrito;
use App\Models\Pedido;
use App\Models\RegistroNotificacion;
use App\Models\User;
use App\Models\Videojuego;
use App\Models\Genero;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $usuarios = collect([
            ['nombre' => 'Luis Jared', 'email' => 'admin@gamewolf.test', 'telefono' => '+5215550001001', 'rol' => User::ROL_ADMIN],
            ['nombre' => 'Admin Soporte', 'email' => 'admin.soporte@gamewolf.test', 'telefono' => '+5215550001002', 'rol' => User::ROL_ADMIN],
            ['nombre' => 'Leonardo Fuentes', 'email' => 'empleado@gamewolf.test', 'telefono' => '+5215550001003', 'rol' => User::ROL_EMPLEADO],
            ['nombre' => 'Mariana Inventario', 'email' => 'mariana.inventario@gamewolf.test', 'telefono' => '+5215550001004', 'rol' => User::ROL_EMPLEADO],
            ['nombre' => 'Diego Pedidos', 'email' => 'diego.pedidos@gamewolf.test', 'telefono' => '+5215550001005', 'rol' => User::ROL_EMPLEADO],
            ['nombre' => 'Cliente Demo', 'email' => 'cliente@gamewolf.test', 'telefono' => '+5215550001006', 'rol' => User::ROL_CLIENTE],
            ['nombre' => 'Ana Torres', 'email' => 'ana.torres@gamewolf.test', 'telefono' => '+5215550001007', 'rol' => User::ROL_CLIENTE],
            ['nombre' => 'Bruno García', 'email' => 'bruno.garcia@gamewolf.test', 'telefono' => '+5215550001008', 'rol' => User::ROL_CLIENTE],
            ['nombre' => 'Carla Mendoza', 'email' => 'carla.mendoza@gamewolf.test', 'telefono' => '+5215550001009', 'rol' => User::ROL_CLIENTE],
            ['nombre' => 'Elena Ruiz', 'email' => 'elena.ruiz@gamewolf.test', 'telefono' => '+5215550001010', 'rol' => User::ROL_CLIENTE],
            ['nombre' => 'Fernando Vega', 'email' => 'fernando.vega@gamewolf.test', 'telefono' => '+5215550001011', 'rol' => User::ROL_CLIENTE],
            ['nombre' => 'Gabriela Soto', 'email' => 'gabriela.soto@gamewolf.test', 'telefono' => '+5215550001012', 'rol' => User::ROL_CLIENTE],
        ])->mapWithKeys(function (array $datos): array {
            $usuario = User::updateOrCreate(
                ['email' => $datos['email']],
                [
                    'nombre' => $datos['nombre'],
                    'telefono' => $datos['telefono'],
                    'rol' => $datos['rol'],
                    'password' => Hash::make('GameWolf#2026'),
                ],
            );

            return [$usuario->email => $usuario];
        });

        $generos = collect([
            'Accion', 'Aventura', 'RPG', 'Deportes', 'Carreras', 'Terror',
            'Estrategia', 'Multijugador', 'Simulacion', 'Puzzle', 'Peleas', 'Indie',
        ])->mapWithKeys(fn (string $nombre): array => [
            $nombre => Genero::updateOrCreate(
                ['slug' => Str::slug($nombre)],
                ['nombre' => $nombre],
            ),
        ]);

        $videojuegos = collect([
            ['Elden Ring', ['RPG', 'Aventura'], 'PS5', 1299, 40, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg'],
            ['Cyberpunk 2077', ['Accion', 'RPG'], 'Xbox Series X', 999, 38, 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg'],
            ['Forza Horizon 5', ['Carreras', 'Deportes'], 'Xbox Series X', 1199, 36, 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg'],
            ['Hades II', ['Accion', 'Indie'], 'PC', 499, 44, 'https://cdn.akamai.steamstatic.com/steam/apps/1145350/header.jpg'],
            ['Resident Evil 4', ['Terror', 'Accion'], 'PS5', 899, 35, 'https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg'],
            ['Baldurs Gate 3', ['RPG', 'Estrategia'], 'PC', 1299, 42, 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg'],
            ['Street Fighter 6', ['Peleas', 'Multijugador'], 'PS5', 999, 39, 'https://cdn.akamai.steamstatic.com/steam/apps/1364780/header.jpg'],
            ['Hollow Knight', ['Aventura', 'Indie'], 'Nintendo Switch', 399, 46, 'https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg'],
            ['Stardew Valley', ['Simulacion', 'Indie'], 'PC', 299, 50, 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg'],
            ['Civilization VI', ['Estrategia', 'Simulacion'], 'PC', 799, 37, 'https://cdn.akamai.steamstatic.com/steam/apps/289070/header.jpg'],
            ['It Takes Two', ['Multijugador', 'Puzzle'], 'PS5', 699, 41, 'https://cdn.akamai.steamstatic.com/steam/apps/1426210/header.jpg'],
            ['EA Sports FC 26', ['Deportes', 'Multijugador'], 'PS5', 1399, 34, 'https://cdn.akamai.steamstatic.com/steam/apps/3405690/header.jpg'],
        ])->map(function (array $datos) use ($generos): Videojuego {
            [$titulo, $nombresGeneros, $plataforma, $precio, $stock, $imagen] = $datos;

            $videojuego = Videojuego::updateOrCreate(
                ['slug' => Str::slug($titulo)],
                [
                    'titulo' => $titulo,
                    'descripcion' => "Videojuego de {$nombresGeneros[0]} disponible en GameWolf.",
                    'plataforma' => $plataforma,
                    'precio' => $precio,
                    'stock' => $stock,
                    'imagen' => $imagen,
                    'estado' => 'activo',
                ],
            );

            $videojuego->generos()->sync(
                collect($nombresGeneros)->map(fn (string $nombre) => $generos[$nombre]->id)->all(),
            );

            return $videojuego;
        })->values();

        $clientes = $usuarios
            ->filter(fn (User $usuario): bool => $usuario->rol === User::ROL_CLIENTE)
            ->values();

        foreach (range(0, 11) as $indice) {
            $cliente = $clientes[$indice % $clientes->count()];
            $estadoCarrito = $indice < $clientes->count() ? 'activo' : 'convertido';
            $carrito = Carrito::updateOrCreate([
                'usuario_id' => $cliente->id,
                'estado' => $estadoCarrito,
            ]);
            $videojuego = $videojuegos[$indice];
            $cantidad = $indice % 3 === 0 ? 2 : 1;

            $carrito->detalles()->updateOrCreate(
                ['videojuego_id' => $videojuego->id],
                [
                    'cantidad' => $cantidad,
                    'precio_unitario' => $videojuego->precio,
                    'subtotal' => $videojuego->precio * $cantidad,
                ],
            );
        }

        $estadosPedido = ['pendiente', 'pagado', 'enviado', 'entregado'];

        foreach (range(0, 11) as $indice) {
            $cliente = $clientes[$indice % $clientes->count()];
            $folio = $indice === 0
                ? 'GW-DEMO-0001'
                : 'GW-DEMO-'.str_pad((string) ($indice + 1), 4, '0', STR_PAD_LEFT);
            $pedido = Pedido::updateOrCreate(
                ['folio' => $folio],
                [
                    'usuario_id' => $cliente->id,
                    'estado' => $estadosPedido[$indice % count($estadosPedido)],
                    'total' => 0,
                    'fecha_pedido' => now()->subDays(11 - $indice),
                ],
            );

            $pedido->detalles()->delete();
            $total = 0;

            foreach ([$videojuegos[$indice], $videojuegos[($indice + 1) % $videojuegos->count()]] as $videojuego) {
                $cantidad = $indice % 4 === 0 ? 2 : 1;
                $subtotal = $videojuego->precio * $cantidad;
                $total += $subtotal;

                $pedido->detalles()->create([
                    'videojuego_id' => $videojuego->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $videojuego->precio,
                    'subtotal' => $subtotal,
                ]);
            }

            $pedido->update(['total' => $total]);

            RegistroNotificacion::updateOrCreate(
                ['pedido_id' => $pedido->id, 'canal' => 'email'],
                [
                    'usuario_id' => $cliente->id,
                    'destinatario' => $cliente->email,
                    'asunto' => 'Pedido demo GameWolf',
                    'mensaje' => "El pedido {$pedido->folio} está listo para pruebas.",
                    'estado' => 'enviado',
                    'respuesta_proveedor' => 'Dato de demostración generado por el seeder.',
                    'enviado_at' => now(),
                ],
            );
        }
    }
}
