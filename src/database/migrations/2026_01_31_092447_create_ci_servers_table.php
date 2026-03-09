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
        Schema::create('ci_servers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('driver', 50)->index()->comment('jenkins, github, gitlab, azure_devops, etc.');
            $table->string('url', 255);

            // Authentication
            $table->foreignId('credential_id')->nullable()->constrained('credentials')->nullOnDelete();

            // Ownership / Scope
            // If null, it's a global/shared server.
            // If set, it belongs to a specific Group (Team/Organization).
            $table->foreignId('owner_id')->nullable()->constrained('groups')->nullOnDelete();

            // Configuration
            $table->json('meta')->nullable()->comment('Driver specific config (e.g. github_org, folder_depth)');
            $table->boolean('is_enabled')->default(true);
            $table->timestamp('last_synced_at')->nullable();

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
        Schema::dropIfExists('ci_servers');
    }
};
