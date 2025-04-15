<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'clickTime' => $this->clickTime,
            'purchaseTime' => $this->purchaseTime,
            'conversionId' => $this->conversionId,
            'shopeeCommissionCapped' => $this->shopeeCommissionCapped,
            'sellerCommission' => $this->sellerCommission,
            'totalCommission' => $this->totalCommission,
            'netCommission' => $this->netCommission,
            'mcnManagementFeeRate' => $this->mcnManagementFeeRate,
            'mcnManagementFee' => $this->mcnManagementFee,
            'mcnContractId' => $this->mcnContractId, 
            'linkedMcnName' => $this->linkedMcnName, 
            'buyerType' => $this->buyerType,
            'utmContent' => $this->utmContent,
            'device' => $this->device, 
            'productType' => $this->productType,
            'referrer' => $this->referrer,
            'ordersId' => $this->ordersId,
            'orders' => new CommissionOrdersCollection($this->orders),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
