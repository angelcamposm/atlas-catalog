<?php

namespace Database\Seeders;

use App\Models\ApiStatus;
use Illuminate\Database\Seeder;

class ApiStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/api_statuses.php');

        collect($rows)->each(function ($item) {
            ApiStatus::firstOrCreate(
                ['name' => $item['name']],
                ['description' => $item['description']]
            );
        });
    }
}
