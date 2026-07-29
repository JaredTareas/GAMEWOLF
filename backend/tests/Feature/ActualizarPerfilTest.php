<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ActualizarPerfilTest extends TestCase
{
    use RefreshDatabase;

    public function test_cada_rol_puede_actualizar_su_propio_perfil_sin_enviar_rol(): void
    {
        foreach ([User::ROL_ADMIN, User::ROL_EMPLEADO, User::ROL_CLIENTE] as $rol) {
            $usuario = User::factory()->create([
                'rol' => $rol,
                'telefono' => '+5215550001000',
            ]);

            Sanctum::actingAs($usuario);

            $response = $this->putJson("/api/usuarios/{$usuario->id}", [
                'nombre' => "Perfil actualizado {$rol}",
                'telefono' => '+5215550001001',
            ]);

            $response
                ->assertOk()
                ->assertJsonPath('data.nombre', "Perfil actualizado {$rol}")
                ->assertJsonPath('data.telefono', '+5215550001001')
                ->assertJsonPath('data.rol', $rol);

            $this->assertDatabaseHas('users', [
                'id' => $usuario->id,
                'nombre' => "Perfil actualizado {$rol}",
                'rol' => $rol,
            ]);
        }
    }

    public function test_el_admin_puede_editar_los_campos_de_gestion_de_otro_usuario(): void
    {
        $admin = User::factory()->create(['rol' => User::ROL_ADMIN]);
        $cliente = User::factory()->create([
            'rol' => User::ROL_CLIENTE,
            'email' => 'cliente.original@example.test',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/usuarios/{$cliente->id}", [
            'nombre' => 'Cliente editado por admin',
            'telefono' => '+5215550001099',
            'email' => 'cliente.editado@example.test',
            'rol' => User::ROL_EMPLEADO,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.email', 'cliente.editado@example.test')
            ->assertJsonPath('data.rol', User::ROL_EMPLEADO);

        $this->assertDatabaseHas('users', [
            'id' => $cliente->id,
            'nombre' => 'Cliente editado por admin',
            'email' => 'cliente.editado@example.test',
            'rol' => User::ROL_EMPLEADO,
        ]);
    }
}
