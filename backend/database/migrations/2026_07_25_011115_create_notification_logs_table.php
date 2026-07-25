<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('registros_notificacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('pedido_id')->nullable()->constrained()->nullOnDelete();
            $table->string('canal');
            $table->string('destinatario');
            $table->string('asunto')->nullable();
            $table->text('mensaje');
            $table->string('estado')->default('pendiente');
            $table->text('respuesta_proveedor')->nullable();
            $table->timestamp('enviado_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registros_notificacion');
    }
};
