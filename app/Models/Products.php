<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Products extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $fillable = [
        'itemid',
        'title',
        'shop_name',
        'seller_name',
        'cb_option',
        'stock',
        'item_sold',
        'shop_rating',
        'item_rating',
        'sale_price',
        'price',
        'like',
        'is_preferred_shop',
        'shopid',
        'global_category1',
        'global_category2',
        'global_category3',
        'shopee_verified_flag',
        'is_official_shop',
        'description',
        'seller_penalty_score',
        'condition',
        'discount_percentage',
        'model_names',
        'model_ids',
        'has_lowest_price_guarantee',
        'global_brand',
        'product_link',
        'product_short_link',
    ];
    public function scopeFilter ($query,$request){
        $fields = ['item_rating','shop_rating','item_sold','stock','price'];
        foreach($fields as $field)
        {
            if( $field != 'price'){
                if($request->has($field) && $request->input($field))
                $query->where($field,'>',$request->input($field));
            }else{
                if($request->has($field) && $request->input($field))
                $query->where('price', '>', $request->input($field))
                    ->orWhere('sale_price','>',$request->input($field));
            }
        }
        $fields2 = ['title','shop_name','itemid','shopid'];
        foreach(['title','shop_name','itemid','shopid'] as $field)
        {
                if($request->has($field) && $request->input($field))
                $query->where($field, 'like', '%'. $request->input($field) . '%');
        }
        if($request->has('itemsid') && $request->input('itemsid')){
            $itemsid = explode(',',$request->input('itemsid'));
            $query->whereIn('itemid', $itemsid);
        }

        if($request->has('field') && $request->input('field') && $request->has('keyword') && $request->input('keyword'))
            $query->where($request->input('field'),'like','%'. $request->input('keyword') .'%');

    }

    /**
     * Get all of the medies for the Products
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function medies(): HasMany
    {
        return $this->hasMany(Medias::class, 'ref_id')
                    ->orderBy('sortable');
    }
}
