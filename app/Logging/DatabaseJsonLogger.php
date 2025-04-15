<?php 
namespace App\Logging;

use App\Services\DatabaseJsonLogger as ServicesDatabaseJsonLogger;
use Monolog\Logger;
use Monolog\Handler\AbstractProcessingHandler;
use Illuminate\Support\Facades\DB;

class DatabaseJsonLogger
{
    public function __invoke(array $config)
    {
        return new Logger('custom', [new ServicesDatabaseJsonLogger()]);
    }

}


