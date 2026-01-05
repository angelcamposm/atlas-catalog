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
        Schema::create('deployments', function (Blueprint $table) {
            $table->id();

            // Identity & Scope
            $table->foreignId('component_id')->constrained('components')->cascadeOnDelete();
            $table->foreignId('environment_id')->constrained('environments')->cascadeOnDelete();
            $table->foreignId('cluster_id')->nullable()->constrained('clusters')->nullOnDelete();

            // The Artifact
            $table->foreignId('release_id')->nullable()->constrained('releases')->nullOnDelete();
            $table->string('version')->nullable()->comment('Semantic version or tag');
            $table->string('commit_hash', 40)->nullable();
            $table->string('docker_image_digest')->nullable();

            // Execution
            $table->foreignId('workflow_run_id')->nullable()->constrained('workflow_runs')->nullOnDelete();
            $table->foreignId('triggered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status', 20)->default('pending')->index();

            // Timing
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('ended_at')->nullable();
            $table->unsignedInteger('duration_milliseconds')->nullable();

            // The Details (Kitchen Sink)
            $table->json('meta')->nullable()->comment('Stores config diffs, replicas, logs_url, error messages, etc.');

            $table->timestamp('created_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->timestamp('updated_at')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users', 'id')->nullOnDelete();

            // Indexes for Analytics
            $table->index(['component_id', 'environment_id', 'status']);
            $table->index('started_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deployments');
    }
};
