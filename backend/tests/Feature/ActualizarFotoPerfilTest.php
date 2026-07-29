<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ActualizarFotoPerfilTest extends TestCase
{
    use RefreshDatabase;

    public function test_el_usuario_puede_actualizar_su_foto_de_perfil(): void
    {
        Storage::fake('public');
        $usuario = User::factory()->create(['rol' => User::ROL_CLIENTE]);
        Sanctum::actingAs($usuario);

        $response = $this->withHeader('Accept', 'application/json')->post("/api/usuarios/{$usuario->id}/foto-perfil", [
            'foto_perfil' => UploadedFile::fake()->image('perfil.png'),
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.id', $usuario->id);

        $rutaPublica = $response->json('data.imagen_perfil');

        $this->assertNotEmpty($rutaPublica);
        $this->assertDatabaseHas('users', [
            'id' => $usuario->id,
            'imagen_perfil' => $rutaPublica,
        ]);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $rutaPublica));
    }

    public function test_la_foto_debe_ser_una_imagen_valida(): void
    {
        $usuario = User::factory()->create(['rol' => User::ROL_CLIENTE]);
        Sanctum::actingAs($usuario);

        $response = $this->withHeader('Accept', 'application/json')->post("/api/usuarios/{$usuario->id}/foto-perfil", [
            'foto_perfil' => UploadedFile::fake()->create('documento.pdf', 100, 'application/pdf'),
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('foto_perfil');
    }

    public function test_un_cliente_no_puede_actualizar_la_foto_de_otro_usuario(): void
    {
        $cliente = User::factory()->create(['rol' => User::ROL_CLIENTE]);
        $otroCliente = User::factory()->create(['rol' => User::ROL_CLIENTE]);
        Sanctum::actingAs($cliente);

        $response = $this->withHeader('Accept', 'application/json')->post("/api/usuarios/{$otroCliente->id}/foto-perfil", [
            'foto_perfil' => UploadedFile::fake()->image('perfil.png'),
        ]);

        $response->assertForbidden();
    }
}
