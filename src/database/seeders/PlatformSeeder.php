<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Platform;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class PlatformSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            Platform::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                    'icon' => $item['icon'],
                ],
            );
        });
    }
}
