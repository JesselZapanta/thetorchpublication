<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreedomWall extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'body', 'emotion'];

    public function user()
    {
        return $this->belongsTo(User::class);
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