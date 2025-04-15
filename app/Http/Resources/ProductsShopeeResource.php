<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductsShopeeResource extends JsonResource
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
            "productName" => $this['productName'],
            "itemId" => $this['itemId'],
            "commissionRate" => $this['commissionRate'],
            "commission" => $this['commission'],
            "price" => $this['price'],
            "sales" => $this['sales'],
            "imageUrl" => $this['imageUrl'],
            "shopName" => $this['shopName'],
            "productLink" => $this['productLink'],
            "offerLink" => $this['offerLink'],
            "periodStartTime" => $this['periodStartTime'],
            "periodEndTime" => $this['periodEndTime'],
            "priceMin" => $this['priceMin'],
            "priceMax" => $this['priceMax'],
            "productCatIds" => $this['productCatIds'],
            "ratingStar" => $this['ratingStar'],
            "priceDiscountRate" => $this['priceDiscountRate'],
            "shopId" => $this['shopId'],
            "shopType" => $this['shopType'],
            "sellerCommissionRate" => $this['sellerCommissionRate'],
            "shopeeCommissionRate" => $this['shopeeCommissionRate']
    ];
    }
}
