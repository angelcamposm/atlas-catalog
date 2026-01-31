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
        Schema::table('workflow_jobs', function (Blueprint $table) {
            $table->foreignId('ci_server_id')->nullable()->after('id')->constrained('ci_servers')->nullOnDelete();
            $table->timestamp('last_synced_at')->nullable()->after('updated_at');

            // Ensure uniqueness per server
            // A job URL should be unique within a specific CI server
            $table->unique(['ci_server_id', 'url'], 'unique_job_per_server');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('workflow_jobs', function (Blueprint $table) {
            $table->dropForeign(['ci_server_id']);
            $table->dropUnique('unique_job_per_server');
            $table->dropColumn(['ci_server_id', 'last_synced_at']);
        });
    }
};
