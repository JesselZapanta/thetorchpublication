<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreedomWall extends Model
{
    use HasFactory;

    protected $table = 'freedom_walls';

    protected $fillable = ['user_id', 'academic_year_id', 'body', 'emotion', 'report_count', 'visibility'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(User::class, 'academic_year_id');
    }

     //for comments like and dislike
    public function likes()
    {
        return $this->hasMany(FreedomWallLike::class)->where('is_like', true);
    }

    public function dislikes()
    {
        return $this->hasMany(FreedomWallLike::class)->where('is_like', false);
    }
}
