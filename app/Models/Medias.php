<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Medias extends Model
{
    use HasFactory;
    protected $table = 'medias';
    protected $fillable = [
    'ref_id',
    'url',
    'path',
    'filename',
    'field',
    'sortable',
    ];

    /**
     * Get the product that owns the Medias
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'ref_id');
    }
}
