<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\InfrastructureType;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class InfrastructureTypeSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            InfrastructureType::updateOrCreate(
                ['name' => $item['name']],
                [
                    'description' => $item['description'],
                ],
            );
        });
    }
}
