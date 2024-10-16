<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $table = 'ratings';

    protected $fillable = ['article_id', 'user_id', 'rating', 'academic_year_id'];

    // Define relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Define relationship with Article
    public function article()
    {
        return $this->belongsTo(Article::class);
    }
    public function academicYear()
    {
        return $this->belongsTo(User::class, 'academic_year_id');
    }
}
