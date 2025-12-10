<?php

declare(strict_types=1);

use App\Enums\K8sLicensingModel;
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
        Schema::create('clusters', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('api_url', 255)->nullable();
            $table->string('cluster_uuid', 255)->nullable();
            $table->string('description', 255)->nullable();
            $table->string('display_name', 50)->nullable();
            $table->string('full_version', 50)->nullable();
            $table->boolean('has_licensing')->default(false);
            $table->foreignId('infrastructure_type_id')->nullable()->constrained('infrastructure_types', 'id')->nullOnDelete();
            $table->string('licensing_model')->default(K8sLicensingModel::None->value);
            $table->foreignId('lifecycle_id')->nullable()->constrained('lifecycles', 'id')->nullOnDelete();
            $table->json('tags')->nullable();
            $table->string('timezone')->nullable();
            $table->foreignId('type_id')->nullable()->constrained('cluster_types', 'id')->nullOnDelete();
            $table->string('version')->nullable();
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
        Schema::dropIfExists('clusters');
    }
};
