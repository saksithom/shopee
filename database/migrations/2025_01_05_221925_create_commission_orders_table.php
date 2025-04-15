<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommissionOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('commission_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commission_id')->nullable()->constrained('commissions');
            $table->string('orderId')->nullable()->default(null);
            $table->string('orderStatus')->nullable()->default(null);
            $table->string('shopType')->nullable()->default(null);
            $table->json('items')->nullable()->default(null);
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
        Schema::dropIfExists('commission_orders');
    }
}
