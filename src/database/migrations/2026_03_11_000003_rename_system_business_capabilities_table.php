<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('system_business_capabilities', 'business_capability_system');
    }

    public function down(): void
    {
        Schema::rename('business_capability_system', 'system_business_capabilities');
    }
};
