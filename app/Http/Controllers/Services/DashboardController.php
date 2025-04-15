<?php

namespace App\Http\Controllers\Services;

use App\Helper\APIMeta;
use App\Helper\APIShopee;
use App\Http\Controllers\Controller;
use App\Http\Resources\CommissionCollection;
use App\Http\Resources\SharedCollection;
use App\Models\Apis;
use App\Models\Commission;
use App\Models\Shared;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $apis = Apis::orderBy('id')->get();
        $data = [];
        foreach($apis as $api){
            if( $api->api_type == 'shopee')
                $data['shopee'] = $api;
            if( $api->api_type == 'facebook')
                $data['facebook'] = $api;
        }
        return $data;
    }

    public function apis()
    {
        $apis = Apis::orderBy('id')->get();
        return $apis;
    }

    public function commissions(Request $request)
    {
        $items = Commission::orderBy('purchaseTime','desc')
                        ->orderBy('clickTime','desc')
                        ->paginate($request->input('per_page',24));
        return new CommissionCollection($items);
    }

    public function shared(Request $request)
    {
        $shared = Shared::orderBy('updated_at','desc')->paginate($request->input('per_page', 12));
        return new SharedCollection($shared);
    }

    public function facebookProfile()
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

    public function shopeeReport()
    {
        $shopee = new APIShopee;
        $query = [];
        // $query[] = 'completeTimeStart: '. strtotime('2024-05-01');
        // $query[] = 'completeTimeEnd: '. time();
        $query[] = 'limit: 20';
        $queryString = implode(', ',$query);
        $response = $shopee->getReports($queryString);
        return [
            'saleds' => $response['data']['conversionReport']['nodes'],
        ];
    }

}
