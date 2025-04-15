<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CommissionCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return $this->collection->map(function (CommissionResource $resource) {
            return [
                'id' => $resource->id,
                'clickTime' => $resource->clickTime,
                'purchaseTime' => $resource->purchaseTime,
                'conversionId' => $resource->conversionId,
                'shopeeCommissionCapped' => $resource->shopeeCommissionCapped,
                'sellerCommission' => $resource->sellerCommission,
                'totalCommission' => $resource->totalCommission,
                'netCommission' => $resource->netCommission,
                'mcnManagementFeeRate' => $resource->mcnManagementFeeRate,
                'mcnManagementFee' => $resource->mcnManagementFee,
                'mcnContractId' => $resource->mcnContractId, 
                'linkedMcnName' => $resource->linkedMcnName, 
                'buyerType' => $resource->buyerType,
                'utmContent' => $resource->utmContent,
                'device' => $resource->device, 
                'productType' => $resource->productType,
                'referrer' => $resource->referrer,
                // 'ordersId' => $resource->ordersId,
                'orders' => new CommissionOrdersCollection($resource->orders),
                'created_at' => $resource->created_at,
                'updated_at' => $resource->updated_at
            ];
        });
    }
}
