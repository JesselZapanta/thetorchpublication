<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class ArticleView extends Model
{
    use HasFactory;

    protected $fillable = ['article_id', 'user_id', 'academic_year_id'];


    public function article(){
        return $this->belongsTo(Article::class, 'article_id');
    }
    //kinsa ang ga view
    public function user(){
        return $this->belongsTo(Article::class, 'user_id');
    }
    public function academicYear(){
        return $this->belongsTo(Article::class, 'academic_year_id');
    }

}
