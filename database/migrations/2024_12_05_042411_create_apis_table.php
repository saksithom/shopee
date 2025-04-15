<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('apis', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->nullable()->default(null);
            $table->string('page_id')->nullable()->default(null);
            $table->string('app_id')->nullable()->default(null);
            $table->string('secret_id')->nullable()->default(null);
            $table->string('client_id')->nullable()->default(null);
            $table->text('user_access_token')->nullable()->default(null);
            $table->text('long_live_access_token')->nullable()->default(null);
            $table->text('page_access_token')->nullable()->default(null);
            $table->json('access_code')->nullable()->default(null);
            $table->string('token_type')->nullable()->default(null);
            $table->string('api_type')->nullable()->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('apis');
    }
}
