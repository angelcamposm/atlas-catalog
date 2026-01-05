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
        Schema::create('cluster_service_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cluster_id')->constrained('clusters', 'id')->cascadeOnDelete();
            $table->foreignId('service_account_id')->constrained('service_accounts', 'id')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cluster_service_accounts');
    }
};
