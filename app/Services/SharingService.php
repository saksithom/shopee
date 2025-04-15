<?php

namespace App\Services;

use App\Helper\APIMeta;
use App\Helper\APIShopee;
use App\Http\Resources\ProductsShopeeCollection;
use App\Models\Apis;
use App\Models\Shared;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class SharingService
{
    protected $target = 4;
    protected $apis;
    public function __construct()
    {
        if (App::runningInConsole()) {
            return;
        }
    }

    public function executeSharing($page, $shared)
    {
        $limit = $this->target;
        $apis = Apis::select('access_code')->where('api_type','shopee')->first();
        if($apis && $apis->access_code)
            $limit = (int) $apis->access_code['limit'];
        $filters = $apis->access_code;

        $lastPage = Shared::select('shopee_page')->where('keyshare->key',$filters['key'])
                            ->where('keyshare->value',$filters['value'])
                            ->orderBy('shopee_page','desc')->first();
        if($lastPage && $lastPage->shopee_page != 0)
            $page = $lastPage->shopee_page;
        
        Log::channel('shopee_log')->notice('เริ่มการแชร์สินค้า โดยการค้นหาจากหน้าที่ '. $page);

        $sharing = $this->sharing($page, $limit,$shared);
        return $sharing;
    }

    public function sharing($page, $limit, $shared)
    {        

        $products = $this->shopeeProducts($page);
         
        foreach ($products['data'] as $product) {
            $share = $this->postFeeds($product,$products['page'] ?? 1);
            if ($share['status'] === true) {
                Log::channel('shopee_log')->info('แชร์สินค้าสำเร็จ ', ['product' => $product['productName']]);
                $shared++;
            }

            if ($shared >= $limit) break;
        }
        Log::channel('shopee_log')->notice('แชร์สินค้าไปแล้ว '. $shared .' รายการ จากที่ตั้งไว้ '. $limit .' รายการ/ครั้ง ถึงหน้า ' . $products['page']);        
        return $shared;
    }

    public function shopeeProducts($page,$data = [])
    {
        $query = null;
        $limit = (int) $this->target;
        $apis = Apis::select('access_code')->where('api_type','shopee')->first();
        if($apis && $apis->access_code !== null){
            $limit = (int) $apis->access_code['limit'];
            $query =  ["{$apis->access_code['key']}" => $apis->access_code['value']];
        }
        // Log::channel('shopee_log')->notice('ค้นหารายการสินค้าจากหน้าที่ : '. $page . ' ด้วย: '. $apis->access_code['key'] .'='. $apis->access_code['value']);
        $shopee = new APIShopee();
        $items = $shopee->getProducts($query,  10, $page);

        if (!isset($items['data']['productOfferV2']['nodes'])) {
            Log::channel('shopee_log')->error('ไม่พบรายการสินค้า ', ['response' => $items]);
            throw new Exception('Invalid response from Shopee API. Please check the log for details.');
        }
        
        $n = count($data) ?? 0;
        $products = $items['data']['productOfferV2']['nodes'];
        $pageinfo = $items['data']['productOfferV2']['pageInfo'];
        if(count($products) == 0 ){
            Log::channel('shopee_log')->warning('ได้ทำการแชร์สินค้าทั้งหมดแล้ว โปรดอัพเดทค่าการค้นหาสินค้าใหม่');
            return [];
        }

        foreach($products as $product)
        {
            if($apis->access_code){
                $roles = $this->productRole($product,$apis->access_code);
                if(!$roles['status']){
                    Log::channel('shopee_log')->warning('ข้ามรายการสินค้า '. $product['productName'] .' เนื่องจาก ' . $roles['messages'] .' ในหน้าที่ ' . $page );
                    continue;
                }
            }

            $data[] = $product;
            $n++;
            if($n >= $limit || count($data) >= $limit)
                break;
        }
        if( $n < $limit && $pageinfo['hasNextPage']){
            Log::channel('shopee_log')->notice('พบสินค้า '. $n .' รายการ '
                        .' จากหน้าที่ : '. $page 
                        .' ค้นหา: '. $apis->access_code['key'] 
                        .' ด้วย: '. $apis->access_code['value']
                        .' ค่า limit: '. $limit
                    );
            return $this->shopeeProducts(($page+1),$data);
        }
        $collection = collect($data);
        $productsData = $collection->sortBy([
            ['ratingStar','desc'],
            ['sales','desc']
        ]);

        return ['data' => new ProductsShopeeCollection($productsData), 'page' => $page];
    }
    public function productRole($product,$access_code = null)
    {
        if(!$product) return false;
        $x = 0;
        $ex = $this->checkexists($product['itemId']);
        if($ex) return ['status' => false,'messages' => 'สินค้าถูกแชร์ไปแล้วในเดือนนี้'];

        $message = [];
        if($access_code){
            $rating = isset($access_code['rating']) ? (float) $access_code['rating'] : 4.5;
            $saled = isset($access_code['saled']) ? (int) $access_code['saled'] : 1;
            $price = isset($access_code['price']) ? (int) $access_code['price'] : 1;
            $commission = isset($access_code['commission']) ? (float) $access_code['commission'] : 1;
            if((float) $product['ratingStar'] < $rating)
            {
                $message[] = 'Rating Start '. (float) $product['ratingStar'] .' มีค่าน้อยกว่าค่าที่ตั้งไว้ ' . $rating;
                $x++;
            } 
            if((int) $product['sales'] < $saled)
            {
                $message[] = 'ยอดขายขั้นต่ำ '. (float) $product['sales'] .' มีค่าน้อยกว่าค่าที่ตั้งไว้ ' . $saled;

                $x++;
            } 
            if((int) $product['price'] < $price) 
            {
                $message[] = 'ราคาสินค้า '. (int) $product['price'] .' มีค่าน้อยกว่าค่าที่ตั้งไว้ ' . $price;
                $x++;
            }
            if((int) $product['commission'] < $commission) 
            {
                $message[] = 'ค่าคอมมิชชั่น '. (int) $product['commission'] .' มีค่าน้อยกว่าค่าที่ตั้งไว้ ' . $commission;
                $x++;
            }

        }else{
            if ($product['ratingStar'] < 4.8 || $product['sales'] < 10) $x++;
        }
        return ['status' => ($x == 0 ? true : false), 'messages' => implode(' | ',$message)];
    }
    public function checkexists($itemId)
    {
        $month = Carbon::now()->month;
        $year = Carbon::now()->year;
        return Shared::where('itemId', $itemId)
                            ->whereMonth('updated_at', $month)
                            ->whereYear('updated_at', $year)
                            ->first();
    }
    public function getShop($shopId=null)
    {
        $shopee = new APIShopee();
        $shop = $shopee->shopOffer("shopId: {$shopId}");
        $shopData = $shop['data']['shopOfferV2']['nodes'] ?? null;
        return $shopData[0] ?? null;
    }

    public function postFeeds($data,$shopee_page = 1)
    {
        // try {
            $apis = Apis::select('access_code')->where('api_type','shopee')->first();
            $existing = $this->checkexists($data['itemId']);
            if ($existing) {
                Log::channel('shopee_log')->notice('รายการสินค้า '. $data['productName'] .' ได้ทำการแชร์ในเดือนนี้ไปแล้วเมื่อ '. date('d/m/Y H:i', strtotime($existing->updated_at)));
                return ['status' => false];
            }
            $x = 0;

            $shop = $this->getShop($data['shopId']);

            $productImage = 'storage/' . getImage($data['imageUrl'], $data['itemId']);
            $priceMin = intval($data['priceMin']);
            $priceMax = intval($data['priceMax']);
            $price = $priceMin < $priceMax ? nb($priceMin). '-'. nb($priceMax) : nb($data['price']);
            $caption = "พิกัดสินค้า: {$data['offerLink']}\n\n"
                        ."{$data['productName']}\n"
                        ."Ratting: {$data['ratingStar']}\n"
                        ."ราคา: {$price} ฿\n"
                        // ."พิกัดสินค้า: {$data['offerLink']}\n\n"
                        ."ร้านค้า: {$data['shopName']}\n"
                        .($shop ? "พิกัดร้าน: {$shop['offerLink']}\n\n": '');
                        // ."\n\n" . puthastag($data['productName'],5) . "\n\n";

            
            $facebook = new APIMeta();
            $imageResponses = $facebook->autoPostFeed($caption, $productImage);
            
            foreach($imageResponses as $index => $imageResponse)
            {
                if ($imageResponse->successful()) {
                    try{
                    
                        $search = ['itemId' => $data['itemId']];
                        $fields = [
                            // 'itemId' => $data['itemId'],
                            'productName' => $data['productName'],
                            'shopName' => $data['shopName'],
                            'imageUrl' => $data['imageUrl'],
                            'offerLink' => $data['offerLink'],
                            'productLink' => $data['productLink'],
                            'shopee_page' => $shopee_page,
                            'facebook_post_id' => $imageResponse->json()['post_id'],
                            'ratingStar' => $data['ratingStar'],
                            'shopId' => $data['shopId'],
                            'price' => $data['price'],
                            'commissionRate' => $data['commissionRate'],
                            'commission' => $data['commission'],
                            'shopOfferlink' => $shop['offerLink'] ?? null,
                            'keyshare' => $apis->access_code
                        ];
                        // if($index == 0)
                        Shared::updateOrCreate($search, $fields);
                        deleteShopeeImages();
                    
                        Log::channel('shopee_log')->info('บันทึกประวัติการแชร์สินค้า ', ['shop' => $shop['shopName'],'product' => $data['productName'],'page' => $shopee_page]);
                        // return ['status' => true,'page' => $shopee_page];
                    } catch (Exception $e) {
                        $x++;
                        Log::channel('shopee_log')->error('ไม่สามารถบันทคึกข้อมูลได้ เนื่องจาก ' . $e->getMessage());
                        // return ['status' => false];
                    }
                } else {
                    $errorDetails = $imageResponse->json();
                    Log::channel('shopee_log')->error('แชร์สินค้าล้มเหลว:'.  jsonEncode($errorDetails));
                    $x++;
                }
            }
            $igPost = $facebook->postInstagram($caption,$productImage);
            // Log::channel('shopee_log')->notice('Instagram Post : ' . jsonEncode($igPost));

            if($igPost['status'] == 'successful'){
                Log::channel('shopee_log')->info($data['productName'] . ' โพสไปยัง IG เรียบร้อยแล้ว '. "\n{$igPost['message']}");
            }else{
                // print_r($igPost);
                Log::channel('shopee_log')->error('เกิดข้อผิดพลาด IG', $igPost['message']);
            }
            return ['status' => ($x == 0), 'page' => $shopee_page];
        // } catch (Exception $e) {
        //     Log::channel('shopee_log')->critical('ร้ายแรง ไม่สมารถทำรายการได้เนื่องจาก : '. $e->getMessage());
        //     return ['status' => false];
        // }
    }
}
