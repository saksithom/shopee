<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFieldsCommissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
   {
    Schema::table('commissions', function (Blueprint $table) {
        $table->dropColumn('ordersId');    
    });

        Schema::table('commissions', function (Blueprint $table) {
            $table->json('orders')->nullable()->default(null)->after('referrer');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('commissions', function (Blueprint $table) {
            $table->dropColumn('orders');
        });
    }
}
