<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use HasFactory;

    // A BLOG BELONGS TO ONE CATEGORY
    // CATEGORY_ID FROM A BLOG POINTS TO AN ID FROM A CATEGORY
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    protected $fillable = ['category_id', 'slug', 'title', 'thumbnail', 'body', 'published_at'];
}

