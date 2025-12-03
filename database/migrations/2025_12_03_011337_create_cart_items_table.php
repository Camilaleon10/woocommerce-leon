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
            $table->id();

            // Más adelante los relacionarás:
            $table->unsignedBigInteger('user_id')->nullable();    // usuario dueño del carrito
            $table->unsignedBigInteger('product_id');             // producto en el carrito

            $table->integer('quantity')->default(1);              // cantidad
            $table->decimal('price', 10, 2);                      // precio unitario al momento de agregar
            $table->decimal('total', 10, 2);                      // quantity * price

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
