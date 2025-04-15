<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Commission extends Model
{
    use HasFactory;
    protected $table = 'commissions';

    protected $casts = [
        'orders' => 'json'
    ];

    protected $fillable = [
        'clickTime',
        'purchaseTime',
        'conversionId',
        'shopeeCommissionCapped',
        'sellerCommission',
        'totalCommission',
        'netCommission',
        'mcnManagementFeeRate',
        'mcnManagementFee',
        'mcnContractId', 
        'linkedMcnName', 
        'buyerType',
        'utmContent',
        'device', 
        'productType',
        'referrer',
        'orders'
    ];

    /**
     * Get all of the orders for the Commissioy
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orders(): HasMany
    {
        return $this->hasMany(CommissionOrders::class, 'commission_id');
    }
}
