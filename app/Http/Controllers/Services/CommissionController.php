<?php

namespace App\Http\Controllers\Services;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CommissionController extends Controller
{
    public function index(Request $request)
    {
        return Commission::whereNotNull('orders')
                    ->orderBy('purchaseTime','desc')->paginate($request->input('per_page',24));
    }

    public function totalCommission()
    {
        $commission = [];
        $total = 0;
        $orders = 0;
        $pending = 0;
        $completed = 0;
        $bt = getDateRange();
        
        $items = Commission::whereBetween('purchaseTime',$bt) 
                    ->orderBy('purchaseTime','desc')->paginate(1000);
        foreach($items as $item)
        {
            $orders += count($item->orders);
            $total += $item['netCommission'];
            $commission['net'][] = $item['netCommission'];
            foreach($item->orders as $order)
            {
                foreach($order['items'] as $orderItem)
                {
                    if($order['orderStatus'] == 'PENDING'){
                        $pending += $orderItem['itemTotalCommission'];
                        $commission['pending'][] = $orderItem['itemTotalCommission'];
                    }

                    if($order['orderStatus'] == 'COMPLETED'){
                        $completed += $orderItem['itemTotalCommission'];
                        $commission['completed'][] = $orderItem['itemTotalCommission'];
                    }

                }
            }
        }
        return response()->json([
            // 'items' => $items,
            'pending' => $pending,
            'completed' => $completed,
            'total' => $pending + $completed,
            'net' => $total,
            'orders' => $orders,
            'commission' => $commission,
            'bt' => $bt
        ]);
    }

    public function chunks(Request $request)
    {
        $today = Carbon::today()->day; // วันที่ปัจจุบัน
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        if ($today > 15) {
            // กรณีวันที่มากกว่า 15 -> 1-15 และ 16-ปัจจุบัน
            $startDate0 = Carbon::create($currentYear, $currentMonth, 1)->startOfDay();
            $endDate0   = Carbon::create($currentYear, $currentMonth, 15)->endOfDay();
            $startDate1 = Carbon::create($currentYear, $currentMonth, 16)->startOfDay();
            $endDate1   = Carbon::yesterday()->endOfDay();
            $periods = [
                [
                    date('Y-m-d H:i:s', strtotime($startDate0)),
                    date('Y-m-d H:i:s', strtotime($endDate0))
                ],
                [
                    date('Y-m-d H:i:s', strtotime($startDate1)),
                    date('Y-m-d H:i:s', strtotime($endDate1))
                    
                ]
            ];
        } else {
            // กรณีวันที่น้อยกว่าหรือเท่ากับ 15 -> 16-สิ้นเดือนที่แล้ว และ 1-ปัจจุบัน
            $lastMonth = Carbon::now()->subMonth();
            $startDate0 = Carbon::create($lastMonth->year, $lastMonth->month, 16)->startOfDay();
            $startDate1 = Carbon::create($currentYear, $currentMonth, 1)->startOfDay();
            $endDate0 = Carbon::create($lastMonth->year, $lastMonth->month, $lastMonth->daysInMonth)->endOfDay();
            $endDate1 = Carbon::yesterday()->endOfDay();
            $periods = [
                [
                    date('Y-m-d H:i:s', strtotime($startDate0)),
                    date('Y-m-d H:i:s', strtotime($endDate0 ))
                    
                ],
                [
                    date('Y-m-d H:i:s', strtotime($startDate1)),
                    date('Y-m-d H:i:s', strtotime($endDate1))
                ]
            ];
        }


        $results = [];
        foreach ($periods as $period) {
            Commission::whereBetween('purchaseTime', [$period[0], $period[1]])
                ->orderBy('purchaseTime')
                ->chunk(500, function ($rows) use (&$results) {
                    $results[] = $rows;
                });
        }

        return response()->json(['data' => $results, 'periods' => $periods]);
    }
}
