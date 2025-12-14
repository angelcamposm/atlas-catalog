<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Entity;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class EntitySeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            Entity::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                    'is_aggregate' => $item['is_aggregate'],
                    'is_aggregate_root' => $item['is_aggregate_root'],
                ],
            );
        });
    }
}
