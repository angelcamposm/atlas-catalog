<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ServiceModel;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

final class ServiceModelSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            ServiceModel::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'abbrv' => $item['abbrv'],
                    'display_name' => $item['display_name'],
                    'description' => Str::limit($item['description'], 255),
                ],
            );
        });
    }
}
