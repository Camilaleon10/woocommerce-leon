<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // GET /api/products
    public function index()
    {
        // Traer productos con la categoría asociada
        $products = Product::with('category')->get();

        return response()->json($products);
    }

    // POST /api/products
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|max:255|unique:products,slug',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'price'       => 'required|numeric',
            'stock'       => 'required|integer|min:0',
        ]);

        $product = Product::create($data);

        return response()->json($product->load('category'), 201);
    }

    // GET /api/products/{product}
    public function show(Product $product)
    {
        return response()->json($product->load('category'));
    }

    // PUT/PATCH /api/products/{product}
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'slug'        => 'sometimes|required|string|max:255|unique:products,slug,' . $product->id,
            'description' => 'sometimes|nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'price'       => 'sometimes|required|numeric',
            'stock'       => 'sometimes|required|integer|min:0',
        ]);

        $product->update($data);

        return response()->json($product->load('category'));
    }

    // DELETE /api/products/{product}
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(null, 204);
    }
}
