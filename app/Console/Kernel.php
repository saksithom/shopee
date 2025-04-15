<?php

namespace App\Console;

use App\Models\Apis;
use App\Models\Setting;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $items = Apis::type('facebook')->first();
        $logs = [];
        if($items){
            $m = 0;
            foreach($items->access_code['pages'] as $index => $page)
            {
                $minute = $index > 0 ? "*/" . (int)($m) : '0';
                $m += 5;
                if($page['checked']){
                    $config = Setting::page($page['id'])->first();
                    if($config){
                        $cron = $minute .' */'. (int) $config->options['times'] .' * * *';
                        $schedule->command('autopost:facebook ' . $page['id'])->cron( $cron );
                        if($page['id'] == 630909550101286)
                            Log::channel('shopee_log')->notice("run cronjob {$cron} command autopost:facebook {$page['id']}",['page_id' => $page['id'], 'page_name' => $page['name']]);
                        
                    }
                }
            }
        }

        $schedule->command('commission:update')->cron('0 */3 * * *');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
