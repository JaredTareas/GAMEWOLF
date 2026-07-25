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
        Schema::create('genero_videojuego', function (Blueprint $table) {
            $table->foreignId('genero_id')->constrained()->cascadeOnDelete();
            $table->foreignId('videojuego_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['genero_id', 'videojuego_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('genero_videojuego');
    }
};
