<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ApiType;
use Illuminate\Database\Seeder;

class ApiTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/api_types.php');

        collect($rows)->each(function ($item) {
            ApiType::firstOrCreate(
                ['name' => $item['name']],
                ['description' => $item['description']],
            );
        });
    }
}
