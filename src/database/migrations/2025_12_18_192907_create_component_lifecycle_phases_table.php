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
        Schema::create('component_lifecycle_phases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('component_id')->constrained('components', 'id')->cascadeOnDelete();
            $table->foreignId('lifecycle_phase_id')->constrained('lifecycle_phases', 'id')->cascadeOnDelete();
            $table->timestamp('transitioned_at')->nullable()->comment('The date when the component transitioned to this lifecycle phase.');
            $table->text('notes')->nullable()->comment('Provides additional context about the lifecycle transition, such as reasons for deprecation or retirement.');
            $table->timestamp('created_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->timestamp('updated_at')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->comment('Tracks the lifecycle history of each component, recording the date of each phase transition.');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('component_lifecycle_phases');
    }
};
