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
        Schema::create('environments', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('abbr', 3)->nullable();
            $table->boolean('approval_required')->default(false);
            $table->string('description', 255)->nullable();
            $table->boolean('display_in_matrix')->default(false);
            $table->string('display_name', 50)->nullable();
            $table->foreignId('owner_id')->nullable()->constrained('users', 'id')->onDelete('cascade');
            $table->string('prefix', 3)->nullable();
            $table->integer('sort_order')->default(0);
            $table->string('suffix', 3)->nullable();
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
        Schema::dropIfExists('environments');
    }
};
