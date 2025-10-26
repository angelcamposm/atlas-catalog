<?php

declare(strict_types=1);

use App\Enums\CpuArchitecture;
use App\Enums\DiscoverySource;
use App\Enums\NodeType;
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
        Schema::create('nodes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 253);
            $table->string('discovery_source', 10)->default(DiscoverySource::Manual->value);
            $table->string('cpu_architecture', 10)->default(CpuArchitecture::X86_64->value);
            $table->unsignedTinyInteger('cpu_sockets')->default(1);
            $table->unsignedTinyInteger('cpu_cores');
            $table->unsignedTinyInteger('cpu_threads');
            $table->boolean('smt_enabled')->default(true);
            $table->unsignedBigInteger('memory_bytes')->default(0);
            $table->string('hostname')->nullable();
            $table->string('fqdn')->nullable();
            $table->ipAddress()->nullable();
            $table->macAddress()->nullable();
            $table->string('node_type', 1)->default(NodeType::Unknown->value);
            $table->string('os');
            $table->string('os_version');
            $table->string('timezone')->default('GTM');
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
        Schema::dropIfExists('nodes');
    }
};
