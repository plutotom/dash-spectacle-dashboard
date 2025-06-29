<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('espresso_shots', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('timestamp'); // Unix timestamp
            $table->integer('duration'); // Duration in seconds
            $table->json('datapoints'); // All shot datapoints as JSON
            $table->json('profile'); // Profile data as JSON
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('espresso_shots');
    }
};
