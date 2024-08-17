<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'layout_by',
        'assigned_by',
        'description',
        'body',
        'message',
        'priority',
        'status',
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
}
