<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductsCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return $this->collection->map(function (ProductsResource $resource) {
            return [
                'id' => $resource->id,
                'itemid' => $resource->itemid,
                'title' => $resource->title,
                'shopid' => $resource->shopid,
                'shop_name' => $resource->shop_name,
                'seller_name' => $resource->seller_name,
                'cb_option' => $resource->cb_option,
                'stock' => $resource->stock,
                'item_sold' => $resource->item_sold,
                'shop_rating' => $resource->shop_rating,
                'item_rating' => $resource->item_rating,
                'sale_price' => $resource->sale_price,
                'price' => $resource->price,
                'like' => $resource->like,
                'model_ids' => $resource->model_ids,
                'model_names' => $resource->model_names,
                'model_prices' => $resource->model_prices,
                'description' => $resource->description,
                'global_category1' => $resource->global_category1,
                'global_category2' => $resource->global_category2,
                'global_category3' => $resource->global_category3,
                'shopee_verified_flag' => $resource->shopee_verified_flag,
                'is_preferred_shop' => $resource->is_preferred_shop,
                'is_official_shop' => $resource->is_official_shop,
                'seller_penalty_score' => $resource->seller_penalty_score,
                'condition' => $resource->condition,
                'discount_percentage' => $resource->discount_percentage,
                'has_lowest_price_guarantee' => $resource->has_lowest_price_guarantee,
                'global_brand' => $resource->global_brand,
                'product_link' => $resource->product_link,
                'product_short_link' => $resource->product_short_link,
                'medeas' => new MediasCollection($resource->medies),
                'created_at' => $resource->created_at,
                'updated_at' => $resource->updated_at
            ];
        });
    }
}
