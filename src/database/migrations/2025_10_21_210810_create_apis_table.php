<?php

declare(strict_types=1);

use App\Enums\Protocol;
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
        Schema::create('apis', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->foreignId('access_policy_id')->nullable()->constrained('api_access_policies', 'id')->nullOnDelete();
            $table->foreignId('authentication_method_id')->nullable()->constrained('authentication_methods', 'id')->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('api_categories', 'id')->nullOnDelete();
            $table->datetime('deprecated_at')->nullable();
            $table->foreignId('deprecated_by')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->string('deprecation_reason', 255)->nullable();
            $table->string('description', 255);
            $table->string('display_name', 255)->nullable();
            $table->json('document_specification');
            $table->string('protocol', 25)->default(Protocol::Http);
            $table->dateTime('released_at')->nullable();
            $table->foreignId('status_id')->nullable()->constrained('api_statuses', 'id')->nullOnDelete();
            $table->foreignId('type_id')->nullable()->constrained('api_types', 'id')->nullOnDelete();
            $table->string('url', 255);
            $table->string('version', 50);
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
        Schema::dropIfExists('apis');
    }
};
