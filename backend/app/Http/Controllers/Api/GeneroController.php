<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActualizarGeneroRequest;
use App\Http\Requests\GuardarGeneroRequest;
use App\Http\Resources\GeneroResource;
use App\Models\Genero;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GeneroController extends Controller
{
    public function index(Request $request)
    {
        $generos = Genero::query()
            ->withCount('videojuegos')
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('nombre', 'like', '%'.$request->string('search').'%');
            })
            ->orderBy('nombre')
            ->paginate($request->integer('per_page', 10));

        return GeneroResource::collection($generos);
    }

    public function store(GuardarGeneroRequest $request): JsonResponse
    {
        $genero = Genero::create([
            'nombre' => $request->string('nombre')->trim(),
            'slug' => Str::slug($request->string('nombre')).'-'.Str::random(5),
        ]);

        return response()->json([
            'mensaje' => 'Genero registrado correctamente.',
            'data' => new GeneroResource($genero->loadCount('videojuegos')),
        ], 201);
    }

    public function show(Genero $genero): GeneroResource
    {
        return new GeneroResource($genero->loadCount('videojuegos'));
    }

    public function update(ActualizarGeneroRequest $request, Genero $genero): JsonResponse
    {
        $genero->update([
            'nombre' => $request->string('nombre')->trim(),
            'slug' => Str::slug($request->string('nombre')).'-'.$genero->id,
        ]);

        return response()->json([
            'mensaje' => 'Genero actualizado correctamente.',
            'data' => new GeneroResource($genero->loadCount('videojuegos')),
        ]);
    }

    public function destroy(Genero $genero): JsonResponse
    {
        if ($genero->videojuegos()->exists()) {
            return response()->json([
                'mensaje' => 'No se puede eliminar este genero porque esta asignado a videojuegos.',
            ], 409);
        }

        $genero->delete();

        return response()->json(['mensaje' => 'Genero eliminado correctamente.']);
    }
}
