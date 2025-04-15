<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SharedResource extends JsonResource
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
            'itemId' => $this->itemId,
            'productName' => $this->productName,
            'shopName' => $this->shopName,
            'imageUrl' => asset($this->imageUrl),
            'offerLink' => $this->offerLink,
            'productLink' => $this->productLink,
            'ratingStar' => $this->ratingStar,
            'shopId' => $this->shopId,
            'shopOfferlink' => $this->shopOfferlink,
            'price' => $this->price,
            'commissionRate' => $this->commissionRate,
            'commission' => $this->commission,
            'keyshare' => $this->shopId,
            'facebook_post_id' => $this->facebook_post_id,
            'created_at' => date('Y-m-d H:i',strtotime($this->created_at)),
            'updated_at' => date('Y-m-d H:i',strtotime($this->updated_at))

        ];
    }
}
