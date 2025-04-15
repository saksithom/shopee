<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFieldPricOfferlinkTbShared extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('shareds', function (Blueprint $table) {
            $table->double('price',8,2)->nullable()->default(null)->after('productName');
            $table->double('commissionRate',8,2)->nullable()->default(null)->after('price');
            $table->double('commission',8,2)->nullable()->default(null)->after('commissionRate');
            $table->text('shopOfferlink')->nullable()->default(null)->after('commission');
            $table->json('keyshare')->nullable()->default(null)->after('shopOfferlink');
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
            $table->dropColumn('price');
            $table->dropColumn('commissionRate');
            $table->dropColumn('commission');
            $table->dropColumn('shopOfferlink');
            $table->dropColumn('keyshare');
        });
    }
}
