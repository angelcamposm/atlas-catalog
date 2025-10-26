<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ApiCategory;
use Illuminate\Database\Seeder;

final class ApiCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/api_categories.php');

        collect($rows)->each(function ($item) {
            ApiCategory::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                ],
            );
        });
    }
}
