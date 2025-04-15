<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommissionOrders extends Model
{
    protected $table = 'commission_orders';

    protected $casts = [
        'items' => 'json'
    ];

    protected $fillable = [
        'orderId',
        'orderStatus',
        'shopType',
        'items'
    ];
    /**
     * Get the commission that owns the CommissionOrders
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function commission(): BelongsTo
    {
        return $this->belongsTo(Commission::class, 'commission_id');
    }
}
