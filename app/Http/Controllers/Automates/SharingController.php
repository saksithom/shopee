<?php

namespace App\Http\Controllers\Automates;

use App\Helper\APIMeta;
use App\Helper\APIShopee;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductsShopeeCollection;
use App\Models\Apis;
use App\Models\Shared;
use Carbon\Carbon;
use Exception;
use Facebook\Facebook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;

class SharingController extends Controller
{
    protected $target = 4;
    protected $apis;
    public function __construct()
    {
        $this->apis = Apis::where('api_type','shopee')->first();
        
    }
    public function index($page,$shared)
    {     
        $sharing = $this->sharing($page,$shared);
        if($sharing != $this->target)
        {
            $page++;
            return '<h2 style="color:red">Shared not successful!</h2>';
            // return redirect('https://affiliates.saiimogdev.com/auto-share/'. $page .'/'. $sharing);
        }
        return '<h2 style="color:green">Shared successful!</h2>';

    }

    public function sharing($page,$shared)
    {
        if($this->apis->access_code)
            $this->target = $this->apis->access_code['limit'];
        $products = $this->shopeeProducts($page);
        foreach($products as $product)
        {
            if($product['ratingStar'] < 4.5 || $product['sales'] < 5) continue;

            $share = $this->postFeeds($product);
            if($share['status'] == true){
                echo '<div style="color:green">'. $share['message'] .'</div>';
                $shared++;
            }else{
                echo '<div style="color:red">'. $share['message'] .'</div>';
            }
    
            if($shared == $this->target)
                break;
        }
        if($shared < $this->target)
            return $this->sharing(($page+1), $shared);
        return $shared;
    }

    public function shopeeProducts($page)
    {
        $query = null;
        if($this->apis->access_code)
            $query = ["{$this->apis->access_code['key']}" => $this->apis->access_code['value']];

        $shopee = new APIShopee;
        $items = $shopee->getProducts($query,50,$page);
        $products = $items['data']['productOfferV2']['nodes'];
        return new ProductsShopeeCollection($products);

    }

    public function postFeeds($data)
    {
        try {
            $month = Carbon::now()->month;
            $year = Carbon::now()->year;
            $item = Shared::where('itemId',$data['itemId'])
                            ->whereMonth('updated_at',$month)
                            ->whereYear('updated_at',$year)
                            ->first();
            if($item)
                return ['status' => false, 'message' => 'สินค้า '. $data['productName'] .'เคยแชร์ไปแล้วในเดือนนี้'];

            $productImage = 'storage/' . getImage($data['imageUrl'],$data['itemId']);
            $caption =  "{$data['productName']}"
                        ."\n Ratting : {$data['ratingStar']}"
                        ."\n ราคา : ". ( $data['priceMin'] != $data['priceMax'] ? $data['priceMin'] ."-". $data['priceMax'] : $data['price']) . " ฿.-"
                        . "\n พิกัดสินค้า : {$data['offerLink']}";

            $facebook = new APIMeta();    
            $imageResponse = $facebook->autoPostFeed($caption,$productImage);

            if ($imageResponse->successful()) {
                $result = $imageResponse->json();
                $search = [
                    'itemId' => $data['itemId']
                ];
                $productData = [
                        'itemId' => $data['itemId'],
                        'productName' => $data['productName'],
                        'shopName' => $data['shopName'],
                        'imageUrl' => $data['imageUrl'],
                        'offerLink' => $data['offerLink'],
                        'productLink' => $data['productLink'],
                        'facebook_post_id' => $result['post_id'],
                        'ratingStar' => $data['ratingStar'],
                        'shopId' => $data['shopId']
                ];
                
                Shared::firstOrCreate($search,$productData);
                deleteShopeeImages();
                return ['status' => true, 'message' => 'แชร์สินค้า '. $data['productName'] .' สำเร็จ'];
            } else {
                return ['status' => false, 'message' => 'แชร์สินค้าไม่สำเร็จ เนื่องจาก '. $imageResponse->json()];
            }
            
        } catch (Exception $e) {
            return ['status' => false, 'message' => 'Error occurred ' . $e->getMessage()];
        }
        
    }
}
