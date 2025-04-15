<?php

namespace App\Http\Controllers\Automates;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FacebookController extends Controller
{
    public function login(Request $request)
    {

    }

    public function callback(Request $request)
    {
        return $request->all();
    }
}
