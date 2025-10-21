<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ApiAccessPolicy;
use Illuminate\Database\Seeder;

class ApiAccessPolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/file.php');

        collect($rows)->each(function ($item) {
            ApiAccessPolicy::firstOrCreate(
                ['name' => $item['name']],
                ['description' => $item['description']],
            );
        });
    }
}
