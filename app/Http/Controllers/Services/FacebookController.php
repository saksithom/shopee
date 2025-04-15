<?php

namespace App\Http\Controllers\Services;

use App\Helper\APIMeta;
use App\Helper\APIShopee;
use App\Http\Controllers\Controller;
use App\Models\Apis;
use App\Models\Setting;
use App\Models\Shared;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FacebookController extends Controller
{
    public function __construct()
    {
    }
    public function getFeeds(Request $request)
    {
        $facebook = new APIMeta();
        $feeds = $facebook->getFeeds($request->input('limit',4));
        return $feeds;
    }

    public function getPages()
    {
        $facebook = new APIMeta();
        $pages = $facebook->getPages();
        $feeds = $facebook->getFeeds();
        return response()->json([
            'pages' => $pages,
            'feeds' => $feeds,
        ]);
    }
    public function getInstragram($page_id, $access_token)
    {
        $fb = new APIMeta();
    }
    public function listPages()
    {
        $ig = [];
        $apis = Apis::type('facebook')->first();
        if(!$apis->access_code)
            return response()->json([
                'pages' => [],
                'feeds' => [],
                'status' => 'error',
                'message' => 'api not found'
            ],200);

        $facebook = new APIMeta();
        $pages = $facebook->listPages();
        $data = [];
        if(!isset($pages[0]['id']))
            return $pages;
        
        foreach($pages as $page)
        {
            $picture = $facebook->getPicture($page['id']);
            $data[] = [
                'id' => $page['id'],
                'name' => $page['name'],
                'category' => $page['category'],
                'picture' => $picture['data']['url'],
                'access_token' => $page['access_token'],
                'checked' => false
            ];
        }
        /*
        $instagrams = $facebook->listInstagram();
        foreach($instagrams as $stg)
        {
            $igPic = "https://www.instagram.com/{$stg['username']}/?__a=1&__d=dis"; //$facebook->getPicture($stg['id']);
            $ig[] = [
                'id' => $stg['id'],
                'access_token' => $stg['access_token'],
                'name' => $stg['name'],
                'username' => $stg['username'],
                'picture' => $stg['profile_picture_url'] ?? $igPic,
                'checked' => false
            ];
        }
        */
        return response()->json([
            'facebooks' => $data,
            'instagrams' => [] //$ig
        ]);
    }
    public function picture(Request $request)
    {
        $facebook = new APIMeta();
        $pic = $facebook->getPicture($request->input('user_id'));
        return $pic['data'] ?? null;
    }
    
    public function summaryData()
    {
        $facebook = new APIMeta;
        $pages = $facebook->getPages();
        $feeds = $facebook->getFeeds();
        $profile = $facebook->getProfile();
        $picture = $facebook->getPicture($profile['id']);
        $page_picture = $facebook->getPicture($pages['id']);
        $debug = $facebook->debug();
        return [
            'pages' => $pages, 
            'feeds' => $feeds,
            'profile' => $profile,
            'picture' => $picture,
            'page_picture' => $page_picture,
            'debug' => $debug
        ];
    }
    public function postToFeed(Request $request)
    {
            $setting = Setting::where('page_id',$request->input('page_id'))->first();
            if(!$setting)
                return response()->json(['error' => 'Failed to post', 'details' => 'Page not found.'], 204);
            $page_id = $setting->page_id;
            $page = $setting->page;

            $month = Carbon::now()->month;
            $year = Carbon::now()->year;
            $item = Shared::where('itemId',$request->input('itemId'))
                            ->where('page_id',$setting->page_id)
                            ->whereMonth('updated_at',$month)
                            ->whereYear('updated_at',$year)
                            ->first();
            if($item)
                return response()->json(['error' => 'Failed to post', 'details' => 'This product posted this month.'], 204);

            $shopee = new APIShopee();
            $products = $shopee->getProducts(['itemId' => $request->input('itemId')]);
            if(!isset($products['data']['productOfferV2']['nodes'][0]))
                return response()->json(['error' => 'Failed to post', 'details' => 'Product not found.'], 204);

            $data = $products['data']['productOfferV2']['nodes'][0];

            $shops = $shopee->shopOffer("shopId: {$data['shopId']}");
            $shopData = $shops['data']['shopOfferV2']['nodes'] ?? null;
            $shop = $shopData[0] ?? null;
    
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
            $imageResponse = $facebook->facebookPost($page_id, $caption, $productImage);
            if ($imageResponse->successful()) {                
                    $search = ['itemId' => $data['itemId']];
                    $fields = [
                        'productName' => $data['productName'],
                        'shopName' => $data['shopName'],
                        'imageUrl' => $data['imageUrl'],
                        'offerLink' => $data['offerLink'],
                        'productLink' => $data['productLink'],
                        'shopee_page' => 0,
                        'facebook_post_id' => $imageResponse->json()['post_id'],
                        'ratingStar' => $data['ratingStar'],
                        'shopId' => $data['shopId'],
                        'price' => $data['price'],
                        'commissionRate' => $data['commissionRate'],
                        'commission' => $data['commission'],
                        'shopOfferlink' => $shop['offerLink'] ?? null,
                        'keyshare' => ['key' => $setting->options['field'],'value' => $setting->options['value']],
                        'page_id' => $page_id,
                        'page_name' => $page['name'],
                        'page_type' => $setting['page_type']
                    ];
                    Shared::updateOrCreate($search, $fields);
                    deleteShopeeImages();
                    return response()->json(['message' => 'Post successfully created!']);
            }

    }
}
