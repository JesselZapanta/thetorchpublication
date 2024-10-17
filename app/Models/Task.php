<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $table = 'tasks';

    protected $fillable = [
        'name',
        'description',
        'category_id',
        'academic_year_id',

        'layout_by',
        'assigned_by',
        'assigned_to',

        'title',
        'excerpt',
        'body',
        'caption',

        'status',
        'priority',
        'draft',

        'assigned_date',

        'content_submitted_date',

        // 'content_revision_by',//
        'content_revision_message',
        'content_revision_date',

        'content_approved_by',//
        'content_approved_date',
        
        'image_submitted_date',

        // 'image_revision_by',//
        'image_revision_message',
        'image_revision_date',

        // 'approved_published_by',//
        'task_completed_date',

        'due_date',
        
        'task_image_path',

        'archive_by',
        'visibility',
    ];

    //who assign the task
    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
    //the assignee for the caption
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
    //the asignee for the image
    public function layoutBy()
    {
        return $this->belongsTo(User::class, 'layout_by');
    }
    //what category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    //academic year
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

     //who set the task to content revision
    // public function contentRevisionBy()
    // {
    //     return $this->belongsTo(User::class, 'content_revision_by');
    // }
     //who approved the task content
    // public function contentApprovedBy()
    // {
    //     return $this->belongsTo(User::class, 'content_approved_by');
    // }

     //who set the task to image to revision
    // public function imageRevisionBy()
    // {
    //     return $this->belongsTo(User::class, 'image_revision_by');
    // }
     //who approved and publised the task
    // public function approvedPublishedBy()
    // {
    //     return $this->belongsTo(User::class, 'approved_published_by');
    // }

}
