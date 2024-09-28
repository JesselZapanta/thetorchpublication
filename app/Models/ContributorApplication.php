<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContributorApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'institute',
        'program',
        'sample_work_file_path',
        'status',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
