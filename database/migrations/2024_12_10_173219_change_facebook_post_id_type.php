<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeFacebookPostIdType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('shareds', 'facebook_post_id')) {
            Schema::table('shareds', function (Blueprint $table) {
                $table->dropColumn('facebook_post_id');
            });
        }
        Schema::table('shareds', function (Blueprint $table) {
            $table->string('facebook_post_id')->nullable()->default(null)->after('productLink');
            
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
            $table->string('facebook_post_id')->nullable()->default(null)->after('productLink');
        });
    }
}
