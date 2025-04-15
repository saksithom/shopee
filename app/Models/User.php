<?php

namespace App\Models;

use App\Services\Userstamps;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, Userstamps;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [
        'id',
        'facebook_id',
        'avatar',
        'email',
        'name',
        'facebook_access_token',
        'remember_token',
        'email_verified_at',
        'created_at',
        'updated_at',
    ];
    protected $fillable = [
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
    ];

    public function scopeFilter($query, $request)
    {

        if ($request->has('name')) {
            $query->where('name','like','%'. $request->input('name') .'%');
        }

        if ($request->has('email')) {
            $query->where('email','like','%'.  $request->input('email').'%');
        }
        if ($request->has('level')) {
            $query->where('level', $request->input('level'));
        }
        if ($request->has('active')) {
            $query->where('active', $request->input('active'));
        }

        if ($request->has('term')) {
            $query->where(function ($query) use ($request) {
                $keys = explode(' ', $request->input('term'));
                foreach ($keys as $idx => $key) {
                    $query->where('name', 'like', '%' . $key . '%')
                        ->orWhere('email', 'like', '%' . $key . '%');
                }
            });
        }

    }

}
