<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
// class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'student_id',
        'username',
        'role',
        'position',
        'profile_image_path',
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    //for articles
    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    //for comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // for comments like and dislike
    public function commentLikes()
    {
        return $this->hasMany(CommentLike::class);
    }

    public function freedomWalls()
    {
        return $this->hasMany(FreedomWall::class);
    }
}
