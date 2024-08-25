<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'category_id',
        'created_by',
        'edited_by',
        'layout_by',
        'title',
        'article_image_path',
        'caption',
        'body',
        'status',
        'views',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function editeddBy()
    {
        return $this->belongsTo(User::class, 'edited_by');
    }
    public function layoutBy()
    {
        return $this->belongsTo(User::class, 'layout_by');
    }
    
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
