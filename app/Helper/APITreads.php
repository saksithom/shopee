<?php 
namespace App\Helper;

use App\Models\Apis;
use Exception;
use Illuminate\Support\Facades\Http;

class APITreads
{
    protected $app_id;
    protected $secret_id;
    protected $auth;
    protected $page_id;
    protected $client_token_access;
    protected $fb;
    protected $apiLink;
    protected $user_access_token;
    protected $app_access_token;

    public function __construct()
    {
        $meta = Apis::where('api_type','treads')->first();
        if(!$meta || is_null($meta->access_code ))
            return response()->json(['data' => []],200); //abort(401, 'Unauthorized');

        $user_access_token = $meta->user_access_token;

        if($meta->long_live_access_token){
            $user_access_token = $meta->long_live_access_token;
        }else if($meta->access_code['long_access_token']['access_token'])
        {
            $user_access_token = $meta->access_code['long_access_token']['access_token'];
        }

        $this->auth = $meta;
        $this->user_access_token    = $user_access_token;
        $this->secret_id            = $meta->secret_id;
        $this->app_id               = $meta->app_id;
        $this->client_token_access  = $meta->client_id;
        $this->page_id              = $meta->page_id;
        $this->apiLink              = 'https://graph.threads.net/';
        $this->fb = Http::withToken($user_access_token);
    }
    
    public function createLongAccessToken()
    {
        $endpoint = "{$this->apiLink}oauth/access_token";
        $response = $this->fb->get($endpoint,[
                    'client_id' => $this->app_id,        // Facebook App ID
                    'client_secret' => $this->secret_id, // Facebook App Secret
                    'grant_type' => 'fb_exchange_token',
                    'fb_exchange_token' => $this->user_access_token
                ]);
        return $response->json() ?? null; 
    }
}