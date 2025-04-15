<?php

use App\Http\Controllers\Services\ApisController;
use App\Http\Controllers\Services\AuthenController;
use App\Http\Controllers\Services\CommissionController;
use App\Http\Controllers\Services\CsvreaderController;
use App\Http\Controllers\Services\DashboardController;
use App\Http\Controllers\Services\FacebookController;
use App\Http\Controllers\Services\LogsController;
use App\Http\Controllers\Services\MetaController;
use App\Http\Controllers\Services\SettingController;
use App\Http\Controllers\Services\SharedController;
use App\Http\Controllers\Services\ShopeeController;
use App\Http\Controllers\Services\UsersController;
use App\Models\Shared;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['prefix' => 'v1'], function(){
    Route::post('/auth/login',[AuthenController::class,'login']);
    Route::post('/facebook/login',[AuthenController::class,'facebookLogin']);
    Route::group(['middleware' => 'auth:sanctum'], function () {
        // Authen User
        Route::get('/auth/userinfo',[AuthenController::class,'userinfo']);
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::post('/auth/change-password',[AuthenController::class,'updatePassword']);
        Route::post('/auth/profile',[AuthenController::class,'updateProfile']);
        Route::get('/auth/logout',[AuthenController::class,'logout']);
        // Sharring History //
        Route::apiResource('shared',SharedController::class);
        // META API Sharring to facebook and instragram managements 
        // Route::apiResource('meta',MetaController::class);
        // APIs Sharring to facebook and instragram managements 
        Route::apiResource('apis',ApisController::class);
        Route::get('apis-facebook',[ApisController::class,'facebookProfile']);
        Route::get('apis-shopee',[ApisController::class,'shopeeReports']);
        Route::get('apis-instagram',[ApisController::class,'instagram']);
        Route::get('apis-commission',[ApisController::class,'getcommission']);
        Route::post('apis-accesscode',[ApisController::class,'updateAccesscode']);
        Route::post('apis-shopee-shop-offer',[ApisController::class,'offerShop']);

        // Facebook //
        Route::get('facebook/getfeeds',[FacebookController::class,'getFeeds']);
        Route::get('facebook/getpages',[FacebookController::class,'getPages']);
        Route::get('facebook/listpages',[FacebookController::class,'listPages']);
        Route::get('facebook/instagram',[FacebookController::class,'getInstragram']);
        Route::post('facebook/picture',[FacebookController::class,'picture']);
        Route::post('facebook/postfeed',[FacebookController::class,'postToFeed']);
        Route::post('facebook/refresh-token',[FacebookController::class,'refreshToken']);
        // Settings //
        Route::apiResource('settings',SettingController::class);
        // Dashboard View 
        Route::apiResource('dashboard',DashboardController::class);
        Route::get('dashboard-commissions',[DashboardController::class,'commissions']);
        Route::get('dashboard-posts',[DashboardController::class,'shared']);
        Route::apiResource('commions',CommissionController::class);
        Route::get('commions-total',[CommissionController::class,'totalCommission']);
        Route::get('commions-chunks',[CommissionController::class,'chunks']);
        // Logs View
        Route::apiResource('logs',LogsController::class);
        // User managements 
        Route::apiResource('users',UsersController::class);
        // Load and reader csv data
        Route::apiResource('/shopee-data',CsvreaderController::class);
        Route::apiResource('/shopee-products',ShopeeController::class);
        Route::post('/shopee-data-uploader',[CsvreaderController::class,'uploader']);
    });
});

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
