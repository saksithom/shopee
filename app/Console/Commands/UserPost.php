<?php

namespace App\Console\Commands;

use App\Services\FacebookPostService;
use Illuminate\Console\Command;

class UserPost extends Command
{
    protected $signature = 'user:post {page=1} {shared=0}';

    protected $description = 'Share Shopee products to Facebook Profile.';

    protected $facebookPost;
    
    public function __construct(FacebookPostService $facebookPost)
    {
        parent::__construct();
        $this->facebookPost = $facebookPost;
    }
    
    public function handle()
    {
        $page = (int) $this->argument('page');
        $shared = (int) $this->argument('shared');
        $result = $this->facebookPost->executeSharing($page, $shared);

        $this->info("Shared: {$result}");
    }
}
