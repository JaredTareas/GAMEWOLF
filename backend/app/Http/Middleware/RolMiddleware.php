<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RolMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$rolesPermitidos): Response
    {
        if (! $request->user() || ! in_array($request->user()->rol, $rolesPermitidos, true)) {
            return response()->json([
                'mensaje' => 'No tienes permisos para realizar esta accion.',
            ], 403);
        }

        return $next($request);
    }
}
