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
        Schema::create('workflow_run_commits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_run_id')->constrained('workflow_runs', 'id')->cascadeOnDelete();
            $table->string('author_email', 255);
            $table->string('author_name', 255);
            $table->timestamp('commit_date');
            $table->string('commit_message', 255);
            $table->string('commit_sha', 40);
            $table->string('ref_name', 255);
            $table->string('repo_url', 255);
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
        Schema::dropIfExists('workflow_run_commits');
    }
};
