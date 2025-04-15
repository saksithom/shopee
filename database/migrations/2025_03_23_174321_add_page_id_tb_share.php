<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPageIdTbShare extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shareds', function (Blueprint $table) {
            $table->bigInteger('page_id')->nullable()->default(0)->after('shopee_page');
            $table->string('page_name')->nullable()->default(null)->after('page_id');
            $table->string('page_type',20)->nullable()->default(null)->after('page_name');
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
            $table->dropColumn('page_id');
            $table->dropColumn('page_name');
            $table->dropColumn('page_type');
        });
    }
}
