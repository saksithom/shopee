<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateSharedTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shareds', function (Blueprint $table) {
            $table->dropColumn('itemid');
            $table->dropColumn('title');
            $table->dropColumn('shop_name');
            $table->dropColumn('seller_name');
            $table->dropColumn('cb_option');
            $table->dropColumn('stock');
            $table->dropColumn('item_sold');
            $table->dropColumn('shop_rating');
            $table->dropColumn('item_rating');
            $table->dropColumn('sale_price');
            $table->dropColumn('price');
            $table->dropColumn('product_link');
            $table->dropColumn('product_short_link');
            $table->dropColumn('affiliate_link');
        });
        Schema::table('shareds', function (Blueprint $table) {
            $table->string('itemId')->nullable()->default(null)->after('id');
            $table->string('productName')->nullable()->default(null)->after('itemId');
            $table->string('shopName')->nullable()->default(null)->after('productName');
            $table->text('imageUrl')->nullable()->default(null)->after('shopName');
            $table->text('offerLink')->nullable()->default(null)->after('imageUrl');   
            $table->text('productLink')->nullable()->default(null)->after('offerLink');    
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

        });
    }
}
