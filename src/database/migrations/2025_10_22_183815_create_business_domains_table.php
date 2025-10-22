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
        Schema::create('business_domains', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('description', 255)->nullable();
            $table->string('display_name', 255);
            $table->string('category', 1);
            $table->boolean('is_active')->default(true);
            $table->foreignId('parent_id')->nullable()->constrained('business_domains', 'id')->nullOnDelete();
            $table->timestamp('created_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users', 'id')->onDelete('cascade');
            $table->timestamp('updated_at')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users', 'id')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_domains');
    }
};
