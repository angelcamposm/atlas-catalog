<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ResourceType;
use Illuminate\Database\Seeder;

final class ResourceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/resource_types.php');

        collect($rows)->each(function ($item) {
            ResourceType::updateOrCreate(
                ['name' => $item['name']],
                [
                    'category' => $item['category'],
                    'description' => $item['description'],
                    'icon' => $item['icon'],
                ],
            );
        });
    }
}
