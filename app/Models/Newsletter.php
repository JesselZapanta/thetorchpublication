<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Newsletter extends Model
{
    use HasFactory;

    protected $table = 'newsletters';
    //chag

    protected $fillable = [
        'description',
        'academic_year_id',//
        'newsletter_thumbnail_image_path',
        'newsletter_file_path',
        'status',

        'submitted_at',
        'layout_by',//

        'revision_by',//
        'revision_at',
        'revision_message',

        'approved_at',
        'approved_by',//

        'distributed_at',
        'distributed_by',//

        'report_count',
        'visibility',
        'archive_by'
    ];



    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function layoutBy()
    {
        return $this->belongsTo(User::class, 'layout_by');
    }

    public function revisionBy()
    {
        return $this->belongsTo(User::class, 'revision_by');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function distributedBy()
    {
        return $this->belongsTo(User::class, 'distributed_by');
    }
}
