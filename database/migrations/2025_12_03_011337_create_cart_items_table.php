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
        Schema::create('cart_items', function (Blueprint $table) {
    $table->id();                           // PK

    // Si usas users:
    $table->foreignId('user_id')
          ->constrained('users')
          ->cascadeOnDelete();

    $table->foreignId('product_id')
          ->constrained('products')         // REFERENCES products(id)
          ->cascadeOnDelete();

    $table->integer('quantity');
    $table->decimal('price', 10, 2);        // precio unitario en el momento
    $table->decimal('total', 10, 2);        // quantity * price

    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
