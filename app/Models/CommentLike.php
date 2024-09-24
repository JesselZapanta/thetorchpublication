<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentLike extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'comment_id', 'is_like', 'academic_year_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }
    
    public function academicYear()
    {
        return $this->belongsTo(User::class, 'academic_year_id');
    }
}
