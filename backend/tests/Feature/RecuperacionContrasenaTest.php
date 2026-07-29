<?php

namespace Tests\Feature;

use App\Mail\RestablecerContrasena;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class RecuperacionContrasenaTest extends TestCase
{
    use RefreshDatabase;

    public function test_envia_un_enlace_y_permite_restablecer_la_contrasena(): void
    {
        Mail::fake();
        config(['app.frontend_url' => 'https://gamewolf.shop']);

        $usuario = User::factory()->create([
            'nombre' => 'Cliente Recuperacion',
            'email' => 'cliente.recuperacion@example.test',
            'password' => Hash::make('Anterior#2026'),
        ]);

        $this->postJson('/api/autenticacion/recuperar-contrasena', [
            'email' => $usuario->email,
        ])->assertOk()->assertJsonPath(
            'mensaje',
            'Si el correo esta registrado, recibiras un enlace para restablecer tu contrasena.',
        );

        $correo = null;

        Mail::assertSent(RestablecerContrasena::class, function (RestablecerContrasena $mailable) use ($usuario, &$correo): bool {
            $correo = $mailable;

            return $mailable->hasTo($usuario->email);
        });

        $this->assertNotNull($correo);
        $this->assertStringContainsString('https://gamewolf.shop/?mode=reset', $correo->urlRestablecimiento);
        $this->assertStringContainsString('email=cliente.recuperacion%40example.test', $correo->urlRestablecimiento);

        parse_str((string) parse_url($correo->urlRestablecimiento, PHP_URL_QUERY), $parametrosEnlace);

        $this->postJson('/api/autenticacion/restablecer-contrasena', [
            'email' => $usuario->email,
            'token' => $parametrosEnlace['token'] ?? '',
            'password' => 'NuevaClave#2026',
            'password_confirmation' => 'NuevaClave#2026',
        ])->assertOk();

        $usuario->refresh();
        $this->assertTrue(Hash::check('NuevaClave#2026', $usuario->password));

        $this->postJson('/api/autenticacion/iniciar-sesion', [
            'email' => $usuario->email,
            'password' => 'NuevaClave#2026',
        ])->assertOk()->assertJsonStructure(['token']);
    }

    public function test_no_revela_si_el_correo_no_esta_registrado(): void
    {
        Mail::fake();

        $this->postJson('/api/autenticacion/recuperar-contrasena', [
            'email' => 'sin.cuenta@example.test',
        ])->assertOk()->assertJsonPath(
            'mensaje',
            'Si el correo esta registrado, recibiras un enlace para restablecer tu contrasena.',
        );

        Mail::assertNothingSent();
    }
}
