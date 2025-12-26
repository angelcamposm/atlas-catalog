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
        Schema::create('release_artifacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('release_id')->constrained('releases', 'id')->cascadeOnDelete();
            $table->string('name')->nullable()->comment('Filename or image tag name');
            $table->string('digest_md5', 32)->nullable();
            $table->string('digest_sha1', 40)->nullable();
            $table->string('digest_sha256', 64)->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->string('type', 50)->comment('Type of artifact (e.g., docker, jar, zip, sbom)');
            $table->string('url', 512)->comment('Direct link to the artifact');
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
        Schema::dropIfExists('release_artifacts');
    }
};
