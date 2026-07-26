<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuardarVideojuegoRequest;
use App\Http\Requests\ActualizarVideojuegoRequest;
use App\Http\Resources\VideojuegoResource;
use App\Models\Videojuego;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VideojuegoController extends Controller
{
    public function index(Request $request)
    {
        $videojuegos = Videojuego::query()
            ->with('generos')
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('titulo', 'like', '%'.$request->string('search').'%');
            })
            ->when($request->filled('estado'), fn ($query) => $query->where('estado', $request->string('estado')))
            ->when($request->filled('genero_id'), function ($query) use ($request) {
                $query->whereHas('generos', fn ($generos) => $generos->where('generos.id', $request->integer('genero_id')));
            })
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return VideojuegoResource::collection($videojuegos);
    }

    public function store(GuardarVideojuegoRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['genero_ids', 'imagen']);
        
        // Verificamos si se subió un archivo físico
        if ($request->hasFile('imagen')) {
            $ruta = $request->file('imagen')->store('videojuegos', 'public');
            $data['imagen'] = '/storage/' . $ruta;
        } elseif ($request->filled('imagen')) {
            $data['imagen'] = $request->input('imagen'); // Por si mandan URL de texto
        }

        $videojuego = Videojuego::create([
            ...$data,
            'slug' => Str::slug($data['titulo']).'-'.Str::random(6),
        ]);

        $videojuego->generos()->sync($request->input('genero_ids', []));

        return response()->json([
            'mensaje' => 'Videojuego registrado correctamente.',
            'data' => new VideojuegoResource($videojuego->load('generos')),
        ], 201);
    }

    public function show(Videojuego $videojuego): VideojuegoResource
    {
        return new VideojuegoResource($videojuego->load('generos'));
    }

    public function update(ActualizarVideojuegoRequest $request, Videojuego $videojuego): JsonResponse
    {
        $data = $request->safe()->except(['genero_ids', 'imagen']);

        if (array_key_exists('titulo', $data)) {
            $data['slug'] = Str::slug($data['titulo']).'-'.$videojuego->id;
        }

        // Si se sube una nueva imagen, la guardamos
        if ($request->hasFile('imagen')) {
            // Opcional: Eliminar la imagen anterior del disco si existe
            if ($videojuego->imagen && Str::startsWith($videojuego->imagen, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $videojuego->imagen));
            }
            
            $ruta = $request->file('imagen')->store('videojuegos', 'public');
            $data['imagen'] = '/storage/' . $ruta;
        } elseif ($request->filled('imagen') && is_string($request->input('imagen'))) {
            $data['imagen'] = $request->input('imagen');
        }

        $videojuego->update($data);

        if ($request->has('genero_ids')) {
            $videojuego->generos()->sync($request->input('genero_ids', []));
        }

        return response()->json([
            'mensaje' => 'Videojuego actualizado correctamente.',
            'data' => new VideojuegoResource($videojuego->load('generos')),
        ]);
    }

    public function destroy(Videojuego $videojuego): JsonResponse
    {
        if ($videojuego->detallesPedido()->exists()) {
            return response()->json([
                'mensaje' => 'No se puede eliminar este videojuego porque ya esta registrado en pedidos.',
            ], 409);
        }

        // Eliminar imagen del servidor al borrar el juego
        if ($videojuego->imagen && Str::startsWith($videojuego->imagen, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $videojuego->imagen));
        }

        $videojuego->delete();

        return response()->json(['mensaje' => 'Videojuego eliminado correctamente.']);
    }
}