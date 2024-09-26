<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'author',
        'created_by',
        'academic_year_id',
        'category_id',
        'edited_by',
        'layout_by',
        'revision_by',
        'published_by',

        'slug',

        'title',
        'excerpt',
        'body',
        'caption',
        'article_image_path',

        'status',
        'draft',
        'visibility',

        'rejection_message',
        'revision_message',

        'is_featured',
        'is_anonymous',
        'is_newsletter',

        'submitted_at',//
        'rejected_at',//
        'edited_at',//
        'revision_at',//
        'published_date',//

        'report_count',
        'views',

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

    public function revisionBy()
    {
        return $this->belongsTo(User::class, 'revision_by');
    }

    public function publishedBy()
    {
        return $this->belongsTo(User::class, 'published_by');
    }

     //for views
    public function views()
    {
        return $this->hasMany(ArticleView::class);
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
