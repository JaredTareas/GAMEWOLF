<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class DatosDemoSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_el_seeder_crea_datos_relacionados_suficientes_para_la_demo(): void
    {
        $this->seed();

        $this->assertDatabaseCount('users', 12);
        $this->assertDatabaseCount('generos', 12);
        $this->assertDatabaseCount('videojuegos', 12);
        $this->assertDatabaseCount('carritos', 12);
        $this->assertDatabaseCount('articulos_carrito', 12);
        $this->assertDatabaseCount('pedidos', 12);
        $this->assertDatabaseCount('detalles_pedido', 24);
        $this->assertDatabaseCount('registros_notificacion', 12);
        $this->assertDatabaseCount('genero_videojuego', 24);

        $admin = \App\Models\User::where('email', 'admin@gamewolf.test')->firstOrFail();
        $this->assertSame('admin', $admin->rol);
        $this->assertTrue(Hash::check('GameWolf#2026', $admin->password));
        $this->assertDatabaseHas('pedidos', ['folio' => 'GW-DEMO-0001']);
    }
}
