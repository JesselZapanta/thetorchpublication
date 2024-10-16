<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreedomWallLike extends Model
{
    use HasFactory;

    protected $table = 'freedom_wall_likes';

    protected $fillable = ['user_id', 'academic_year_id', 'freedom_wall_id', 'is_like'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function academicYear()
    {
        return $this->belongsTo(User::class, 'academic_year_id');
    }

    public function freedomWall()
    {
        return $this->belongsTo(FreedomWall::class);
    }
}
