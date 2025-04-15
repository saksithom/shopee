<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CommissionOrdersCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return $this->collection->map(function (CommissionOrdersResource $resource) {
            return [
                'id' => $resource->id,
                'orderId' => $resource->orderId,
                'orderStatus' => $resource->orderStatus,
                'shopType' => $resource->shopType,
                'items' => $resource->items,
                'created_at' => $resource->created_at,
                'updated_at' => $resource->updated_at
            ];
        });
    }
}
