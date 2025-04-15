<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductsShopeeCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return $this->collection->map(function (ProductsShopeeResource $resource) {
            return [
                "productName" => $resource['productName'],
                "itemId" => $resource['itemId'],
                "commissionRate" => $resource['commissionRate'],
                "commission" => $resource['commission'],
                "price" => $resource['price'],
                "sales" => $resource['sales'],
                "imageUrl" => $resource['imageUrl'],
                "shopName" => $resource['shopName'],
                "productLink" => $resource['productLink'],
                "offerLink" => $resource['offerLink'],
                "periodStartTime" => $resource['periodStartTime'],
                "periodEndTime" => $resource['periodEndTime'],
                "priceMin" => $resource['priceMin'],
                "priceMax" => $resource['priceMax'],
                "productCatIds" => $resource['productCatIds'],
                "ratingStar" => $resource['ratingStar'],
                "priceDiscountRate" => $resource['priceDiscountRate'],
                "shopId" => $resource['shopId'],
                "shopType" => $resource['shopType'],
                "sellerCommissionRate" => $resource['sellerCommissionRate'],
                "shopeeCommissionRate" => $resource['shopeeCommissionRate']
            ];
        });
    }
}
