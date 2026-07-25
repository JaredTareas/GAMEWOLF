<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['nombre', 'email', 'telefono', 'imagen_perfil', 'rol', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public const ROL_ADMIN = 'admin';
    public const ROL_EMPLEADO = 'empleado';
    public const ROL_CLIENTE = 'cliente';

    public function carrito(): HasOne
    {
        return $this->hasOne(Carrito::class, 'usuario_id')->where('estado', 'activo');
    }

    public function carritos(): HasMany
    {
        return $this->hasMany(Carrito::class, 'usuario_id');
    }

    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class, 'usuario_id');
    }

    public function registrosNotificacion(): HasMany
    {
        return $this->hasMany(RegistroNotificacion::class, 'usuario_id');
    }

    public function esAdmin(): bool
    {
        return $this->rol === self::ROL_ADMIN;
    }

    public function esEmpleado(): bool
    {
        return $this->rol === self::ROL_EMPLEADO;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
