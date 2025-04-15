<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SharingService;

class ShareShopeeProducts extends Command
{
    protected $signature = 'shopee:share {page=1} {shared=0}';
    protected $description = 'Share Shopee products to Facebook.';

    protected $sharingService;

    public function __construct(SharingService $sharingService)
    {
        parent::__construct();
        $this->sharingService = $sharingService;
    }

    public function handle()
    {
        $page = (int) $this->argument('page');
        $shared = (int) $this->argument('shared');

        $result = $this->sharingService->executeSharing($page, $shared);

        $this->info("Shared: {$result}");
    }
}
