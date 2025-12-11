<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Asegurarse de que existan categorías
        $categories = Category::all();
        
        if ($categories->isEmpty()) {
            $this->command->warn('No hay categorías. Ejecuta CategorySeeder primero.');
            return;
        }

        $products = [
            [
                'name' => 'Laptop Gaming Pro',
                'slug' => 'laptop-gaming-pro',
                'description' => 'Potente laptop para gaming con procesador de última generación, 16GB RAM, RTX 4060',
                'price' => 1299.99,
                'stock' => 15,
                'category_id' => $categories->where('name', 'Electrónica')->first()->id ?? 1,
            ],
            [
                'name' => 'Smartphone Ultra',
                'slug' => 'smartphone-ultra',
                'description' => 'Teléfono inteligente con cámara de 108MP, pantalla AMOLED de 6.7 pulgadas',
                'price' => 899.99,
                'stock' => 8,
                'category_id' => $categories->where('name', 'Dispositivos Móviles')->first()->id ?? 2,
            ],
            [
                'name' => 'Auriculares Bluetooth',
                'slug' => 'auriculares-bluetooth',
                'description' => 'Auriculares inalámbricos con cancelación de ruido activa, 30 horas de batería',
                'price' => 199.99,
                'stock' => 25,
                'category_id' => $categories->where('name', 'Accesorios')->first()->id ?? 3,
            ],
            [
                'name' => 'Tablet Pro 12"',
                'slug' => 'tablet-pro-12',
                'description' => 'Tablet profesional con pantalla retina, stylus incluido, 256GB almacenamiento',
                'price' => 799.99,
                'stock' => 3,
                'category_id' => $categories->where('name', 'Electrónica')->first()->id ?? 1,
            ],
            [
                'name' => 'Smartwatch Sport',
                'slug' => 'smartwatch-sport',
                'description' => 'Reloj inteligente con monitor de actividad física, GPS, resistente al agua',
                'price' => 299.99,
                'stock' => 12,
                'category_id' => $categories->where('name', 'Dispositivos Móviles')->first()->id ?? 2,
            ],
            [
                'name' => 'Teclado Mecánico RGB',
                'slug' => 'teclado-mecanico-rgb',
                'description' => 'Teclado gaming con retroiluminación RGB personalizable, switches azules',
                'price' => 149.99,
                'stock' => 0,
                'category_id' => $categories->where('name', 'Accesorios')->first()->id ?? 3,
            ],
            [
                'name' => 'Monitor Curvo 27"',
                'slug' => 'monitor-curvo-27',
                'description' => 'Monitor gaming curvo 144Hz, 1ms response time, resolución QHD',
                'price' => 449.99,
                'stock' => 6,
                'category_id' => $categories->where('name', 'Electrónica')->first()->id ?? 1,
            ],
            [
                'name' => 'Mouse Gaming Wireless',
                'slug' => 'mouse-gaming-wireless',
                'description' => 'Mouse inalámbrico para gaming, 16000 DPI, 70 horas de batería',
                'price' => 89.99,
                'stock' => 18,
                'category_id' => $categories->where('name', 'Accesorios')->first()->id ?? 3,
            ],
            [
                'name' => 'Cámara Mirrorless',
                'slug' => 'camara-mirrorless',
                'description' => 'Cámara profesional 24MP, 4K video, estabilización de imagen',
                'price' => 1199.99,
                'stock' => 4,
                'category_id' => $categories->where('name', 'Electrónica')->first()->id ?? 1,
            ],
            [
                'name' => 'Power Bank 20000mAh',
                'slug' => 'power-bank-20000mah',
                'description' => 'Batería externa con carga rápida, 2 puertos USB-C, 1 puerto USB-A',
                'price' => 49.99,
                'stock' => 30,
                'category_id' => $categories->where('name', 'Accesorios')->first()->id ?? 3,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        $this->command->info('Se han creado 10 productos de ejemplo.');
    }
}