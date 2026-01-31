<?php

declare(strict_types=1);

use App\Enums\CredentialType;
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
        Schema::create('credentials', function (Blueprint $table) {
            $table->id();

            // Identification
            $table->string('name', 100)->unique()->comment('Human readable name (e.g., "Prod DB Read-Only")');
            $table->string('type', 50)->default(CredentialType::ApiToken->value)->index();

            // The "Public" identifier (Username, Client ID, Email, or Certificate CN)
            // Nullable because some tokens (like Bearer) might not have a username.
            $table->string('identity', 255)->nullable()->index();

            // The "Private" secret (Password, Private Key, API Token, JSON blob)
            // CRITICAL: This column must be encrypted at the Model level.
            // We use LONGTEXT to support massive SSH keys or Certificate chains.
            $table->longText('secret')->comment('Encrypted JSON payload containing the actual secrets');

            // Lifecycle
            $table->timestamp('expires_at')->nullable()->index()->comment('When this cert/token expires');
            $table->timestamp('rotated_at')->nullable()->comment('Last time this secret was changed');

            // Metadata (Non-sensitive)
            // Stores things like: {"issuer": "Let's Encrypt", "algo": "RSA-4096", "scope": "read:user"}
            $table->json('meta')->nullable();

            // Audit
            $table->string('description', 255)->nullable();
            $table->boolean('is_enabled')->default(true);

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
        Schema::dropIfExists('credentials');
    }
};
