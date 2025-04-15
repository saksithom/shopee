<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->dateTime('clickTime')->nullable()->default(null);
            $table->dateTime('purchaseTime')->nullable()->default(null);
            $table->bigInteger('conversionId')->nullable()->default(null);
            $table->double('shopeeCommissionCapped',8,2)->nullable()->default(0.0000);
            $table->double('sellerCommission',8,2)->nullable()->default(0);
            $table->double('totalCommission',8,2)->nullable()->default(0.0000);
            $table->double('netCommission',8,2)->nullable()->default(0.0000);
            $table->double('mcnManagementFeeRate',8,2)->nullable()->default(0.00);
            $table->double('mcnManagementFee',8,2)->nullable()->default(0.0000);
            $table->double('mcnContractId',8,2)->nullable()->default(0);
            $table->string('linkedMcnName')->nullable()->default(null);
            $table->string('buyerType')->nullable()->default(null);
            $table->string('utmContent')->nullable()->default(null);
            $table->string('device')->nullable()->default(null);
            $table->string('productType')->nullable()->default(null);
            $table->string('referrer')->nullable()->default(null);
            $table->json('ordersId')->nullable()->default(null);
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
        Schema::dropIfExists('commissions');
    }
}
