<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $table = 'comments';

    protected $fillable = [
        'body', 
        'article_id', 
        'academic_year_id', 
        'user_id', 
        'visibility',
        'report_count',
    ];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function commentedBy()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function academicYear()
    {
        return $this->belongsTo(User::class, 'academic_year_id');
    }


    //for comments like and dislike
    public function likes()
    {
        return $this->hasMany(CommentLike::class)->where('is_like', true);
    }

    public function dislikes()
    {
        return $this->hasMany(CommentLike::class)->where('is_like', false);
    }
}
