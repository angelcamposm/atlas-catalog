<?php

namespace Database\Seeders;

use App\Models\ApiStatus;
use Illuminate\Database\Seeder;

final class ApiStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/api_statuses.php');

        collect($rows)->each(function ($item) {
            ApiStatus::updateOrCreate(
                ['name' => $item['name']],
                ['description' => $item['description']],
            );
        });
    }
}
