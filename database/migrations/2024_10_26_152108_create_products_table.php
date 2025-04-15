<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('itemid')->nullable()->default(null);
            $table->string('title')->nullable()->default(null);
            $table->string('shopid')->nullable()->default(null);
            $table->string('shop_name')->nullable()->default(null);
            $table->string('seller_name')->nullable()->default(null);
            $table->string('cb_option')->nullable()->default(null);
            $table->integer('stock')->default(0)->nullable();
            $table->integer('item_sold')->default(0)->nullable();
            $table->double('shop_rating')->default(0.00)->nullable();
            $table->double('item_rating')->default(0.00)->nullable();
            $table->double('sale_price')->nullable()->default(0.00);
            $table->double('price')->nullable()->default(0.00);
            $table->integer('like')->nullable()->default(0);
            $table->text('model_ids')->nullable()->default(null);
            $table->text('model_names')->nullable()->default(null);
            $table->text('model_prices')->nullable()->default(null);
            $table->mediumText('description')->nullable()->default(null);
            $table->string('global_category1')->nullable()->default(null);
            $table->string('global_category2')->nullable()->default(null);
            $table->string('global_category3')->nullable()->default(null);
            $table->string('shopee_verified_flag')->nullable()->default(null);
            $table->string('is_preferred_shop')->nullable()->default(null);
            $table->string('is_official_shop')->nullable()->default(null);
            $table->integer('seller_penalty_score')->nullable()->default(0);
            $table->string('condition')->nullable()->default(null);
            $table->string('discount_percentage')->nullable()->default(null);
            $table->string('has_lowest_price_guarantee')->nullable()->default(null);
            $table->string('global_brand')->nullable()->default(null);
            $table->mediumText('product_link')->nullable()->default(null);
            $table->mediumText('product_short_link')->nullable()->default(null);
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
        Schema::dropIfExists('products');
    }
}
