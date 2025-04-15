<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apis extends Model
{
    use HasFactory;
    protected $table = 'apis';

    protected $casts =[
        'access_code' => 'array'
    ];

    protected $fillable = [
        'api_type',
        'app_id',
        'secret_id',
        'client_id',
        'access_code',
        'long_access_token',
        'user_access_token',
        'page_id'
    ];

    public function scopeType($query,$type)
    {
        $query->where('api_type',$type);
    }
}
