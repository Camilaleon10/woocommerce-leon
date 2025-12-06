<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\UserController;

// Ruta protegida: solo si el usuario está autenticado con Sanctum
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas públicas de la API de la tienda (por ahora sin auth)
Route::apiResource('products', ProductController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('cart-items', CartItemController::class);

Route::apiResource('users', UserController::class);
