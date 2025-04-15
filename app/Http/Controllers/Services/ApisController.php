<?php

namespace App\Http\Controllers\Services;

use App\Helper\APIMeta;
use App\Helper\APIShopee;
use App\Http\Controllers\Controller;
use App\Models\Apis;
use App\Models\Shared;
use App\Services\CommissionService;
use Illuminate\Http\Request;

class ApisController extends Controller
{
    public function index()
    {
        return Apis::get();
    }

    public function store(Request $request)
    {
        $search = ['api_type' => $request->input('api_type')];
        $data = [
            'app_id' => $request->input('app_id'),
            'secret_id' => $request->input('secret_id'),
            'client_id' => $request->input('client_id', null),
            'api_type' => $request->input('api_type'),
            'page_id' => $request->input('page_id',null),
            'instagram_id' => $request->input('instagram_id',null),
            'user_access_token' => $request->input('user_access_token', null),
        // 'page_a' => $request->input('page_id',null),
            'access_code' => $request->input('access_code')
        ];
        $api = Apis::updateOrCreate($search,$data);
        // $api->save();
        return ['api' => $api, 'request' => $request->all(),'data' => $data];
    }

    public function show($id)
    {
        return Apis::where('api_type',$id)->first();
    }
    public function update(Request $request, $id)
    {
        $access_code =$request->input('access_code');
        $long_live_access_token = $request->input('long_live_access_token', null);
        if($id == 'facebook')
            $access_code = $this->update_accesscode($request->input('access_code'));

        $api = Apis::where('api_type',$id)->first();
        $api->app_id = $request->input('app_id');
        $api->page_id = $request->input('page_id');
        $api->instagram_id = $request->input('instagram_id');
        $api->secret_id = $request->input('secret_id');
        $api->client_id = $request->input('client_id',null);
        $api->user_access_token = $request->input('user_access_token');
        $api->long_live_access_token = $long_live_access_token;
        $api->page_access_token = $request->input('page_access_token');
        $api->access_code = $access_code;
        $api->save();
        return response()->json(['api' => $api]);
    }
    public function destroy($id)
    {
        //
    }

    public function update_accesscode($access_code)
    {
        foreach($access_code['pages'] as $i => $page)
        {
            if(strpos($page['picture'],'scontent.') !== false){
                $image = 'storage/' . getImage($page['picture'], $page['id'],'facebook/');
                $access_code['pages'][$i]['picture'] = url($image);
            }
        }
        foreach($access_code['instagrams'] as $i => $page)
        {
            if(strpos($page['picture'],'scontent.') !== false){
                $image = 'storage/' . getImage($page['picture'],  $page['id'],'instagrams/');
                $access_code['instagrams'][$i]['picture'] = url($image);
            }
        }
        return $access_code;
    }

    public function facebookProfile()
    {
        $facebook = new APIMeta;
        $pages = $facebook->getPages();
        $listPages = $facebook->listPages();
        $feeds = $facebook->getFeeds();
        $profile = $facebook->getProfile();
        $picture = $facebook->getPicture($profile['id']);
        $page_picture = $facebook->getPicture($pages['id']);
        $debug = $facebook->debug();
        return [
            'pages' => $pages,
            'pagelist' => $listPages,
            'feeds' => $feeds, 
            'profile' => $profile,
            'picture' => $picture,
            'page_picture' => $page_picture,
            'debug' => $debug
        ];
    }

    public function shopeeReports()
    {
        $shopee = new APIShopee;
        $query = [];
        // $query[] = 'completeTimeStart: '. strtotime('2024-05-01');
        // $query[] = 'completeTimeEnd: '. time();
        $query[] = 'limit: 20';
        $queryString = implode(', ',$query);
        // return $queryString;
        $response = $shopee->getReports($queryString);
        return [
            'saleds' => $response['data']['conversionReport']['nodes'],
        ];
    }

    public function offerShop(Request $request)
    {
        $apis = Apis::where('api_type','shopee')->first();
        $shopee = new APIShopee;
        $query = [];
        $shared = 0;
        $query[] = "sortType: 3";

        $query[] = $request->input('field') . ': '. ( $request->input('field') == 'keyword' ? '"'. $request->input('value') .'"' : $request->input('value'));
        if($request->input('field') == 'shopId')
            $shared = Shared::where('shopId',$request->input('value'))->count();

        if($request->input('page'))
            $query[] = "page: ". $request->input('page');

        if($request->input('shopId'))
            $query[] = "shopId: ". $request->input('shopId');
        

        if($request->input('limit'))
            $query[] = "limit: ". $request->input('limit');

        if($request->input('shopType'))
            $query[] = "shopType: [{$request->input('shopType')}]";

        $response = $shopee->shopOffer(implode(', ',$query));
        return [
            'shopOffer' => $response['data']['shopOfferV2'], 
            'shared' => $shared,
            'apis' => $apis
        ];
    }
    public function updateAccesscode(Request $request)
    {
        $apis = Apis::where('api_type',$request->input('api_type'))->first();
        $apis->access_code = $request->input('access_code');
        $apis->save();
        return $apis;
    }

    public function getcommission()
    {
        $commission = app(CommissionService::class)->excuteCommission(1);
        return $commission;
        /*
        $shopee = new APIShopee();
        $query = [];
        $query[] = 'limit: 10';
        $queryString = implode(', ',$query);
        $response = $shopee->getReports($queryString);
        return $response;
        */
    }
}
