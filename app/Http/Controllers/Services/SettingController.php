<?php

namespace App\Http\Controllers\Services;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $items = Setting::where(function($query) use ($request){
            if($request->has('actived') && $request->input('actived') == 'yes')
                $query->where('actived',1);

            if($request->has('page_id') && $request->input('page_id') !== '')
                $query->where('page_id',$request->input('page_id'));

        })->orderBy('id','desc')->paginate(12);
        return $items;
    }

    public function show($id)
    {
        return Setting::where('page_id',$id)->first();
    }

    public function store(Request $request)
    {
        $search = ['page_id' => $request->input('page_id')];
        $fields = [
            'page' => $request->input('page'),
            'options' => $request->input('options'),
            'type' => $request->input('type'),
            'actived' => $request->input('actived')
        ];
        $item = Setting::updateOrCreate($search, $fields);
        return $item;
    }

    public function destroy($id)
    {
        Setting::where('page_id',$id)->delete();
        return response()->noContent();
    }
}
