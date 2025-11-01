<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ResourceType;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class ResourceTypeSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
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
