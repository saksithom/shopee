<?php 
namespace App\Services;

use App\Helper\APIShopee;
use App\Models\Commission;
use App\Models\CommissionOrders;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;

class CommissionService
{
    public function __construct()
    {
        if (App::runningInConsole() && $this->isMigrationCommand()) {
            return;
        }
    }
    protected function isMigrationCommand()
    {
        $commands = ['migrate', 'migrate:install', 'migrate:refresh', 'migrate:reset', 'migrate:rollback'];
        return isset($_SERVER['argv'][1]) && in_array($_SERVER['argv'][1], $commands);
    }

    public function excuteCommission ()
    {
        $run = $this->updateReport(1);
        return response()->json($run);
    }
    public function updateReport($page = 1)
    {
        $shopee = new APIShopee();
        $query = [];
        $query[] = 'limit: 25';
        $queryString = implode(', ',$query);
        $response = $shopee->getReports($queryString);
        // echo '<pre>', print_r($response), '</pre>';
        if(!$response || !isset($response['data']['conversionReport']['nodes'])){
            Log::channel('shopee_log')->error('response report errors: '. jsonEncode($response));
            return ['status' => 'error', 'message' => $response, 'page' => $page, 'data' => $response];
        }
        $comms =  $response['data']['conversionReport']['nodes'];
        foreach($comms as $item)
        {
            $this->recordCommission($item);
        }
        $pageinfo =  $response['data']['conversionReport']['pageInfo'];
        // if($pageinfo['hasNextPage'] === true){
        //     echo 'run page : '. ($page + 1) . jsonEncode($pageinfo);
        //     return $this->updateReport($page+1);
        // }

        Log::channel('shopee_log')->info('update reports commission orders successful.');
        return 'Update Commission Successful!';
    }
    public function recordCommission($item = [])
    {
        // Log::channel('shopee_log')->notice('record commission data : ' . jsonEncode($item));
        
        if(!$item || !isset($item['conversionId'])) return false;
        $conversionId = (int) $item['conversionId'];
        $search = [
            'conversionId' => $conversionId
        ];
        $data = [
            'clickTime' => Carbon::createFromTimestamp( $item['clickTime'] ), 
            'purchaseTime' => Carbon::createFromTimestamp($item['purchaseTime']),
            'conversionId' => (int) $item['conversionId'],
            'shopeeCommissionCapped' => $item['shopeeCommissionCapped'], 
            'sellerCommission' => $item['sellerCommission'], 
            'totalCommission' => $item['totalCommission'], 
            'netCommission' => $item['netCommission'], 
            'mcnManagementFeeRate' => (int)$item['mcnManagementFeeRate'] ?? null, 
            'mcnManagementFee' => (int)$item['mcnManagementFee'], 
            'mcnContractId' => (int)$item['mcnContractId'],  
            'linkedMcnName' => $item['linkedMcnName'],  
            'buyerType' => $item['buyerType'], 
            'utmContent' => $item['utmContent'], 
            'device' => $item['device'],  
            'productType' => $item['productType'], 
            'referrer' => $item['referrer'], 
            'orders' => $item['orders']
        ];
        Commission::updateOrCreate($search,$data);
    }

}