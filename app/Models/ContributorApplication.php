<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContributorApplication extends Model
{
    use HasFactory;

    protected $table = 'contributor_applications';
    protected $fillable = [
        'applied_for',
        'institute',
        'program',
        'sample_work_file_path',
        'user_id',
        'status',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
