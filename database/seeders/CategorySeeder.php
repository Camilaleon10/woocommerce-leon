<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electrónica',
                'slug' => 'electronica',
                'description' => 'Dispositivos electrónicos como laptops, tablets, monitores y cámaras',
            ],
            [
                'name' => 'Dispositivos Móviles',
                'slug' => 'dispositivos-moviles',
                'description' => 'Smartphones, smartwatches y otros dispositivos portátiles',
            ],
            [
                'name' => 'Accesorios',
                'slug' => 'accesorios',
                'description' => 'Teclados, mouse, auriculares, power banks y otros complementos',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('Se han creado 3 categorías de ejemplo.');
    }
}