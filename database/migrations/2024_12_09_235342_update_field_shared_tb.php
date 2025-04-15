<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFieldSharedTb extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shareds', function (Blueprint $table) {
            $table->integer('shopId')->nullable()->default(null)->after('productName');
            $table->integer('facebook_post_id')->nullable()->default(null)->after('productLink');
            $table->double('ratingStar',4,2)->nullable()->default(null)->after('facebook_post_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shareds', function (Blueprint $table) {
            $table->dropColumn('shopId');
            $table->dropColumn('facebook_post_id');
            $table->dropColumn('ratingStar');
        });
    }
}
