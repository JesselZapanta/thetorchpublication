<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreedomWallLike extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'freedom_wall_id', 'is_like'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function freedomWall()
    {
        return $this->belongsTo(FreedomWall::class);
    }
}