<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMediasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medias', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('ref_id')->nullable()->default(0);
            $table->text('url')->nullable()->default(null);
            $table->string('path')->nullable()->default(null);
            $table->string('filename')->nullable()->default(null);
            $table->string('field')->nullable()->default(null);
            $table->integer('sortable')->nullable()->default(0);
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
        Schema::dropIfExists('medias');
    }
}
