<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductsResource extends JsonResource
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
            'itemid' => $this->itemid,
            'title' => $this->title,
            'shopid' => $this->shopid,
            'shop_name' => $this->shop_name,
            'seller_name' => $this->seller_name,
            'cb_option' => $this->cb_option,
            'stock' => $this->stock,
            'item_sold' => $this->item_sold,
            'shop_rating' => $this->shop_rating,
            'item_rating' => $this->item_rating,
            'sale_price' => $this->sale_price,
            'price' => $this->price,
            'like' => $this->like,
            'model_ids' => $this->model_ids,
            'model_names' => $this->model_names,
            'model_prices' => $this->model_prices,
            'description' => $this->description,
            'global_category1' => $this->global_category1,
            'global_category2' => $this->global_category2,
            'global_category3' => $this->global_category3,
            'shopee_verified_flag' => $this->shopee_verified_flag,
            'is_preferred_shop' => $this->is_preferred_shop,
            'is_official_shop' => $this->is_official_shop,
            'seller_penalty_score' => $this->seller_penalty_score,
            'condition' => $this->condition,
            'discount_percentage' => $this->discount_percentage,
            'has_lowest_price_guarantee' => $this->has_lowest_price_guarantee,
            'global_brand' => $this->global_brand,
            'product_link' => $this->product_link,
            'product_short_link' => $this->product_short_link,
            'medias' => new MediasCollection($this->medias),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
