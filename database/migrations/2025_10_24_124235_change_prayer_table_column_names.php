<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->renameColumn('person', 'prayer_for');
        });
        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->renameColumn('answer', 'prayer_request');
        });

        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->renameColumn('name', 'prayer_request_from');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->renameColumn('prayer_request_from', 'name');
        });
        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->renameColumn('prayer_request', 'answer');
        });
        Schema::table('prayer_requests', function (Blueprint $table) {
            $table->renameColumn('prayer_for', 'person');
        });
    }
};
