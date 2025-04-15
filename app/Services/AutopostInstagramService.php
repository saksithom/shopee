<?php
namespace App\Services;

use App\Helper\APIMeta;
use App\Helper\APIShopee;
use App\Http\Resources\ProductsShopeeCollection;
use App\Models\Setting;
use App\Models\Shared;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;

class AutopostInstagramService
{
    protected $page_id;
    protected $limit = 5;
    protected $options;
    protected $page;
    protected $page_type;
    public function __construct($page_id)
    {
        if (App::runningInConsole() && $this->isMigrationCommand()) {
            return;
        }

        $this->page_id = $page_id;
        $item = Setting::where('page_id',$page_id)->first();
        if($item){
            $option = $item->options;
            $this->options = $option;
            $this->limit = $option['limit'];
            $this->page = $item->page;
            $this->page_type = $item->type;
        }
    }
    
    protected function isMigrationCommand()
    {
        $commands = ['migrate', 'migrate:install', 'migrate:refresh', 'migrate:reset', 'migrate:rollback'];
        return isset($_SERVER['argv'][1]) && in_array($_SERVER['argv'][1], $commands);
    }
    
    public function executePost()
    {
        $shared = 0;
        $pageNo = 0;
        $filters = $this->options;
        $lastPage = Shared::select('shopee_page')->where('keyshare->key',$filters['field'])
                            ->where('keyshare->value',$filters['value'])
                            ->where('page_id',$this->page_id)
                            ->orderBy('shopee_page','desc')->first();

        if($lastPage && $lastPage->shopee_page != 0)
            $pageNo= $lastPage->shopee_page;
        
        Log::channel('shopee_log')->notice('เริ่มการแชร์สินค้า ไปที่ '. $this->page['name'] .'('. $this->page_type .') โดยการค้นหาจากหน้าที่ '. $pageNo);

        $posting = $this->posting($pageNo,$shared);
        return $posting;
    }

    public function posting($pageNo, $shared)
    {        

        $products = $this->shopeeProducts($pageNo);
         
        foreach ($products['data'] as $product) {
            $share = $this->postFeeds($product,$products['page'] ?? 1);
            if ($share['status'] === true) {
                Log::channel('shopee_log')->info('แชร์สินค้าสำเร็จ ', ['product' => $product['productName']]);
                $shared++;
            }

            if ($shared >= $this->limit) break;
        }
        Log::channel('shopee_log')->notice('แชร์สินค้าไปแล้ว '. $shared .' รายการ จากที่ตั้งไว้ '. $this->limit .' รายการ/ครั้ง ถึงหน้า ' . $products['page']);        
        return $shared;
    }

    public function shopeeProducts($page,$data = [])
    {
        $query = null;
        $limit = (int) $this->limit;
        if($this->options){
            $query =  ["{$this->options['field']}" => $this->options['value']];
        }

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
            if($this->options){
                $roles = $this->productRole($product,$this->options);
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
                        .' ค้นหา: '. $this->options['field'] 
                        .' ด้วย: '. $this->options['value']
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
    public function productRole($product,$option = null)
    {
        if(!$product) return false;
        $x  = 0;
        $ex = $this->checkexists($product['itemId']);
        if($ex) return ['status' => false,'messages' => 'สินค้าถูกแชร์ไปแล้วในเดือนนี้'];

        $message = [];
        if($option){
            $rating = isset($option['rating']) ? (float) $option['rating'] : 4.5;
            $sales = isset($option['sales']) ? (int) $option['sales'] : 1;
            $price = isset($option['minprice']) ? (int) $option['minprice'] : 1;
            $commission = isset($option['mincommission']) ? (float) $option['mincommission'] : 1;
            if((float) $product['ratingStar'] < $rating)
            {
                $message[] = 'Rating Start '. (float) $product['ratingStar'] .' มีค่าน้อยกว่าค่าที่ตั้งไว้ ' . $rating;
                $x++;
            } 
            if((int) $product['sales'] < $sales)
            {
                $message[] = 'ยอดขายขั้นต่ำ '. (float) $product['sales'] .' มีค่าน้อยกว่าค่าที่ตั้งไว้ ' . $sales;

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
                            ->where('page_id',$this->page_id)
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
                        ."ร้านค้า: {$data['shopName']}\n"
                        .($shop ? "พิกัดร้าน: {$shop['offerLink']}\n\n": '');
                        // ."\n\n" . puthastag($data['productName'],5) . "\n\n";

            
            $facebook = new APIMeta();
            $igPost = $facebook->postInstagram($this->page_id, $caption, $productImage);
            Log::channel('shopee_log')->info('instagram response : '. jsonEncode($igPost), ['instagrams' => $igPost,'page' => $shopee_page]);

            if ($igPost->successful()) {                
                $search = ['itemId' => $data['itemId']];
                $fields = [
                    'productName' => $data['productName'],
                    'shopName' => $data['shopName'],
                    'imageUrl' => $data['imageUrl'],
                    'offerLink' => $data['offerLink'],
                    'productLink' => $data['productLink'],
                    'shopee_page' => $shopee_page,
                    'facebook_post_id' => null, //$imageResponse->json()['post_id'],
                    'ratingStar' => $data['ratingStar'],
                    'shopId' => $data['shopId'],
                    'price' => $data['price'],
                    'commissionRate' => $data['commissionRate'],
                    'commission' => $data['commission'],
                    'shopOfferlink' => $shop['offerLink'] ?? null,
                    'keyshare' => ['key' => $this->options['field'],'value' => $this->options['value']],
                    'page_id' => $this->page_id,
                    'page_name' => $this->page['name'],
                    'page_type' => 'instagram'
                ];
                Shared::updateOrCreate($search, $fields);
                deleteShopeeImages();
                // Log::channel('shopee_log')->info('บันทึกประวัติการแชร์สินค้า ', ['shop' => $shop['shopName'],'product' => $data['productName'],'page' => $shopee_page]);
                }
                return $shopee_page;
    }
}