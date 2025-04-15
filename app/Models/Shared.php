<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shared extends Model
{
    use HasFactory;
    protected $table = 'shareds';
    protected $casts =[
        'keyshare' => 'json'
    ];
    protected $fillable = [
        'itemId',
        'productName',
        'price',
        'commissionRate',
        'commission', 
        'shopName',
        'imageUrl',
        'offerLink',
        'productLink',
        'ratingStar',
        'shopId',
        'shopOfferlink',
        'facebook_post_id',
        'keyshare',
        'shopee_page',
        'page_id',
        'page_name',
        'page_type'
    ];

    public function scopeFilter($query,$request)
    {
        if($request->input('shopId'))
            $query->where('shopId', $request->input('shopId'));
        if($request->input('term'))
            $query->where('productName','like','%'. $request->input('term') .'%');
        
        if($request->input('keyword'))
            $query->where('keyshare->key','keyword')
                    ->where('keyshare->value',$request->input('keyword'));
                    
        if($request->input('productCatId'))
            $query->where('keyshare->key','productCatId')
                    ->where('keyshare->value',$request->input('productCatId'));
        
        if($request->input('page_id'))
            $query->where('page_id',$request->input('page_id'));
                    
        if($request->input('today') && $request->input('today') == 'yes')
            $query->whereDate('created_at',date('Y-m-d'));
                    
        if($request->input('updated'))
            $query->whereDate('updated_at',$request->input('updated'));
                                    
        if($request->input('today') && $request->input('today') == 'yes')
            $query->whereDate('updated_at',Carbon::today());
    }

    public function scopeThismonth($query)
    {
        $month = Carbon::now()->month;
        $year = Carbon::now()->year;
        $query->whereMonth('updated_at', $month)
             ->whereYear('updated_at', $year);
    }
}
