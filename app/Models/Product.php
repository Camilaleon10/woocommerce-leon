<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'category_id',
        'price',
        'stock',
        'image_url',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
