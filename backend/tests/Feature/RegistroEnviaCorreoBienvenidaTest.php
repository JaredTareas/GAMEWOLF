<?php

namespace Tests\Feature;

use App\Mail\BienvenidaUsuario;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class RegistroEnviaCorreoBienvenidaTest extends TestCase
{
    use RefreshDatabase;

    public function test_el_registro_envia_el_correo_de_bienvenida_y_lo_registra(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/autenticacion/registro', [
            'nombre' => 'Cliente de Prueba',
            'email' => 'cliente.prueba@example.test',
            'password' => 'GameWolf#2026',
            'password_confirmation' => 'GameWolf#2026',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('correo_bienvenida.estado', 'enviado');

        $usuario = User::where('email', 'cliente.prueba@example.test')->firstOrFail();

        Mail::assertSent(BienvenidaUsuario::class, function (BienvenidaUsuario $correo) use ($usuario): bool {
            return $correo->hasTo($usuario->email);
        });

        $contenido = (new BienvenidaUsuario($usuario))->render();
        $this->assertStringContainsString('Cliente de Prueba', $contenido);
        $this->assertStringContainsString('Tu cuenta de GameWolf fue creada correctamente.', $contenido);

        $this->assertDatabaseHas('registros_notificacion', [
            'usuario_id' => $usuario->id,
            'canal' => 'email',
            'destinatario' => $usuario->email,
            'estado' => 'enviado',
        ]);
    }
}
