<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = ['reported_by', 'reason', 'reportable_type', 'reportable_id'];

    // Polymorphic relation to the reported content
    public function reportable()
    {
        return $this->morphTo();
    }

    // Relationship to the user who reported the content
    public function reportedBy()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
}
