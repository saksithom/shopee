<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    // use HasFactory;
    protected $table = 'settings';

    protected $casts =[
        'page' => 'json',
        'options' => 'json'
    ];

    protected $fillable = [
        'page_id',
        'page',
        'options',
        'type',
        'actived'
    ];

    public function scopePage($query,$page_id)
    {
        return $query->where('page_id',$page_id);
    }


}
