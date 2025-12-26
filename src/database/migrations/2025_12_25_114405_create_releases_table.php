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
        Schema::create('releases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('component_id')->constrained('components', 'id')->cascadeOnDelete();
            $table->foreignId('workflow_run_id')->nullable()->constrained('workflow_runs', 'id')->nullOnDelete();
            $table->text('changelog')->nullable()->comment('Release notes or changelog summary');
            $table->json('metadata')->nullable()->comment('Additional build metadata');
            $table->timestamp('released_at')->useCurrent();
            $table->string('status', 20)->default('published')->comment('Release status (e.g., draft, published, deprecated)');
            $table->string('version')->comment('Semantic version or tag name');
            $table->timestamp('created_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->timestamp('updated_at')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users', 'id')->nullOnDelete();

            // Indexes
            $table->unique(['component_id', 'version']); // Ensure version uniqueness per component
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('releases');
    }
};
