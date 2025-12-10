<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si el usuario está autenticado y es administrador
        if (auth()->check() && auth()->user()->is_admin) {
            return $next($request);
        }

        // Si no es administrador, retornar respuesta de no autorizado
        return response()->json(['message' => 'No autorizado. Se requieren permisos de administrador.'], 403);
    }
}