<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Newsletter extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'newsletter_thumbnail_image_path',
        'newsletter_file_path',
        'status',
        'layout_by',
        'academic_year_id',
        'revision_message'
    ];

    // todo relattion
}
