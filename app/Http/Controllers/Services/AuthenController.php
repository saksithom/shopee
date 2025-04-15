<?php

namespace App\Http\Controllers\Services;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuthenResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthenController extends Controller
{
    public function login(Request $request) {
        $credentials = $request->only('email', 'password');
    
        if (Auth::attempt($credentials,$request->input('rememberme') == 1 ? true : false)) {
            $user = Auth::user();
            $token = $user->createToken('authToken')->plainTextToken;
            
            return response()->json([
                'token' => $token,
                'user' => $user
            ]);
        }
    
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    public function facebookLogin(Request $request)
    {
        $chkUser = User::where('facebook_id',$request->facebook_id)->orWhere('email', $request->email)->first();
        $user = $chkUser ? $chkUser : new User();

        $user->facebook_id = $request->facebook_id;
        $user->avatar = $request->avatar;
        $user->email = $request->email;
        $user->password = Hash::make('devNong1985');
        $user->name = $request->name;
        $user->facebook_access_token = $request->facebook_access_token;
        $user->data_access_expiration_time = $request->data_access_expiration_time;
        $user->expiresIn = $request->expiresIn;
        $user->save();

        Auth::login($user);
        $token = $user->createToken('authToken')->plainTextToken;
            
        return response()->json([
                'user_access_token' => $user->facebook_access_token,
                'token_type' => 'Bearer',
                'token' => $token,
                'user' => $user
        ],200);
    }
    public function userinfo()
    {
        if(Auth::check())
            return new AuthenResource(Auth::user()); // response()->json(Auth::user(),200);
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    public function updatePassword(Request $request)
    {
        if(Auth::check()){
            $user = User::find(Auth::user()->id);
            $user->password = Hash::make($request->input('password'));
            $user->save();
            return new AuthenResource(Auth::user()); // response()->json(Auth::user(),200);
        }
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    public function updateProfile(Request $request)
    {
        if(Auth::check()){
            $user = User::find(Auth::user()->id);
            $user->name = $request->input('name');
            $user->save();
            return new AuthenResource(Auth::user()); // response()->json(Auth::user(),200);
        }
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    public function logout(Request $request)
    {
        // ลบ token ของผู้ใช้ที่กำลังใช้งานอยู่
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
