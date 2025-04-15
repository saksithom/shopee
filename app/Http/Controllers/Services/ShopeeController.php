<?php

namespace App\Http\Controllers\Services;

use App\Helper\APIShopee;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductsShopeeCollection;
use App\Models\Apis;
use Illuminate\Http\Request;

class ShopeeController extends Controller
{
    public function index(Request $request)
    {
        $nextpage   = $request->input('nextpage',1);
        $page       = $request->input('page',1);
        $items      = $this->getProducts($request, $nextpage > 1 ? $nextpage : $page);
        if(!isset($items['pageinfo']))
            return $items;
        
        $pageinfo   = $items['pageinfo'];
        $pageinfo['nextPage'] = $pageinfo['hasNextPage'] ? $items['page']+1 : $items['page'];
        $pageinfo['page'] = $page;
        $pageinfo['limit'] = $request->input('per_page',50);
        $pageinfo['total'] = count($items['products']); //$page;
        $collection = collect($items['products']);
        $products = $collection->sortBy([
            ['ratingStar','desc'],
            ['sales','desc']
        ]);

        $data = new ProductsShopeeCollection($products);
        // return $data;
        return response()->json(['data' => $data, 'meta' => $pageinfo]);
    }
    public function getProducts($request, $page = 1, $data = [])
    {
        $perPage = (int) $request->input('per_page',50);
        $query = [];
        if($request->input('field') && $request->input('keyword'))
            $query[$request->input('field')] = $request->input('keyword');

        if($request->input('shopId'))
            $query['shopId'] = $request->input('shopId');

        // if($request->input('field') && $request->input('keyword'))
        // print_r($query);
        $apis = Apis::select('access_code')->type('shopee')->first();
        $shopee = new APIShopee();
        $items = $shopee->getProducts($query,  50, $page);

        if (!isset($items['data']['productOfferV2']['nodes'])) {
            return response()->json(['products' =>[],'pageinfo' => null,'status' => 'error', 'message' => 'Invalid response from Shopee API. Please check the log for details.']);
        }
        
        $n = count($data) ?? 0;
        $products = $items['data']['productOfferV2']['nodes'];
        $pageinfo = $items['data']['productOfferV2']['pageInfo'];
        if(count($products) == 0 ){
            return ['products' =>[],'pageinfo' => null,'page' => $page];
        }

        foreach($products as $product)
        {
            if($apis->access_code){
                $roles = $this->productRole($product,$request);
                if(!$roles) continue;
            }

            $data[] = $product;
            $n++;
            if($n >= $perPage || count($data) >= $perPage)
                break;
        }
        if( $pageinfo['hasNextPage'] && (count($data) < $perPage)){
            return $this->getProducts($request,($page+1),$data);
        }
        return ['products' => $data,'pageinfo' => $pageinfo,'page' => $page];
    }
    public function productRole($product,$request)
    {
        if(!$product) return false;
        $x = 0;
        // print_r($access_code);
        if($request){
            $rating =  (float) $request->input('rating') ?? 4.5;
            $saled  =  (int) $request->input('sales') ?? 1;
            $price  =  (int) $request->input('price') ?? 1;
            $commission = (float) $request->input('commission') ?? 1;

            if((float) $product['ratingStar'] < $rating) $x++;
            if((int) $product['sales'] < $saled) $x++;
            if((int) $product['price'] < $price) $x++;
            if((float) $product['commission'] < $commission) $x++;

        }else{
            if ( (float) $product['ratingStar'] < 4.5) $x++;
            if ((int) $product['sales'] < 5) $x++;
        }
        return $x == 0 ? true : false;
    }

}
