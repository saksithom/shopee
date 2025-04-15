<?php

namespace App\Http\Controllers\Services;

use App\Http\Controllers\Controller;
use App\Models\Logs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class LogsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $items = Logs::filter($request)
                    ->orderBy('timestamp','desc')
                    ->orderBy('created_at','desc')
                    ->orderBy('updated_at','desc')
                    ->paginate(50);

        return $items;
    }

    public function readers(Request $request)
    {
        $start = $request->get('start'); // ตัวอย่าง: 2024-12-20
        $end = $request->get('end'); // ตัวอย่าง: 2024-12-20

        // กำหนด path ของไฟล์ log
        $logFilePath = storage_path('logs/shopeeQuery.log');

        if (!file_exists($logFilePath)) {
            return response()->json(['logs' => []]);
        }

        // อ่านข้อมูลจากไฟล์ log
        $logContent = file_get_contents($logFilePath);

        // กรองบรรทัดตามวันที่ที่กำหนด
        $filteredLogs = [];
        if ($start && $end) {
            $logLines = explode("\n", $logContent);
            foreach ($logLines as $line) {
                if (strpos($line, $start) !== false || strpos($line, $end) !== false) { // ตรวจสอบว่ามีวันที่อยู่ในบรรทัดหรือไม่
                    $filteredLogs[] = $line;
                }
            }
        } else {
            $filteredLogs = explode("\n", $logContent); // คืนค่าทั้งหมดหากไม่มีวันที่
        }

        // ส่งข้อมูลกลับในรูปแบบ JSON
        return response()->json(['logs' => $filteredLogs]);
    
    }

    public function destroy($id)
    {   Logs::truncate();
        return response()->json([
            'status' => 'success',
            'message' => 'เคลียร์ Logs เรียบร้อยแล้ว'
        ],204);
        /*
        $logs = storage_path('logs/shopeeQuery.log');
        if (File::exists($logs)) {
            if (File::delete($logs)) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'เคลียร์ Logs file เรียบร้อยแล้ว'
                ]);
            } else {
                return response()->json([
                    'status' => 'warning',
                    'message' => 'เกิดข้อผิดพลาด โปรดทำรายการใหม่อีกครั้ง'
                ]);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'เกิดข้อผิดพลาด Logs file ถูกเคลียร์ไปก่อนหน้านี้แล้ว'
            ]);
        }
        */
    }
}
