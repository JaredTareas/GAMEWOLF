<?php

namespace Database\Seeders;

use App\Models\Genero;
use App\Models\Pedido;
use App\Models\User;
use App\Models\Videojuego;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@gamewolf.test'],
            [
                'nombre' => 'Luis Jared',
                'telefono' => '+5215550001001',
                'rol' => User::ROL_ADMIN,
                'password' => Hash::make('GameWolf#2026'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'empleado@gamewolf.test'],
            [
                'nombre' => 'Leonardo Fuentes',
                'telefono' => '+5215550001002',
                'rol' => User::ROL_EMPLEADO,
                'password' => Hash::make('GameWolf#2026'),
            ]
        );

        $cliente = User::updateOrCreate(
            ['email' => 'cliente@gamewolf.test'],
            [
                'nombre' => 'Cliente Demo',
                'telefono' => '+5215550001003',
                'rol' => User::ROL_CLIENTE,
                'password' => Hash::make('GameWolf#2026'),
            ]
        );

        $generos = collect(['Accion', 'Aventura', 'RPG', 'Deportes', 'Carreras', 'Terror', 'Estrategia', 'Multijugador'])
            ->mapWithKeys(fn ($nombre) => [
                $nombre => Genero::updateOrCreate(
                    ['slug' => Str::slug($nombre)],
                    ['nombre' => $nombre]
                ),
            ]);

        $videojuegos = collect([
            ['Elden Ring', 'RPG', 'PS5', 1299, 18, 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg'],
            ['Cyberpunk 2077', 'Accion', 'Xbox Series X', 999, 12, 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg'],
            ['Forza Horizon 5', 'Carreras', 'Xbox Series X', 1199, 21, 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg'],
            ['Hades II', 'Accion', 'PC', 499, 30, 'https://cdn.akamai.steamstatic.com/steam/apps/1145350/header.jpg'],
            ['Resident Evil 4', 'Terror', 'PS5', 899, 10, 'https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg'],
            ['Baldurs Gate 3', 'RPG', 'PC', 1299, 16, 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg'],
            ['Street Fighter 6', 'Accion', 'PS5', 999, 14, 'https://cdn.akamai.steamstatic.com/steam/apps/1364780/header.jpg'],
            ['Hollow Knight', 'Aventura', 'Nintendo Switch', 399, 9, 'https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg'],
            ['Stardew Valley', 'Estrategia', 'PC', 299, 25, 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg'],
            ['No Mans Sky', 'Aventura', 'PC', 799, 8, 'https://cdn.akamai.steamstatic.com/steam/apps/275850/header.jpg'],
            ['Red Dead Redemption 2', 'Aventura', 'PS5', 1199, 19, 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg'],
            ['Monster Hunter World', 'Multijugador', 'PC', 699, 13, 'https://cdn.akamai.steamstatic.com/steam/apps/582010/header.jpg'],
        ])->map(function ($item) use ($generos) {
            [$titulo, $genero, $plataforma, $precio, $stock, $imagen] = $item;

            $videojuego = Videojuego::updateOrCreate(
                ['slug' => Str::slug($titulo)],
                [
                    'titulo' => $titulo,
                    'descripcion' => "Videojuego de {$genero} disponible en GameWolf.",
                    'plataforma' => $plataforma,
                    'precio' => $precio,
                    'stock' => $stock,
                    'imagen' => $imagen,
                    'estado' => 'activo',
                ]
            );

            $videojuego->generos()->syncWithoutDetaching([$generos[$genero]->id]);

            return $videojuego;
        });

        $pedido = Pedido::updateOrCreate(
            ['folio' => 'GW-DEMO-0001'],
            [
                'usuario_id' => $cliente->id,
                'estado' => 'pendiente',
                'total' => 0,
                'fecha_pedido' => now(),
            ]
        );

        $pedido->detalles()->delete();
        $total = 0;

        foreach ($videojuegos->take(3) as $videojuego) {
            $cantidad = 1;
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

        $admin->registrosNotificacion()->create([
            'pedido_id' => $pedido->id,
            'canal' => 'email',
            'destinatario' => $admin->email,
            'asunto' => 'GameWolf demo',
            'mensaje' => 'Datos iniciales cargados para probar el sistema.',
            'estado' => 'pendiente',
        ]);
    }
}
