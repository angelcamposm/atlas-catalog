<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\BusinessTier;
use App\Traits\HasDataFile;
use Illuminate\Database\Seeder;

final class BusinessTierSeeder extends Seeder
{
    use HasDataFile;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(self::getRows())->each(function ($item) {
            BusinessTier::updateOrCreate(
                ['name' => $item['name']],
                [
                    'code' => $item['code'],
                    'description' => $item['description'],
                ],
            );
        });
    }
}
