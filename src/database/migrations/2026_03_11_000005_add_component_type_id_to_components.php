<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('components', function (Blueprint $table) {
            $table->unsignedBigInteger('component_type_id')->nullable()->after('id');
            $table->foreign('component_type_id')->references('id')->on('component_types')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('components', function (Blueprint $table) {
            $table->dropForeign(['component_type_id']);
            $table->dropColumn('component_type_id');
        });
    }
};
