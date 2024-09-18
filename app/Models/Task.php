<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category_id',
        'academic_year_id',

        'layout_by',
        'assigned_by',

        'title',
        'excerpt',
        'body',
        'caption',

        'status',
        'priority',
        'draft',

        'assigned_date',//

        'content_submitted_date',//

        'content_revision_message',
        'content_revision_date',//

        'content_approved_date',
        
        'image_submitted_date',
        'image_revision_message',
        'image_revision_date',

        'task_completed_date',
        'due_date',
        
        'task_image_path',
    ];

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    public function layoutBy()
    {
        return $this->belongsTo(User::class, 'layout_by');
    }
    //academic year
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }
}
