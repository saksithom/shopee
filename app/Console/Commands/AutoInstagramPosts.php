<?php

namespace App\Console\Commands;

use App\Services\AutopostInstagramService;
use Illuminate\Console\Command;

class AutoInstagramPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autopost:instagram {page_id}';
    protected $description = 'แชร์โพสต์ไปยัง Public Instagram โดยอัตโนมัติ';

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
        $service = new AutopostInstagramService($pageId); // สร้าง instance ของ service
        $result = $service->executePost(); // เรียกใช้งานโพสต์

        $this->info('แชร์โพสต์สำเร็จ: ' . json_encode($result));
    }
}
