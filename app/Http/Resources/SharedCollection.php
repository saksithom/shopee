<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class SharedCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return $this->collection->map(function (SharedResource $resource) {
            return [
                'id' => $resource->id,
                'itemId' => $resource->itemId,
                'productName' => $resource->productName,
                'shopName' => $resource->shopName,
                'imageUrl' => asset($resource->imageUrl),
                'offerLink' => $resource->offerLink,
                'ratingStar' => $resource->ratingStar,
                'shopId' => $resource->shopId,
                'shopOfferlink' => $resource->shopOfferlink,
                'price' => $resource->price,
                'commissionRate' => $resource->commissionRate,
                'commission' => $resource->commission,
                'keyshare' => $resource->shopId,    
                'facebook_post_id' => $resource->facebook_post_id,
                'productLink' => $resource->productLink,
                'created_at' => date('Y-m-d H:i',strtotime($resource->created_at)),
                'updated_at' => date('Y-m-d H:i',strtotime($resource->updated_at))
    
            ];
        });
    }
}
