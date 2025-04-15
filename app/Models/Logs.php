<?php 
namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Logs extends Model
{
    use HasFactory;
    protected $table = 'logs';

    protected $casts =[
        'context' => 'json'
    ];
    
    public function scopeFilter($query,$request)
    {
        if($request->input('level')){
            $levels = explode(',', $request->input('level'));
            $query->whereIn('level', $levels);
        }
        
        if($request->has('page_id') && $request->input('page_id') != ''){
            $query->where(function($query) use ($request) {
                   $query->where('context->page_id',$request->input('page_id'));          
            });
        }

        if($request->input('start') && $request->input('end')){
            $query->whereBetween('timestamp',[
                    $request->input('start'),
                    $request->input('end')
                ]);
        }
        
    }
}