<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ApiAccessPolicy;
use Illuminate\Database\Seeder;

final class ApiAccessPolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/api_access_policies.php');

        collect($rows)->each(function ($item) {
            ApiAccessPolicy::updateOrCreate(
                ['name' => $item['name']],
                ['description' => $item['description']],
            );
        });
    }
}
