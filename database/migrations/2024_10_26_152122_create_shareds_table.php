<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSharedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shareds', function (Blueprint $table) {
            $table->id();
            $table->string('itemid')->nullable()->default(null);
            $table->string('title')->nullable()->default(null);
            $table->string('shop_name')->nullable()->default(null);
            $table->string('seller_name')->nullable()->default(null);
            $table->string('cb_option')->nullable()->default(null);
            $table->integer('stock')->default(0)->nullable();
            $table->integer('item_sold')->default(0)->nullable();
            $table->double('shop_rating')->default(0.00)->nullable();
            $table->double('item_rating')->default(0.00)->nullable();
            $table->double('sale_price')->nullable()->default(0.00);
            $table->double('price')->nullable()->default(0.00);
            $table->mediumText('product_link')->nullable()->default(null);
            $table->mediumText('product_short_link')->nullable()->default(null);
            $table->mediumText('affiliate_link')->nullable()->default(null);
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
        Schema::dropIfExists('shareds');
    }
}
