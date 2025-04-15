<?php

namespace App\Http\Controllers\Publics;

use App\Http\Controllers\Controller;
use App\Models\Shared;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FontendController extends Controller
{
    public function index(Request $request)
    {
        $items = Shared::filter($request)
                        ->orderBy('updated_at','desc')
                        ->paginate(24);

        return view('index',['products' => $items]);
    }
    public function search(Request $request)
    {
        $items = Shared::filter($request)
                        ->orderBy('updated_at','desc')
                        ->paginate(24);

        return view('index',['products' => $items]);
    }

    public function shopoffers(Request $request)
    {
        DB::statement('SET SESSION sql_mode = ""');
        $items = Shared::query()
                        ->select('shopId', DB::raw('COUNT(*) as total_records'))
                        ->groupBy('shopId')
                        ->orderBy('updated_at','desc')
                        ->paginate(24);

        return view('shops.index',['shops' => $items]);
    }

    public function shopoffers_product($id)
    {
        $item = Shared::where('shopId',$id)->first();
        $products = Shared::where('shopId',$id)->paginate(24);
        return view('products.detail',['shop' => $item, 'products' => $products]);
    }

    public function product($id)
    {
        $item = Shared::where('itemId',$id)->orderBy('updated_at','desc')->first();
        return view('products.detail',['product' => $item]);
    }
}
