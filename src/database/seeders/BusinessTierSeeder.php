<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\BusinessTier;
use Illuminate\Database\Seeder;

final class BusinessTierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = include database_path('data/business_tiers.php');

        collect($rows)->each(function ($item) {
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
