<?php

namespace App\Http\Controllers\Services;

use App\Http\Controllers\Controller;
use App\Http\Resources\SharedCollection;
use App\Models\Shared;
use Illuminate\Http\Request;

class SharedController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $items = Shared::filter($request)
                        ->orderBy('updated_at','desc')
                        ->paginate($request->input('per_page',12));
        return new SharedCollection($items);
    }

    public function store(Request $request)
    {
        return Shared::whereIn('itemId',$request->input('itemsIds'))
                        ->thismonth()->get();
    }

}
