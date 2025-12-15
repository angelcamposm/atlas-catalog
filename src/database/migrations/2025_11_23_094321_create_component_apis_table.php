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
        Schema::create('component_apis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('component_id')->nullable()->constrained('components', 'id')->nullOnDelete();
            $table->foreignId('api_id')->nullable()->constrained('apis', 'id')->nullOnDelete();
            $table->string('relationship', 50)->default('uses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('component_apis');
    }
};
