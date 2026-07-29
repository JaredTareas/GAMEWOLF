<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ListadosPaginadosTest extends TestCase
{
    use RefreshDatabase;

    public function test_los_listados_aplican_filtros_y_paginacion_en_el_servidor(): void
    {
        $this->seed();

        $admin = User::where('email', 'admin@gamewolf.test')->firstOrFail();
        Sanctum::actingAs($admin);

        $usuarios = $this->getJson('/api/usuarios?search=ana.torres@gamewolf.test&per_page=1');
        $usuarios
            ->assertOk()
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.nombre', 'Ana Torres');

        $pedidos = $this->getJson('/api/pedidos?search=GW-DEMO-0001&per_page=1');
        $pedidos
            ->assertOk()
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.folio', 'GW-DEMO-0001');

        $videojuegos = $this->getJson('/api/videojuegos?search=Elden&per_page=1');
        $videojuegos
            ->assertOk()
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.titulo', 'Elden Ring');
    }
}
