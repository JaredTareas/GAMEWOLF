<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ValidacionImagenVideojuegoTest extends TestCase
{
    use RefreshDatabase;

    public function test_rechaza_archivos_que_no_son_imagenes_validas_al_crear_videojuegos(): void
    {
        $administrador = User::factory()->create(['rol' => User::ROL_ADMIN]);
        Sanctum::actingAs($administrador);

        $this->postJson('/api/videojuegos', [
            'titulo' => 'Juego de prueba',
            'descripcion' => 'Descripcion valida para la prueba.',
            'plataforma' => 'PC',
            'precio' => 1200,
            'stock' => 5,
            'imagen' => UploadedFile::fake()->create('archivo.pdf', 20, 'application/pdf'),
        ])->assertUnprocessable()->assertJsonValidationErrors('imagen');
    }
}
