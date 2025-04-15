<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFieldUserForFacebookLogin extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('facebook_id')->nullable()->default(null)->after('email');
            $table->mediumText('facebook_access_token')->nullable()->default(null)->after('facebook_id');
            $table->integer('data_access_expiration_time')->default(0)->nullable()->after('facebook_access_token');
            $table->integer('expiresIn')->default(0)->nullable()->after('data_access_expiration_time');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('facebook_id');
            $table->dropColumn('facebook_access_token');
            $table->dropColumn('data_access_expiration_time');
            $table->dropColumn('expiresIn');
        });
    }
}
