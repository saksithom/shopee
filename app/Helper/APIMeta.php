<?php 
namespace App\Helper;

use App\Models\Apis;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class APIMeta
{
    protected $app_id;
    protected $secret_id;
    protected $auth;
    protected $user;
    protected $pages = [];
    protected $page_id;
    protected $instagram_id;
    protected $client_token_access;
    protected $fb;
    protected $apiLink;
    protected $user_access_token;
    protected $app_access_token;
    protected $redirecturi;

    public function __construct()
    {
        $meta = Apis::where('api_type','facebook')->first();
        if(!$meta || is_null($meta->access_code ))
            return response()->json(['data' => []],200); //abort(401, 'Unauthorized');

        if($meta->long_live_access_token)
        {
            $user_access_token = $meta->long_live_access_token;
        }else{
            $user_access_token = $meta->user_access_token;
        }

        $this->auth = $meta;
        $this->user = $meta->access_code['user'];
        $this->pages = $meta->access_code['pages'] ?? [];
        $this->user_access_token    = $user_access_token;
        $this->secret_id            = $meta->secret_id;
        $this->app_id               = $meta->app_id;
        $this->client_token_access  = $meta->client_id;
        $this->page_id              = $meta->page_id;
        $this->instagram_id         = $meta->instagram_id;
        $this->apiLink              = 'https://graph.facebook.com/v22.0/';
        $this->redirecturi          = env('FACEBOOK_REDIRECT_URL');
        $this->app_access_token     = "{$this->app_id}|{$this->secret_id}";
        $this->fb = Http::withToken($user_access_token);
    }
    
    public function getPages($page_id = null)
    {   
        if($page_id == null)
            $page_id = $this->page_id;

        $endpoint = "{$this->apiLink}me/accounts";
        $response = $this->fb->get($endpoint,[
            'access_token' => $this->user_access_token,
            'fields' => 'id,name,picture,category,category_list,access_token'
        ]);
        if($response->successful()){
            $callback = $response->json();
            $page = [null];
            foreach($callback['data'] as $data)
            {
                if($data['id'] == $page_id){
                    $page = $data;
                    break;
                }
            }
            return $page;
        }
        return null;
    }
    public function listPages()
    {   
        $endpoint = "{$this->apiLink}me/accounts";
        $response = $this->fb->get($endpoint,[
            'access_token' => $this->user_access_token,
            'fields' => 'id,name,picture,category,category_list,access_token'
        ]);
        if($response->successful()){
            $callback = $response->json();
            return $callback['data'];
        }
        return  $response->json();
    }
    public function genInstagramID()
    {
        $igData = [];
        $pages = $this->listPages();
        foreach($pages as $page)
        {
            $endpoint = "{$this->apiLink}{$page['id']}";
            $ig = $this->fb->get($endpoint,[
                'access_token' => $page['access_token'],
                'fields' => 'instagram_business_account'
            ]);
            if($ig->successful()){
                $data = $ig->json();
                if(isset($data['instagram_business_account']))
                    $igData[] = ['id' => $data['instagram_business_account']['id'], 'access_token' => $page['access_token']];
            };
        }
        return $igData;
    }

    public function listInstagram()
    {
        $igs = [];
        $instagrams = $this->genInstagramID();
        foreach($instagrams as $igdata)
        {
            $endpoint = "{$this->apiLink}{$igdata['id']}";
            $ig = $this->fb->get($endpoint,[
                'access_token' => $igdata['access_token'],
                'fields' => 'username,name,profile_picture_url'
            ]);
            if($ig->successful()){
                $dataig = $ig->json();
                $igs[] = [...$dataig,'access_token' => $igdata['access_token']];
            };
        }
        return $igs;
    }
    public function getInstagram($instagram_id)
    {
        $instagram = null;
        $instagrams = $this->listInstagram();
        foreach($instagrams as $stg)
        {
            if($stg['id'] == $instagram_id){
                $igPic = "https://www.instagram.com/{$stg['username']}/?__a=1&__d=dis"; //$facebook->getPicture($stg['id']);
                $instagram = [
                    'id' => $stg['id'],
                    'access_token' => $stg['access_token'],
                    'name' => $stg['name'],
                    'username' => $stg['username'],
                    'picture' => $stg['profile_picture_url'] ?? $igPic,
                ];
                break;
            }
        }
        return $instagram;
    }
    public function getProfile()
    {
        $endpoint = "{$this->apiLink}me";
        $response = $this->fb->get($endpoint,[
            'fields' => 'id,name,email,picture'
        ]);
        if($response->successful())
            return $response->json();
          
        return null;
    }
    public function getPicture($user_id)
    {
        $endpoint = "{$this->apiLink}{$user_id}/picture";
        $response = $this->fb->get($endpoint,[
            'redirect' => false,
            'type' => 'large',
        ]);
        if($response->successful())
            return $response->json();
          
        return null;
    }

    public function debug()
    {
        $endpoint = "{$this->apiLink}debug_token";
        $response = $this->fb->get($endpoint, [
            'input_token' => $this->user_access_token,
            'access_token' => "{$this->app_id}|{$this->secret_id}"
        ]);
        if($response->successful())
            return $response->json();
        
        return null;
    }
    public function setLongLiveAccessToken($user_access_token)
    {
        $endpoint = "{$this->apiLink}debug_token";
        $response = $this->fb->get($endpoint, [
            'input_token' => $user_access_token,
            'access_token' => "{$this->app_id}|{$this->secret_id}"
        ]);
        if($response->successful()){
            $data = $response->json();
            return $data['access_token'];
        }
        
        return null;
    }
    public function testConnect()
    {   
        $endpoint = $this->apiLink . $this->page_id . '/?access_token='. $this->user_access_token;
        $response = $this->fb->get($endpoint);
        return $response;
    }

    public function getFeeds($limit = 4,$page_id = null)
    {
        if($page_id == null)
            $page_id = $this->page_id;

        $page = $this->getPages($page_id);
        if(!$page) return null;
        $endpoint = "{$this->apiLink}{$page['id']}/feed";
        $response = $this->fb->get($endpoint,[
            'fields' => 'id,message,full_picture,likes,comments,created_time,instagram_business_account',
            'limit' => $limit,
            'access_token' => $page['access_token']
        ]);
        // if($response->successful())
            return $response->json();
          
        // return null;

    }

    

    public function postFeed($request,$image,$page_id)
    {
        $page = $this->getPages($page_id);
        $endpoint = "{$this->apiLink}{$page['id']}/photos";

        $imageResponse = $this->fb->attach(
            'source', file_get_contents(public_path($image)), 'image.png'
        )->post($endpoint, [
            'access_token' => $page['access_token'],
            'caption' => $request->input('caption')
        ]);
        return $imageResponse;
    }
    
    public function autoPostFeed($page_id, $caption,$image)
    {
        if(empty($this->pages))
            return false;
        $imageResponse = [];
        foreach($this->pages as $pageData)
        {
            if(!$pageData['checked'] || !isset($pageData['checked']))
                continue;
            
            $page = $this->getPages($pageData['id']);
            $endpoint = "{$this->apiLink}{$page['id']}/photos";
            
            $imageResponse[] = $this->fb->attach(
                'source', file_get_contents(public_path($image)), 'image.png'
                )->post($endpoint, [
                    'access_token' => $page['access_token'],
                    'caption' => $caption
                ]);
            }
        return $imageResponse;
    }

    public function facebookPost($page_id, $caption,$image)
    {
        $page = $this->getPages($page_id);
        $endpoint = "{$this->apiLink}{$page['id']}/photos";

        $imageResponse = $this->fb->attach(
            'source', file_get_contents(public_path($image)), 'image.png'
        )->post($endpoint, [
            'access_token' => $page['access_token'],
            'caption' => $caption
        ]);
        return $imageResponse;
    }

    public function postInstagram($instagram_id,$caption,$imageUrl)
    {
        if(!$instagram_id)
        return false;

        $instagram = $this->getInstagram($instagram_id);
        $endpoint = "{$this->apiLink}{$instagram['id']}/media";
        $image = asset($imageUrl);
        $response = $this->fb->post($endpoint, [
            'access_token' => $instagram['access_token'],
            'caption' => $caption,
            'image_url' => $image,
        ]);

        if($response->successful()){      
            $responseData = $response->json();
            if (!isset($responseData['id'])) {
                return ['status' => 'error', 'message' => 'Media upload failed '. jsonEncode($responseData) .  ' imageUrl: ' . $image];
            }

            $endpoint_publish = "{$this->apiLink}{$instagram['id']}/media_publish";
            $publishResponse = Http::post($endpoint_publish, [
                'creation_id' => $responseData['id'],
                'access_token' => $instagram['access_token'],
            ]);

            return $publishResponse;
        }else{
            return ['status' => 'error', 'message' => $response->json()];
        }
        
    }
}