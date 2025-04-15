<?php

namespace App\Console\Commands;

use App\Models\Setting;
use App\Services\AutopostFacebookService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class AutoFacebookPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autopost:facebook {page_id}';
    protected $description = 'แชร์โพสต์ไปยัง Facebook Page โดยอัตโนมัติ';

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $pageId = $this->argument('page_id'); // รับค่า page_id จากคำสั่ง
        Log::channel('shopee_log')->info("command page_id : ". $pageId);
        
        $service = new AutopostFacebookService($pageId); // สร้าง instance ของ service
        $result = $service->executePost(); // เรียกใช้งานโพสต์
        $item = Setting::where('page_id',$pageId)->first();
        if($item){
            $page = $item->page;
            Log::channel('shopee_log')->info("แชร์โพสต์สำเร็จ",['result' => $result, 'page_id' => $page['id'], 'page_name' => $page['name']]);
        }
        $this->info('แชร์โพสต์สำเร็จ: ' . json_encode($result));
    }
}
