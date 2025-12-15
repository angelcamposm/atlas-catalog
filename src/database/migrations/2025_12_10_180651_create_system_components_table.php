<?php

declare(strict_types=1);

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
        Schema::create('system_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('system_id')->references('id')->on('systems')->cascadeOnDelete();
            $table->foreignId('component_id')->references('id')->on('components')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_components');
    }
};
