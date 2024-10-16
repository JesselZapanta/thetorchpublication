<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportedFreedomWall extends Model
{
    use HasFactory;

    protected $table = 'reported_freedom_walls';

    protected $fillable = ['user_id', 'freedom_wall_id', 'reason'];

    // Relationship to FreedomWall
    public function freedomWall()
    {
        return $this->belongsTo(FreedomWall::class);
    }

    // Relationship to User (the user who reported)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
