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
        Schema::create('workflow_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_job_id')->constrained('workflow_jobs', 'id')->cascadeOnDelete();
            $table->string('display_name', 255);
            $table->text('description');
            $table->unsignedInteger('duration_milliseconds')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->string('result', 15);
            $table->timestamp('started_at')->nullable();
            $table->foreignId('started_by')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->string('url', 255)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->timestamp('updated_at')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users', 'id')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workflow_runs');
    }
};
