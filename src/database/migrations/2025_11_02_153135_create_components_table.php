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
        Schema::create('components', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description', 255)->nullable();
            $table->string('discovery_source')->nullable();
            $table->string('display_name')->nullable();
            $table->foreignId('domain_id')->nullable()->constrained('business_domains', 'id')->nullOnDelete();
            $table->boolean('has_zero_downtime_deployments')->default(false);
            $table->boolean('is_stateless')->default(true);
            $table->foreignId('lifecycle_id')->nullable()->constrained('lifecycles', 'id')->nullOnDelete();
            $table->foreignId('owner_id')->nullable()->constrained('groups', 'id')->nullOnDelete();
            $table->foreignId('platform_id')->nullable()->constrained('platforms', 'id')->nullOnDelete();
            $table->string('slug')->unique();
            $table->json('tags')->nullable();
            $table->foreignId('tier_id')->nullable()->constrained('business_tiers', 'id')->nullOnDelete();
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
        Schema::dropIfExists('components');
    }
};
