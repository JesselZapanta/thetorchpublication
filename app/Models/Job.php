<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

     // Specify the table name
    protected $table = 'jobs';

    // Define which attributes are mass assignable (if needed)
    protected $fillable = ['queue', 'payload', 'reserved_at', 'available_at'];
}
