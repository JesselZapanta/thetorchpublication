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
        'academic_year_id',
        'author',

        'title',
        'excerpt',
        'body',
        'status',
        'revision_message',
        'published_date',
        'is_anonymous',
        'is_featured',
        'article_image_path',
        'caption',
        
        'slug',
        'created_by',
        'edited_by',
        'layout_by',
        'views',
        'is_newsletter'
    ];

    //for category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    //academic year
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }
    //author
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function editedBy()
    {
        return $this->belongsTo(User::class, 'edited_by');
    }
    public function layoutBy()
    {
        return $this->belongsTo(User::class, 'layout_by');
    }
     //for ratings
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
    //comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
