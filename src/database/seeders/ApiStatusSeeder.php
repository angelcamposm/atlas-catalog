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
        $statuses = include database_path('data/api_statuses.php');

        collect($statuses)->each(function ($status) {
            ApiStatus::firstOrCreate(
                ['name' => $status['name']],
                ['description' => $status['description']]
            );
        });
    }
}
