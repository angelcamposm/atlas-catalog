<?php

declare(strict_types=1);

use App\Enums\NodeRole;
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
        Schema::create('cluster_node', function (Blueprint $table) {
            $table->foreignId('cluster_id')->constrained('clusters', 'id')->nullOnDelete();
            $table->foreignId('node_id')->constrained('nodes', 'id')->nullOnDelete();
            $table->string('role', 50)->default(NodeRole::Worker->value);
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
        Schema::dropIfExists('cluster_nodes');
    }
};
