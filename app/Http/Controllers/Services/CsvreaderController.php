<?php

namespace App\Http\Controllers\Services;

use App\Helper\APIShopee;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductsCollection;
use App\Jobs\ProcessCsvShopeeDataBatchJob;
use App\Jobs\ShopeeCsvToJsonJob;
use App\Models\Medias;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CsvreaderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $data = [];
        $itemsid = [];
        $jsonfile = 'shopee-data/products-lists.json';
        if(!Storage::exists($jsonfile))
            return response()->json(collect([]));

        $jsondata = Storage::get($jsonfile);
        $data['api'] = json_decode($jsondata,true);

        if($data['api']){
            foreach($data['api'] as $item)
            {
                $itemsid[] = $item;
            }
        }

        /*
        $items = Products::filter($request);
        if(count($itemsid) > 0)
            $items = $items->whereIn('itemid',$itemsid);

        $items = $items->paginate($request->input('per_page',50));
        */
        $data['products'] =  [];
        return response()->json($data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = [];
        $itemsid = [];
        if($request->hasFile('file')){

            $file = $request->file('file');
            $path = '/storage/csv-shopee/';
            $path_storage = str_replace('/storage','',$path);
            $csvname = 'products-commission-links.csv';
            $csvfile = $path . $csvname;

            if (Storage::exists($csvfile))
                Storage::delete($csvfile);

            if (!Storage::exists($path_storage)) {
                Storage::makeDirectory($path_storage);
            }

            $file->storeAs($path_storage,$csvname);
            // รหัสสินค้า,ชื่อสินค้า,ราคา,ขาย,ชื่อร้านค้า,อัตราค่าคอมมิชชัน,คอมมิชชัน,ลิงก์สินค้า,ลิงก์ข้อเสนอ
            $header = ['itemid','title','price','item_sold','shop_name','commission_percent','commission','product_link','afiliate_link'];
            $handle = fopen(public_path($path . $csvname), 'r');
            $rows = 0;
            while (($row = fgetcsv($handle)) !== false) 
            {
                if(!is_numeric($row[0])) continue;
                $rows++;
                try 
                {
                    
                    $data[] = array_combine($header, $row);
                }catch (\Exception $e) {
                    Log::error('Error processing row: '. $rows ); //. ' : ' . $e->getMessage());
                    continue;
                }
            }
            $jsonfile = '/shopee-filter/products-filters.json';
            if (!Storage::exists('shopee-filter'))
                Storage::makeDirectory('shopee-filter');
            if(Storage::exists($jsonfile))
                Storage::delete($jsonfile);

            if(!empty($data))
            {
                // print_r($data);
                $shopee = new APIShopee();
                $jsonfile = 'shopee-data/products-lists.json';
                $jsonData = [];
                foreach($data as $val)
                {
                    
                    $product = $shopee->getProducts($val['itemid']);
                    if(isset($product['data']['productOfferV2']['nodes'][0]))
                        $jsonData[] = $product['data']['productOfferV2']['nodes'][0];
                }
                foreach($jsonData as $json)
                {
                    $itemsid[] = $json['itemId'];
                }
                Storage::put($jsonfile,json_encode($jsonData,JSON_UNESCAPED_UNICODE));
            }
        }

        return response()->json([
            'status' => 'success',
            'field' => $request->input('field'),
            'keyword' => $request->input('keyword'),
            'itemsid' => $itemsid,
            'jsonfile' => $data,
            'collection' => collect($data)
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $path = '/storage/csv-shopee/';
        $filename = 'products-cv-filter.json';        
        $jsonfile = $path . $filename;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if(!$request->hasFile('file')) return response()->json(collect([]));

        $file = $request->file('file');
        $path = '/storage/master-data/';
        $filename = 'shopee-master-data.csv';
        $path_storage = str_replace('/storage','',$path);
        if (Storage::exists($path_storage.$filename))
            Storage::delete($path_storage.$filename);

        if (!Storage::exists($path_storage)) {
            Storage::makeDirectory($path_storage);
        }
        $file->storeAs($path_storage,$filename);
        return response()->json(['status' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $path = '/storage/master-data/';
        $filename = 'products-lists.json';
        $path_storage = str_replace('/storage','',$path);
        if (Storage::exists($path_storage.$filename))
            Storage::delete($path_storage.$filename);
        return response()->noContent();
    }

    public function uploader(Request $request)
    {
        if(!$request->hasFile('file')) return response()->json(collect([]));

        $file = $request->file('file');
        $shopeeData = Storage::disk('public')->files('shopee-data');
        Storage::disk('public')->delete($shopeeData);

        // อ่านข้อมูลจากไฟล์ CSV
        $csvData = array_map('str_getcsv', file($file->getRealPath()));

        // นำข้อมูลจาก CSV มาแปลงเป็น JSON
        $jsonData = [];
        $headers = str_replace(' ', '_',$csvData[0]); // แถวแรกเป็น headers
        $headers = str_replace('﻿','',$headers);
        // print_r($headers);
        unset($csvData[0]); // เอา header ออก

        foreach ($csvData as $index => $row) {
            // if($index > 5)break;
            if (count($row) === count($headers))
            $jsonData[] = array_combine($headers, $row);
        }

        // แบ่งข้อมูลออกเป็นช่วงๆ
        $chunks = array_chunk($jsonData, 100); // กำหนดจำนวนรายการต่อช่วงที่ต้องการแบ่ง เช่น 10 รายการต่อช่วง

        // บันทึกไฟล์ JSON (ถ้าต้องการบันทึก)
        Products::truncate();
        foreach($chunks as $index => $items){
            foreach($items as $item){
                Products::create($item);
                // Storage::disk('public')->put('/shopee-data/products-'. date('dmY') .'.json', json_encode($json, JSON_PRETTY_PRINT));
            }
        }

        return response()->json($chunks);
    }
}
