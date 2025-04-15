<?php

use App\Http\Controllers\Automates\SharingController;
use App\Http\Controllers\Publics\FontendController;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/info',function(){
    $today = Carbon::today()->day; // วันที่ปัจจุบัน
    $currentMonth = Carbon::now()->month;
    $currentYear = Carbon::now()->year;

    $d = Carbon::create($currentYear, $currentMonth, 1)->startOfDay();
    return date('Y-m-d H:i:s', strtotime($d)); // $d;
    // return view('info');
});
Route::get('/medias', function () {
    $directory = 'shopee-images';
    $files = Storage::files($directory);

    // เพิ่มข้อมูลเวลาที่ไฟล์ถูกสร้างและจัดเรียง
    $sortedFiles = collect($files)->map(function ($file) {
        return [
            'file' => $file,
            'time' => Storage::lastModified($file), // เวลาที่ไฟล์ถูกแก้ไขล่าสุด
        ];
    })->sortByDesc('time');

    // วนลูปเพื่อแสดงผล
    foreach ($sortedFiles as $index => $fileData) 
    {
        echo $fileData['file'] . " - " . date("Y-m-d H:i:s", $fileData['time']) . "<br>";
            if($index >= 11)
                Storage::delete($fileData['file']);
    }
});

Route::get('/',[FontendController::class,'index']);
Route::get('/search',[FontendController::class,'search']);
// Route::get('/shop-offers',[FontendController::class,'shopoffers']);
// Route::get('/shop-offers/{id}',[FontendController::class,'shopoffers_product']);
Route::get('/product/{id}',[FontendController::class,'product']);

Route::get('/{any}', function () {
    return view('app'); // ใช้ view ที่สร้างไว้ก่อนหน้า
})->where('any', '.*');

