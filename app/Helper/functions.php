<?php

use Carbon\Carbon;
use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
    function setShopeeObjectData($item,$line): array
    {
        return [
            'image_link_4' => $item[0] ?? '',
            'cb_option' => $item[1] ?? '',
            'global_category1' => $item[2] ?? '',
            'stock' => $item[3] ?? '',
            'item_sold' => $item[4] ?? '',
            'is_preferred_shop' => $item[5] ?? '',
            'title' => $item[6] ?? '',
            'shopid' => $item[7] ?? '',
            'model_prices' => $item[8] ?? '',
            'global_category2' => $item[9] ?? '',
            'sale_price' => $item[10] ?? '',
            'like' => $item[11] ?? '',
            'shopee_verified_flag' => $item[12] ?? '',
            'global_catid2' => $item[13] ?? '',
            'is_item_welcome_package' => $item[14] ?? '',
            'is_official_shop' => $item[15] ?? '',
            'global_catid3' => $item[16] ?? '',
            'description' => $item[17] ?? '',
            'seller_penalty_score' => $item[18] ?? '',
            'global_catid1' => $item[19] ?? '',
            'image_link_3' => $item[20] ?? '',
            'additional_image_link' => $item[21] ?? '',
            'image_link_9' => $item[22] ?? '',
            'image_link_7' => $item[23] ?? '',
            'global_category3' => $item[24] ?? '',
            'global_item_attributes' => $item[25] ?? '',
            'condition' => $item[26] ?? '',
            'discount_percentage' => $item[27] ?? '',
            'model_names' => $item[28] ?? '',
            'image_link_6' => $item[29] ?? '',
            'holiday_mode_on' => $item[30] ?? '',
            'itemid' => $item[31] ?? '',
            'model_ids' => $item[32] ?? '',
            'has_lowest_price_guarantee' => $item[33] ?? '',
            'shop_sku_count' => $item[34] ?? '',
            'image_link_10' => $item[35] ?? '',
            'shop_rating' => $item[36] ?? '',
            'item_rating' => $item[37] ?? '',
            'seller_name' => $item[38] ?? '',
            'price' => $item[39] ?? '',
            'image_link_8' => $item[40] ?? '',
            'image_link' => $item[41] ?? '',
            'shop_name' => $item[42] ?? '',
            'global_brand' => $item[43] ?? '',
            'image_link_5' => $item[44] ?? '',
            'product_link' => $item[45] ?? '',
            'product_short_link' => $item[46] ?? '',
            "line" => $line,
        ];
    }

    function shopeeDataCollection()
    {
        ini_set('max_execution_time', 0); 
        $file = public_path('/storage/imports/shopee-product-data-20241013.csv');
        $data = [];
    if (($handle = fopen($file, 'r')) !== false) {
            $line = 0;
            while (($row = fgetcsv($handle, 1000, ",")) !== false) {
                // if($line == 0 ) continue;
                $itemData = setShopeeObjectData($row,$line);
                if(!is_numeric($itemData['shop_rating']) || !is_numeric($itemData['item_sold'])) continue;
                if($itemData['item_rating'] < 4.8 ) continue;
                if($itemData['shop_rating'] < 4.8 ) continue;
                if($itemData['item_sold'] < 10 ) continue;
                if($itemData['stock'] < 10 ) continue;
                if($itemData['image_link_5'] == '' ) continue;
                if(intval($itemData['sale_price']) < 150 || intval($itemData['price']) < 150 ) continue;
                if($itemData['is_preferred_shop'] == 'Non-Preferred shop') continue;
                $data[] = setShopeeObjectData($row,$line);
                $line++;
            }
            fclose($handle);
            return ['status' => 'success', 'data' => collect($data), 'total' => count($data)];
        } else {
            return ['status' => 'error', 'data' => collect([]),'total' => 0];
        }
    }

    function shopeeCsvReader($file)
    {
        $data = [];
        if (($handle = fopen($file, 'r')) !== false) {
            $line = 0;
            while (($row = fgetcsv($handle, 1000, ",")) !== false) {
                // if($line == 0 ) continue;
                $itemData = setShopeeObjectData($row,$line);
                if(!is_numeric($itemData['shop_rating']) || !is_numeric($itemData['item_sold'])) continue;
                $data[] = setShopeeObjectData($row,$line);
                $line++;
            }
            fclose($handle);
            return ['status' => 'success', 'data' => collect($data), 'total' => count($data)];
        } else {
            return ['status' => 'error', 'data' => collect([]),'total' => 0];
        }
    }
    function getImage($image_url,$name = '',$path = 'shopee-images/')
    {
        $imageContent = file_get_contents($image_url);

        if ($imageContent === false) {
            return response()->json(['error' => 'Unable to fetch image'], 500);
        }

        // ตั้งชื่อไฟล์
        $imageName = str_replace(' ', '-',( $name ? $name : basename($image_url) ) ).'-'. date('YmdHis') . '.jpg';

        // บันทึกภาพลงใน storage/app/public/images
        Storage::disk('public')->put($path . $imageName, $imageContent);
        return $path .$imageName;
    }
    // Meta API Share And Delete //
    function getTokenaccess()
    {
        $client_id = env('META_APP_ID'); // แทนที่ด้วย Facebook App ID ของคุณ
        $client_secret = env('META_APP_SECRET'); // แทนที่ด้วย Facebook App Secret ของคุณ

        // URL ที่จะทำการร้องขอ Access Token
        $url = "https://graph.facebook.com/oauth/access_token?" . http_build_query([
            'client_id' => $client_id,
            'client_secret' => $client_secret,
            'grant_type' => 'client_credentials'
        ]);

        // เริ่มการใช้งาน cURL
        $ch = curl_init();

        // ตั้งค่า cURL
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // ส่งคำขอ
        $response = curl_exec($ch);

        // ตรวจสอบว่ามีข้อผิดพลาดหรือไม่
        $data = null;
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        } else {
            $data = json_decode($response, true);
        }

        // ปิด cURL
        curl_close($ch);
        return $data;
    }
    function uploadPhotoToFacebook($image,$token_access)
    {
        try {
            $fb = new Facebook([
                'app_id' => env('META_APP_ID'),
                'app_secret' => env('META_APP_SECRET'),
                'default_graph_version' => 'v21.0',
            ]);
            $response = $fb->post('/'. env('FACEBOOK_PAGE_ID') .'/photos', [
                'url' => $image,
                'access_token' => $token_access,
            ]);
            return $response->getGraphNode();
        } catch (FacebookResponseException $e) {
            // Handle error from Graph API
            return null;
        } catch (FacebookSDKException $e) {
            // Handle error from SDK
            return null;
        }
    }

    function shareMetaFacebookFeed($photo_ids,$message,$tokenAccess)
    {
        $fb = new Facebook([
            'app_id' => env('META_APP_ID'),
            'app_secret' => env('META_APP_SECRET'),
            'default_graph_version' => 'v12.0',
        ]);

        try {
            $fb->post('/'. env('FACEBOOK_PAGE_ID') .'/feed', [
                'message' => $message,
                'attached_media' => array_map(fn($id) => ['media_fbid' => $id], $photo_ids),
                'access_token' => $tokenAccess,
            ]);
        } catch (FacebookResponseException $e) {
            // Handle error from Graph API
        } catch (FacebookSDKException $e) {
            // Handle error from SDK
        }
    }
    function shareFacebookfeed($request)
    {
        $page_id = env('FACEBOOK_PAGE_ID'); //'page_id'; // แทนที่ด้วย ID ของเพจของคุณ
        $message = 'your_message_text'; // ข้อความที่ต้องการโพสต์
        $access_token = env('FACEBOOK_PAGE_ACCESS_TOKEN'); //'page_access_token'; // Access Token ของเพจ
        
        // URL สำหรับการโพสต์ไปยัง feed ของเพจ
        $url = "https://graph.facebook.com/v21.0/$page_id/feed";
        
        // ข้อมูลที่จะส่งในรูปแบบ JSON
        $data = [
            'message' => $request->input('message'),
            'access_token' => $access_token,
        ];
        
        // แปลงข้อมูลเป็น JSON
        $jsonData = json_encode($data);
        
        // เริ่มการใช้งาน cURL
        $ch = curl_init();
        
        // ตั้งค่า cURL
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($jsonData)
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        // ส่งคำขอ
        $response = curl_exec($ch);
        
        // ตรวจสอบว่ามีข้อผิดพลาดหรือไม่
        if (curl_errno($ch)) {
            return curl_error($ch);
        }
        
        // ปิด cURL
        curl_close($ch);
        return $response;
    }
    function posFeedtMeta($request)
    {
       $tokenaccess = getTokenaccess();
        $fb = new Facebook([
            'app_id' => env('META_APP_ID'),
            'app_secret' => env('META_APP_SECRET'),
            'default_graph_version' => 'v21.0',
        ]);
        try {
            $responseData = [];
            $images = [];
            foreach($request->input('images') as $image){
                $img = getImage($image['url']);
                $images[] = $img;
                $linkData = [
                    'message' => $request->input('message'),
                    'source' => $fb->fileToUpload($img),
                ];

                $response = $fb->post('/'. env('FACEBOOK_PAGE_ID') .'/photos', $linkData,$tokenaccess['access_token']);
                $responseData[] = $response->getGraphNode()['id'];
            }
            foreach($images as $img)
            {
                Storage::delete($img);
            }
            return $responseData;
    } catch(FacebookResponseException $e) {
            echo 'Graph returned an error: ' . $e->getMessage();
            exit;
        } catch(FacebookSDKException $e) {
            echo 'Facebook SDK returned an error: ' . $e->getMessage();
            exit;
        }


    }

    // End Meta API

    function createProductfilter($products)
    {
        // dd($productsCollection);
        $productsCollection = collect($products);
        $csvmasterfile = 'storage/master-data/shopee-master-data.csv';
        $handle = fopen(public_path($csvmasterfile), 'r');
        $header = fgetcsv($handle); // อ่าน Header
        $header = str_replace(' ', '_',$header); // แถวแรกเป็น headers
        $header = str_replace('﻿','',$header);
        $productData = [];
        $rows = 0;

        while (($row = fgetcsv($handle)) !== false) {
            $rows++;
            try {
                $fields = [];
                // foreach($header as $idx => $val){
                //     $row[$idx] = (!$row[$idx] || !isset($row[$idx ])) ? null : $row[$idx];
                // }
                if (count($header) !== count($row)) {
                    Log::warning('Skipped row with mismatched columns. header : '. count($header) .' row column : '. count($row));
                    continue; // ข้ามบรรทัดนี้ไปหากจำนวนคอลัมน์ไม่ตรงกัน
                }
                $item = array_combine($header, $row);
                if (!$item){
                    Log::warning('Skipped row with item false.');
                    continue; // ข้ามบรรทัดนี้ไปหากจำนวนคอลัมน์ไม่ตรงกัน
                }
                $product = $productsCollection->where('itemid',$item['itemid'])->first();
                if($product){
                // เตรียมข้อมูลสำหรับ Products
                    $images = [];
                    if(filter_var($item['additional_image_link'], FILTER_VALIDATE_URL))
                        $images[] = ['field' => 'additional_image_link', 'url' => $item['additional_image_link'],'sortable' => 1];

                    if(filter_var($item['image_link'], FILTER_VALIDATE_URL))
                        $images[] = ['field' => 'image_link', 'url' => $item['image_link'],'sortable' => 2];

                    if(filter_var($item['image_link_3'], FILTER_VALIDATE_URL))
                        $images[] = ['field' => 'image_link_3', 'url' => $item['image_link_3'],'sortable' => 3];

                    if(filter_var($item['image_link_4'], FILTER_VALIDATE_URL))
                        $images[] = ['field' => 'image_link_4', 'url' => $item['image_link_4'],'sortable' => 4];

                    if(filter_var($item['image_link_5'], FILTER_VALIDATE_URL))
                        $images[] = ['field' => 'image_link_5', 'url' => $item['image_link_5'],'sortable' => 5];

                    if(filter_var($item['image_link_6'], FILTER_VALIDATE_URL))
                        $images[] = ['field' => 'image_link_6', 'url' => $item['image_link_6'],'sortable' => 6];

                    if(filter_var($item['image_link_7'], FILTER_VALIDATE_URL))
                        $images[] = ['field' => 'image_link_7', 'url' => $item['image_link_7'],'sortable' => 7];

                    if(filter_var($item['image_link_8'], FILTER_VALIDATE_URL))
                        $images[] = ['field' => 'image_link_8', 'url' => $item['image_link_8'],'sortable' => 8];

                    if(filter_var($item['image_link_9'], FILTER_VALIDATE_URL))
                        $images[] = ['field' => 'image_link_9', 'url' => $item['image_link_9'],'sortable' => 9];

                    if(filter_var($item['image_link_10'], FILTER_VALIDATE_URL))
                        $images[] = ['field' => 'image_link_10', 'url' => $item['image_link_10'],'sortable' => 10];

                    $productData[] = [
                            'itemid' => $item['itemid'],
                            'title' => $item['title'],
                            'shop_name' => $item['shop_name'],
                            'seller_name' => $item['seller_name'],
                            'cb_option' => $item['cb_option'],
                            'stock' => $item['stock'],
                            'item_sold' => $item['item_sold'],
                            'shop_rating' => $item['shop_rating'],
                            'item_rating' => $item['item_rating'],
                            'sale_price' => $item['sale_price'],
                            'price' => $item['price'],
                            'like' => $item['like'],
                            'is_preferred_shop' => $item['is_preferred_shop'],
                            'shopid' => $item['shopid'],
                            'global_category1' => $item['global_category1'],
                            'global_category2' => $item['global_category2'],
                            'global_category3' => $item['global_category3'],
                            'shopee_verified_flag' => $item['shopee_verified_flag'],
                            'is_official_shop' => $item['is_official_shop'],
                            'description' => $item['description'],
                            'seller_penalty_score' => $item['seller_penalty_score'],
                            'condition' => $item['condition'],
                            'discount_percentage' => $item['discount_percentage'],
                            'model_names' => $item['model_names'],
                            'model_ids' => $item['model_ids'],
                            'has_lowest_price_guarantee' => $item['has_lowest_price_guarantee'],
                            'global_brand' => $item['global_brand'],
                            'product_link' => $item['product_link'],
                            'product_short_link' => $item['product_short_link'],
                            'affiliate_link' => $product['afiliate_link'],
                            'images' => $images
                    ];
                }else{
                    continue;
                }
            }catch (\Exception $e) {
                    Log::error('Error processing row: '. $rows ); //. ' : ' . $e->getMessage());
                    continue;
            }
        }
        // ประมวลผล buffer ที่เหลือ
        // if (!empty($productData)) 
        // {
        //     Storage::put($jsonfile,json_encode($productData,JSON_UNESCAPED_UNICODE));
        // }
        fclose($handle);
        return $productData;

    }

    function shopeeParams($itemId = '', $limit = 50, $page = 1)
    {
        return [
                'query' => '{
                    productOfferV2('
                        . 'limit:"'. $limit .'", '
                        . 'page:"'. $page .'"'
                        . ( $itemId != '' ? ', itemId: "'. $itemId .'"' : '' )
                    .'){
                        nodes {
                            productName
                            itemId
                            commissionRate
                            commission
                            price
                            sales
                            imageUrl
                            shopName
                            productLink
                            offerLink
                            periodStartTime
                            periodEndTime
                            priceMin
                            priceMax
                            productCatIds
                            ratingStar
                            priceDiscountRate
                            shopId
                            shopType
                            sellerCommissionRate
                            shopeeCommissionRate
                        }
                        pageInfo {
                            page
                            limit
                            hasNextPage
                            scrollId
                        }
                    }
                }'
        ];
                
    }

    function deleteShopeeImages()
    {
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
            // echo $fileData['file'] . " - " . date("Y-m-d H:i:s", $fileData['time']) . "<br>";
                // if($index >= 11)
            Storage::delete($fileData['file']);
        }
    }
    function nb($number,$dec = 0){
        $number = floatval($number);
        return number_format($number,$dec,'.',',');
    }

    function puthastag($subject, $maxHashtags = 10)
    {
        // แยกคำใน subject ด้วย space หรือคำที่ต้องการ
        $words = preg_split('/\s+/', trim($subject));

        // กรองคำที่ไม่ต้องการ (เช่น ค่าว่างหรือคำที่เป็นตัวอักษรพิเศษ)
        $words = array_filter($words, function ($word) {
            return !empty($word); // ข้ามคำที่เป็นค่าว่าง
        });

        // สร้าง hashtag สำหรับแต่ละคำ
        $hashtags = array_map(function ($word) {
            // ใช้การแปลงข้อความให้เป็น slug สำหรับภาษาอังกฤษ และเก็บภาษาไทยเป็นข้อความปกติ
            if (preg_match('/[a-zA-Z]/', $word)) {
                // สำหรับคำที่มีอักษรภาษาอังกฤษ ใช้ Str::slug
                return '#' . Str::slug($word, '');
            }
            // สำหรับคำที่เป็นภาษาไทย ไม่ต้องแปลง
            return '#' . $word;
        }, $words);

        // จำกัดจำนวน hashtags ไม่เกิน $maxHashtags
        $hashtags = array_slice($hashtags, 0, $maxHashtags);

        // รวม hashtags ด้วย space
        return implode(' ', $hashtags);
    }

    function jsonEncode($str)
    {
        if(!is_array($str))
            return $str;
        
        return json_encode($str,JSON_UNESCAPED_UNICODE);
    }

    function RatingStars($rating) {
        // แปลงคะแนนเป็นทศนิยม
        $rating = floatval($rating);
    
        // ปัดเศษคะแนนเป็น 0.5
        $fullStars = floor($rating);
        $hasHalfStar = ($rating - $fullStars) >= 0.5;
    
        // สร้าง HTML สำหรับแสดงผลดาว
        $html = '<div>';
    
        // สร้างดาวเต็ม
        for ($i = 0; $i < $fullStars; $i++) {
            $html .= '<i class="fa fa-star text-warning"></i>';
        }
    
        // สร้างดาวครึ่ง
        if ($hasHalfStar) {
            $html .= '<i class="fa fa-star-half-o text-warning"></i>';
        }
    
        // สร้างดาวว่าง (ถ้าจำเป็น)
        $emptyStars = 5 - ceil($rating);
        for ($i = 0; $i < $emptyStars; $i++) {
            $html .= '<i class="fa fa-star-o text-warning"></i>';
        }
    
        // แสดงคะแนนเป็นตัวเลข
        $html .= '<small class="text-muted">(' . number_format($rating, 1) . ')</small>';
    
        $html .= '</div>';
    
        return $html;
    }

    function getStartEndDate() {
        $now = Carbon::now();
        $dayOfMonth = $now->day;
        $year = $now->year;
        $month = $now->month;
    
        if ($dayOfMonth > 15) {
            $startDate = Carbon::create($year, $month, 1, 0, 0, 0);
            $endDate = Carbon::create($year, $month, 15, 23, 59, 59);
        } else {
            $lastMonth = $now->copy()->subMonth();
            $lastMonthYear = $lastMonth->year;
            $lastMonthMonth = $lastMonth->month;
            $lastDayOfMonth = $lastMonth->daysInMonth;
    
            $startDate = Carbon::create($lastMonthYear, $lastMonthMonth, 16, 0, 0, 0);
            $endDate = Carbon::create($lastMonthYear, $lastMonthMonth, $lastDayOfMonth, 23, 59, 59);
        }
    
        return [
            'startDate' => $startDate,
            'endDate' => $endDate,
        ];
    }
    
    function getDateRange()
    {
        $today = Carbon::today(); // ดึงวันที่ปัจจุบัน
        $day = $today->day; // ได้ค่าตัวเลขของวันที่ (1-31)

        if ($day > 15) {
            // ถ้าวันที่ปัจจุบันมากกว่า 15
            $dateStart = Carbon::create($today->year, $today->month, 1); // วันที่ 1 ของเดือนปัจจุบัน
            $dateEnd = Carbon::create($today->year, $today->month, 15); // วันที่ 15 ของเดือนปัจจุบัน
        } else {
            // ถ้าวันที่ปัจจุบันน้อยกว่าหรือเท่ากับ 15
            $lastMonth = $today->copy()->subMonth(); // เดือนก่อนหน้า
            $dateStart = Carbon::create($lastMonth->year, $lastMonth->month, 16); // วันที่ 16 ของเดือนก่อน
            $dateEnd = $lastMonth->endOfMonth(); // วันสุดท้ายของเดือนก่อน
        }

        return [
            'startDate' => $dateStart->format('Y-m-d 00:00:00'),
            'endDate' => $dateEnd->format('Y-m-d 23:59:59'),
        ];
    }