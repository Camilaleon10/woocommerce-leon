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
    Schema::create('products', function (Blueprint $table) {
    $table->id();                           // PK
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();

    // relación con categories
    $table->foreignId('category_id')
          ->constrained('categories')       // REFERENCES categories(id)
          ->cascadeOnDelete();              // si borro la categoría, borro sus productos

    $table->decimal('price', 10, 2);
    $table->integer('stock')->default(0);
    $table->timestamps();
});

}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
