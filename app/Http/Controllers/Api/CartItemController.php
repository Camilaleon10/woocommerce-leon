<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    // GET /api/cart-items?user_id=1
    public function index(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $items = CartItem::with('product')
            ->where('user_id', $request->user_id)
            ->get();

        return response()->json($items);
    }

    // POST /api/cart-items
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id'    => 'required|integer|exists:users,id',
            'product_id' => 'required|integer|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($data['product_id']);

        $data['price'] = $product->price;
        $data['total'] = $product->price * $data['quantity'];

        $cartItem = CartItem::create($data);

        return response()->json($cartItem->load('product'), 201);
    }

    // GET /api/cart-items/{cartItem}
    public function show(CartItem $cartItem)
    {
        return response()->json($cartItem->load('product'));
    }

    // PUT/PATCH /api/cart-items/{cartItem}
    public function update(Request $request, CartItem $cartItem)
    {
        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem->quantity = $data['quantity'];
        $cartItem->total    = $cartItem->price * $cartItem->quantity;
        $cartItem->save();

        return response()->json($cartItem->load('product'));
    }

    // DELETE /api/cart-items/{cartItem}
    public function destroy(CartItem $cartItem)
    {
        $cartItem->delete();

        return response()->json(null, 204);
    }
}
