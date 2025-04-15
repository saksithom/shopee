<?php 
namespace App\Helper;

use App\Models\Apis;
use Exception;
use Illuminate\Support\Facades\Http;

class APIInstagram 
{
    protected $app_id;
    protected $secret_id;
    protected $access_token;
    protected $apiLink = 'https://graph.instagram.com/v22.0/';
    protected $fb;
    
    public function __construct()
    {
        $ig = Apis::where('api_type','instagram')->first();
        if(!$ig || is_null($ig->access_code ))
            return response()->json(['data' => []],200); //abort(401, 'Unauthorized');

        $user_access_token = $ig->user_access_token;

        if($ig->long_live_access_token){
            $ig_access_token = $ig->long_live_access_token;
        }
        else if($ig->access_code['long_access_token']['access_token'])
        {
            $ig_access_token = $ig->access_code['long_access_token']['access_token'];
        }
        $this->access_token = $ig_access_token;
        $this->fb = Http::withToken($user_access_token);

    }
    public function getPages()
    {   
        $endpoint = "{$this->apiLink}me/accounts";
        $response = $this->fb->get($endpoint);
        if($response->successful()){
            $callback = $response->json();
            // print_r($callback);
            // $page = null;
            // foreach($callback['data'] as $data)
            // {
            //     if($data['id'] == $this->page_id){
            //         $page = $data;
            //         break;
            //     }
            // }
            return $callback;
        }
        return null;
    }
    public function getFeeds($limit = 4)
    {
        

    }
}