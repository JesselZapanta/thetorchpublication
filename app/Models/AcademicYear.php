<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;

    protected $table = 'academic_years';
    
    protected $fillable = [
        'code',
        'description',
        'status',
        
        'start_at',//new
        'end_at',//new
    ];
    //for articles
    public function articles()
    {
        return $this->hasMany(Article::class);
    }
}
