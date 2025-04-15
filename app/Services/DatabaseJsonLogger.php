<?php
namespace App\Services;

use Illuminate\Support\Facades\App;
use Monolog\Handler\AbstractProcessingHandler;
use Illuminate\Support\Facades\DB;
use Monolog\Logger;
use Illuminate\Support\Facades\Schema;

class DatabaseJsonLogger extends AbstractProcessingHandler
{
    public function __construct($level = Logger::DEBUG, bool $bubble = true)
    {
        if (App::runningInConsole())
            return;

        parent::__construct($level, $bubble);
    }
    protected function write(array $record): void
    {
        if(Schema::hasTable('logs'))
        DB::table('logs')->insert([
            'level' => strtolower($record['level_name']),
            'message' => $record['message'],
            'context' => json_encode($record['context']),
            'timestamp' => $record['datetime']->format('Y-m-d H:i:s'),
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
