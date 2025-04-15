<?php

namespace App\Console\Commands;

use App\Services\CommissionService;
use Illuminate\Console\Command;

class CommissionUpdated extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'commission:update';
    protected $description = 'Update Commission orders history';

    protected $commissionservice;
    public function __construct(CommissionService $commissionservice)
    {
        parent::__construct();
        $this->commissionservice = $commissionservice;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $result = $this->commissionservice->excuteCommission();
        $this->info("update response {$result}");
        return $result;
    }
}
